
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../models/User");
const Food = require("../models/Food");
const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Allowed order statuses
const allowedStatuses = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

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
      .populate("user", "name email phone")
      .populate("items.food", "name image price")
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

// PATCH: Update order status
router.patch(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;

      // Validate MongoDB order ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      // Validate order status
      if (!allowedStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
          allowedStatuses,
        });
      }

      // Find and update order
      const order = await Order.findByIdAndUpdate(
        id,
        { $set: { orderStatus } },
        { new: true, runValidators: true }
      )
        .populate("user", "name email phone")
        .populate("items.food", "name image price");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Order status update error:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to update order status",
      });
    }
  }
);

// GET: Customers list for Admin
router.get("/customers", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    // Optional: attach order counts per customer
    const userIds = customers.map((c) => c._id);
    const orderCounts = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", count: { $sum: 1 }, totalSpent: { $sum: "$totalAmount" } } },
    ]);

    const countMap = {};
    orderCounts.forEach((oc) => {
      countMap[oc._id.toString()] = { count: oc.count, totalSpent: oc.totalSpent };
    });

    const customersWithStats = customers.map((c) => ({
      ...c.toObject(),
      orderCount: countMap[c._id.toString()]?.count || 0,
      totalSpent: countMap[c._id.toString()]?.totalSpent || 0,
    }));

    res.status(200).json({
      success: true,
      count: customersWithStats.length,
      customers: customersWithStats,
    });
  } catch (error) {
    console.error("Admin customers error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
});

module.exports = router;
