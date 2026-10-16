
const express = require("express");
const router = express.Router();

const Food = require("../models/Food");
const Category = require("../models/Category");

// GET foods with search and filters
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const filter = { isAvailable: true };

    // Search by food name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category name
    if (category) {
      const foundCategory = await Category.findOne({
        name: {
          $regex: `^${category}$`,
          $options: "i",
        },
      });

      if (!foundCategory) {
        return res.status(200).json({
          success: true,
          count: 0,
          foods: [],
        });
      }

      filter.category = foundCategory._id;
    }

    // Validate and filter by price
    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice === undefined ? 0 : Number(minPrice);
      const max = maxPrice === undefined
        ? Infinity
        : Number(maxPrice);

      if (
        !Number.isFinite(min) ||
        min < 0 ||
        (maxPrice !== undefined &&
          (!Number.isFinite(max) || max < min))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid price range",
        });
      }

      filter.price = { $gte: min };

      if (maxPrice !== undefined) {
        filter.price.$lte = max;
      }
    }

    const foods = await Food.find(filter)
      .populate("category", "name image")
      .sort({ createdAt: -1 });

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

// GET one food by ID
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
