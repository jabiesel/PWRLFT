const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Coach = require("../models/Coaches");

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!["coach", "athlete"].includes(role)) {
    return res.status(400).json({ error: "Role not specified." });
  }

  try {
    let newUser;
    if (role === "coach") {
      newUser = new Coach({ username, email, password, role });
    } else {
      newUser = new User({ username, email, password, role });
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Username or email already exists." });
    } else {
      res.status(500).json({ error: "Server error during user registration." });
    }
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check both collections for the user
    const user =
      (await User.findOne({ email })) || (await Coach.findOne({ email }));

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
        expiresIn: "1d",
      });
      res.json({
        message: "User logged in",
        token,
        username: user.username,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User Settings
exports.updateUserSettings = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

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

// Get User Settings
exports.getUserSettings = async (req, res) => {
  const userId = req.user.id;
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
