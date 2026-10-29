
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/Order");
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/orders/my - get logged in user's orders
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.food", "name image price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Fetch my orders error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

// POST /api/orders - place an order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items cannot be empty",
      });
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // Verify items and check availability
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const foodId = item.food?._id || item.food?.id || item.foodId || item._id;
      if (!mongoose.Types.ObjectId.isValid(foodId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid food ID: ${foodId}`,
        });
      }

      const food = await Food.findById(foodId);
      if (!food) {
        return res.status(400).json({
          success: false,
          message: `Food item not found or has been removed.`,
        });
      }

      if (!food.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `"${food.name}" is currently unavailable and cannot be ordered.`,
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      verifiedItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity: qty,
      });

      calculatedSubtotal += food.price * qty;
    }

    // Delivery & tax
    const deliveryFee = calculatedSubtotal > 499 ? 0 : 40;
    const packagingFee = 20;
    const tax = Math.round(calculatedSubtotal * 0.05);
    const totalAmount = req.body.totalAmount || (calculatedSubtotal + deliveryFee + packagingFee + tax);

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
      paymentMethod: paymentMethod === "RAZORPAY" ? "RAZORPAY" : "COD",
      paymentStatus: paymentMethod === "RAZORPAY" ? "PAID" : "PENDING",
      orderStatus: "PLACED",
    });

    const populated = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.food", "name image price");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populated,
    });
  } catch (error) {
    console.error("Place order error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
});

module.exports = router;

