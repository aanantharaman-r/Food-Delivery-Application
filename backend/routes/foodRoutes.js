
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Food = require("../models/Food");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET foods with search and filters (Customer-facing: filters by isAvailable=true unless all=true is passed)
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, includeUnavailable } = req.query;

    const filter = {};
    if (includeUnavailable !== "true") {
      filter.isAvailable = true;
    }

    // Search by food name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category name or category ID
    if (category && category !== "all") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
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
    }

    // Validate and filter by price
    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice === undefined ? 0 : Number(minPrice);
      const max = maxPrice === undefined ? Infinity : Number(maxPrice);

      if (
        !Number.isFinite(min) ||
        min < 0 ||
        (maxPrice !== undefined && (!Number.isFinite(max) || max < min))
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
    console.error("Fetch foods error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch foods",
    });
  }
});

// GET one food by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }

    const food = await Food.findById(req.params.id).populate(
      "category",
      "name image"
    );

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
    res.status(500).json({
      success: false,
      message: "Failed to fetch food details",
    });
  }
});

// POST: Create a new food (Protected: Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable, rating } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required (>= 0)",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Resolve category id if category name or ID passed
    let categoryId = category;
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const foundCategory = await Category.findOne({
        name: { $regex: `^${category}$`, $options: "i" },
      });
      if (!foundCategory) {
        return res.status(400).json({
          success: false,
          message: "Selected category does not exist",
        });
      }
      categoryId = foundCategory._id;
    }

    const newFood = await Food.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      price: Number(price),
      image: image ? image.trim() : "",
      category: categoryId,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      rating: rating ? Math.min(5, Math.max(0, Number(rating))) : 4.5,
    });

    const populatedFood = await Food.findById(newFood._id).populate(
      "category",
      "name image"
    );

    res.status(201).json({
      success: true,
      message: "Food created successfully",
      food: populatedFood,
    });
  } catch (error) {
    console.error("Create food error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create food",
    });
  }
});

// PUT / PATCH: Update food item (Protected: Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }

    const updates = {};
    const { name, description, price, image, category, isAvailable, rating } = req.body;

    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (price !== undefined) {
      if (isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid price is required (>= 0)",
        });
      }
      updates.price = Number(price);
    }
    if (image !== undefined) updates.image = image.trim();
    if (isAvailable !== undefined) updates.isAvailable = Boolean(isAvailable);
    if (rating !== undefined) updates.rating = Math.min(5, Math.max(0, Number(rating)));

    if (category !== undefined) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        updates.category = category;
      } else {
        const foundCategory = await Category.findOne({
          name: { $regex: `^${category}$`, $options: "i" },
        });
        if (!foundCategory) {
          return res.status(400).json({
            success: false,
            message: "Selected category does not exist",
          });
        }
        updates.category = foundCategory._id;
      }
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("category", "name image");

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error("Update food error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update food",
    });
  }
});

// DELETE: Delete a food item (Protected: Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }

    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Delete food error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete food",
    });
  }
});

module.exports = router;
