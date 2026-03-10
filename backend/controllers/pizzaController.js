const Pizza = require("../models/Pizza");

// Get all pizzas
exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add new pizza
exports.addPizza = async (req, res) => {
  try {
    const { name, base, sauce, cheese, veggies, price } = req.body;

    const pizza = new Pizza({
      name,
      base,
      sauce,
      cheese,
      veggies,
      price
    });

    await pizza.save();

    res.json({ message: "Pizza added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const Inventory = require("../models/Inventory");

exports.getPizzaOptions = async (req, res) => {
  try {

    const bases = await Inventory.find({ category: "base" });
    const sauces = await Inventory.find({ category: "sauce" });
    const cheese = await Inventory.find({ category: "cheese" });
    const veggies = await Inventory.find({ category: "veggies" });
    const meat = await Inventory.find({ category: "meat" });

    res.json({
      bases,
      sauces,
      cheese,
      veggies,
      meat
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }
};