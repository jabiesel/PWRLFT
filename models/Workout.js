const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: [
        {
          reps: { type: Number, required: true },
          weight: { type: Number, required: true },
          rpe: { type: Number, required: true },
        },
      ],
    },
  ],
  coachNotes: { type: String },
});

const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout;
