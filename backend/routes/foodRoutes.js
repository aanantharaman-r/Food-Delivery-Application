
const express = require("express");
const router = express.Router();

const Food = require("../models/Food");

// GET all available foods
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find({
      isAvailable: true,
    }).populate("category", "name image");

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch foods",
    });
  }
});

// GET food by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category", "name image");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid food ID",
    });
  }
});

module.exports = router;
