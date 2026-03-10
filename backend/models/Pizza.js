const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: String,
  description: String,
  base: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  meat: [String],
  price: Number,
  image: String
});

module.exports = mongoose.model("Pizza", pizzaSchema);