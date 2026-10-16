
require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./models/User");
const Food = require("./models/Food");
const Category = require("./models/Category");
const Order = require("./models/Order");

async function testModels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected!");

    console.log("User Model:", User.modelName);
    console.log("Food Model:", Food.modelName);
    console.log("Category Model:", Category.modelName);
    console.log("Order Model:", Order.modelName);

    console.log("All models loaded successfully!");
  } catch (error) {
    console.error("Model test failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testModels();
