const mongoose = require("mongoose");

const workoutTemplateSchema = new mongoose.Schema({
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  description: { type: String },
  days: [
    {
      dayOfWeek: { type: String, required: true },
      exercises: [
        {
          name: { type: String, required: true },
          description: { type: String },
          sets: { type: Number, required: true },
          reps: { type: Number, required: true },
          weight: { type: Number, optional: true }, // Optional, can be suggested or calculated
          rpe: { type: Number, optional: true }, // Optional RPE value
          notes: { type: String, optional: true }, // Optional notes
        },
      ],
    },
  ],
});

const workoutTemplate = mongoose.model(
  "workoutTemplate",
  workoutTemplateSchema
);
module.exports = workoutTemplate;
