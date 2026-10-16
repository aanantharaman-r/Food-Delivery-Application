
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Food Delivery Backend is Running!");
});

// Food API routes
app.use("/api/foods", foodRoutes);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
