const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");

// Create a new workout template
router.post("/workout-templates", workoutController.createWorkoutTemplate);

// Get all workout templates for a coach
router.get("/workout-templates", workoutController.getWorkoutTemplates);

// Update a specific workout template
router.put(
  "/workout-templates/:templateId",
  workoutController.updateWorkoutTemplate
);

// Delete a specific workout template
router.delete(
  "/workout-templates/:templateId",
  workoutController.deleteWorkoutTemplate
);

// Copy a workout template for multiple weeks
router.post(
  "/workout-templates/:templateId/copy",
  workoutController.copyWorkoutTemplate
);

module.exports = router;
