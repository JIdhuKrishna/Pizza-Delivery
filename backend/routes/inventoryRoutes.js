const express = require("express");
const router = express.Router();

const {
  addInventory,
  getInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/inventoryController");

const { protect, isAdmin } = require("../middleware/authMiddleware");


router.post("/", protect, isAdmin, addInventory);

router.get("/", protect, isAdmin, getInventory);

router.put("/:id", protect, isAdmin, updateInventory);

router.delete("/:id", protect, isAdmin, deleteInventory);


module.exports = router;