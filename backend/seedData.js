
require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("./models/Category");
const Food = require("./models/Food");

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected!");

    // Create categories
    const categoryNames = ["Burger", "Pizza", "Biryani"];

    for (const name of categoryNames) {
      await Category.updateOne(
        { name },
        { $setOnInsert: { name, image: "" } },
        { upsert: true }
      );
    }

    const categories = await Category.find();
    const burgerCategory = categories.find(
      (category) => category.name === "Burger"
    );

    // Add sample foods only if they don't already exist
    const sampleFoods = [
      {
        name: "Classic Burger",
        description: "Delicious burger with fresh vegetables",
        price: 149,
        category: burgerCategory._id,
        isAvailable: true,
      },
      {
        name: "Cheese Burger",
        description: "Burger with melted cheese",
        price: 199,
        category: burgerCategory._id,
        isAvailable: true,
      },
    ];

    for (const food of sampleFoods) {
      await Food.updateOne(
        { name: food.name },
        { $setOnInsert: food },
        { upsert: true }
      );
    }

    console.log("Sample categories and foods added!");
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();
