const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

  itemName: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  threshold: {
    type: Number,
    default: 10
  },

  price: {
    type: Number,
    required: true
  }

});

module.exports = mongoose.model("Inventory", inventorySchema);