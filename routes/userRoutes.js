const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserSettings,
  getUserSettings,
} = require("../controllers/userController");

// Register route
router.post("/auth/register", registerUser);

// Login route
router.post("/auth/login", loginUser);

// Update user settings
router.put("/settings", updateUserSettings);

// Get user settings
router.get("/settings", getUserSettings);

module.exports = router;
