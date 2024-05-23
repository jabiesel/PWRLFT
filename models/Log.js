const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
  date: { type: Date, default: Date.now },
  bodyWeight: { type: Number },
  performance: [
    {
      exercise: { type: String },
      setDetails: {
        reps: { type: Number },
        weight: { type: Number },
        rpe: { type: Number },
      },
    },
  ],
});

const Log = mongoose.model("Log", logSchema);
module.exports = Log;
