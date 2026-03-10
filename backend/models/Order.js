const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  pizzaBase: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  meat: [String],

  items: [
    {
      pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: "Pizza" },
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    }
  ],

  price: Number,

  paymentStatus: {
    type: String,
    default: "Pending"
  },

  orderStatus: {
    type: String,
    default: "Order Received",
    enum: [
      "Order Received",
      "In the Kitchen",
      "Sent to Delivery",
      "Delivered"
    ]
  },

  deliveredAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);