const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const coachSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["coach"],
    default: "coach",
  },
  settings: {
    unit: { type: String, default: "kg" }, // Default weight unit
    language: { type: String, default: "English" }, // Default language
  },
});

// Hash the password before saving the user
coachSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Coach = mongoose.model("Coach", coachSchema);
module.exports = Coach;
