
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Food = require("../models/Food");
const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET: Admin dashboard statistics
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [totalUsers, totalFoods, totalOrders, revenueResult] =
      await Promise.all([
        User.countDocuments(),
        Food.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          {
            $match: {
              paymentStatus: "PAID",
              orderStatus: { $ne: "CANCELLED" },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
        ]),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFoods,
        totalOrders,
        totalRevenue: revenueResult[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
});

// GET: Fetch all customer orders
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Admin orders error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

module.exports = router;
