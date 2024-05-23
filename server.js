const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Import user routes
const workoutRoutes = require("./routes/workoutRoutes"); // Import workout routes

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Use the routes
app.use("/api", userRoutes); // This will mount your user routes under the /api prefix
app.use("/api", workoutRoutes); // Use workout routes under the /api prefix

app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log("Connecting to MongoDB with URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((err) => console.error("Connection error", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
