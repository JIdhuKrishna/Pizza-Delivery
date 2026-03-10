const Inventory = require("../models/Inventory");


// Add Inventory Item
exports.addInventory = async (req, res) => {

  try {

    const item = new Inventory(req.body);

    await item.save();

    res.json({ message: "Inventory item added", item });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


// Get Inventory
exports.getInventory = async (req, res) => {

  try {

    const items = await Inventory.find();

    res.json(items);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


// Update Inventory
exports.updateInventory = async (req, res) => {

  try {

    const { id } = req.params;

    const item = await Inventory.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: "after" }
    );

    res.json(item);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


// Delete Inventory
exports.deleteInventory = async (req, res) => {

  try {

    const { id } = req.params;

    await Inventory.findByIdAndDelete(id);

    res.json({ message: "Inventory item deleted" });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};