const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin/inventory", inventoryRoutes);
app.use("/api/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Pizza Delivery API Running 🚀");
});

// Global Error Handler (good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});