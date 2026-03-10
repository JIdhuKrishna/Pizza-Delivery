const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/place", protect, placeOrder);
router.get("/user/:userId", protect, getUserOrders);
router.get("/", protect, isAdmin, getAllOrders);
router.put("/status/:orderId", protect, isAdmin, updateOrderStatus);

module.exports = router;