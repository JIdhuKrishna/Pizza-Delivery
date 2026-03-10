const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const sendEmail = require("../utils/sendEmail");


// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { 
      pizzaBase, sauce, cheese, veggies, meat, price, 
      isCartOrder, items, userId: customUserId 
    } = req.body;

    const userId = customUserId || req.user.id;

    // 1. Handle Inventory Reduction (Common for custom pizzas single or in cart)
    const reduceStock = async (itemName) => {
      if (!itemName) return;
      const item = await Inventory.findOneAndUpdate(
        { itemName },
        { $inc: { quantity: -1 } },
        { new: true }
      );
      if (item && item.quantity < item.threshold) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Low Stock Alert",
          `${item.itemName} stock is below threshold. Current stock: ${item.quantity}`
        );
      }
    };

    if (isCartOrder && items) {
      // Logic for cart items (could be premade pizzas or multiple custom)
      // For premade pizzas, we might not reduce ingredients individually 
      // but let's assume all pizzas reduce "Stock" generally or just skip for now
    } else {
      // Single custom order logic
      await reduceStock(pizzaBase);
      await reduceStock(sauce);
      await reduceStock(cheese);
      if (veggies) for (let v of veggies) await reduceStock(v);
      if (meat) for (let m of meat) await reduceStock(m);
    }

    // 2. Create Order
    const orderData = {
      userId,
      price,
      paymentStatus: "Paid", 
      orderStatus: "Order Received",
    };

    if (isCartOrder) {
      orderData.items = items.map(i => ({
        pizzaId: i._id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity || 1
      }));
      // Assign first item's defaults for backward compatibility if needed
      orderData.pizzaBase = "Cart Order";
    } else {
      orderData.pizzaBase = pizzaBase;
      orderData.sauce = sauce;
      orderData.cheese = cheese;
      orderData.veggies = veggies;
      orderData.meat = meat;
    }

    const order = new Order(orderData);
    await order.save();

    res.json({ message: "Order placed successfully", order });

  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// GET USER ORDERS (hides delivered orders after 5 minutes)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const orders = await Order.find({
      userId,
      $or: [
        { orderStatus: { $ne: "Delivered" } },
        { deliveredAt: { $gt: fiveMinutesAgo } },
        { deliveredAt: null }
      ]
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updateData = { orderStatus: status };
    if (status === "Delivered") {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Send delivery email to user
    if (status === "Delivered" && order.userId?.email) {
      const orderDesc = order.items?.length
        ? order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")
        : [order.pizzaBase, order.sauce, order.cheese].filter(Boolean).join(", ");

      try {
        await sendEmail(
          order.userId.email,
          "🍕 Your PizzaCraft Order Has Been Delivered!",
          `Hi ${order.userId.name || "Customer"},\n\nGreat news! Your order #${orderId.slice(-8).toUpperCase()} has been delivered!\n\nOrder: ${orderDesc}\nTotal: ₹${order.price}\n\nThank you for choosing PizzaCraft. Enjoy your pizza! 🍕\n\nTeam PizzaCraft`
        );
      } catch (emailErr) {
        console.error("Delivery email failed:", emailErr.message);
      }
    }

    res.json({ message: "Status updated", order });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// ADMIN: GET ALL ORDERS
exports.getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find().populate("userId", "name email");

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};