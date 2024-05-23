const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// Updated registration function
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validate the role
  if (!["coach", "athlete"].includes(role)) {
    return res.status(400).json({ error: "Role not specified." });
  }

  try {
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      res.status(400).json({ error: "Username or email already exists." });
    } else {
      res.status(500).json({ error: "Server error during user registration." });
    }
  }
};

// Login function that authenticates the user and returns a JWT token
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
        expiresIn: "1d",
      });
      res.json({ message: "User logged in", token });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update user settings
exports.updateUserSettings = async (req, res) => {
  const userId = req.user.id; // Assuming `req.user` is populated from JWT middleware
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update fields if they are provided
    if (req.body.password)
      user.password = await bcrypt.hash(req.body.password, 10);
    if (req.body.language) user.language = req.body.language;
    if (req.body.weightUnit) user.weightUnit = req.body.weightUnit;

    await user.save();
    res.status(200).send("User settings updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user settings: " + error.message);
  }
};

// Function to get user settings
exports.getUserSettings = async (req, res) => {
  const userId = req.user.id; // Assuming `req.user` is populated from JWT middleware
  try {
    const user = await User.findById(userId).select("language weightUnit");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      language: user.language,
      weightUnit: user.weightUnit,
    });
  } catch (error) {
    res.status(500).send("Error retrieving user settings: " + error.message);
  }
};
