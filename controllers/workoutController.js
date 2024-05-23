const WorkoutTemplate = require("../models/WorkoutTemplate");
const Workout = require("../models/Workout");

// Function to get all workout templates
const getWorkoutTemplates = async (req, res) => {
  try {
    const templates = await WorkoutTemplate.find({ coachId: req.user.id }); // Assuming you're filtering by coachId
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to create a new workout template
const createWorkoutTemplate = async (req, res) => {
  try {
    const newTemplate = new WorkoutTemplate({
      coachId: req.user.id, // Assuming coachId is coming from user session
      name: req.body.name,
      description: req.body.description,
      days: req.body.days,
    });
    const savedTemplate = await newTemplate.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update a workout template
const updateWorkoutTemplate = async (req, res) => {
  try {
    const updatedTemplate = await WorkoutTemplate.findByIdAndUpdate(
      req.params.templateId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a workout template
const deleteWorkoutTemplate = async (req, res) => {
  try {
    await WorkoutTemplate.findByIdAndDelete(req.params.templateId);
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to copy workout templates
const copyWorkoutTemplate = async (req, res) => {
  const { startWeek, numWeeks } = req.body;
  try {
    const template = await WorkoutTemplate.findById(req.params.templateId);
    let date = new Date(startWeek);

    for (let i = 0; i < numWeeks; i++) {
      const newWorkout = new Workout({
        coachId: template.coachId,
        name: template.name,
        description: template.description,
        days: template.days,
        startDate: new Date(date),
      });
      await newWorkout.save();
      date.setDate(date.getDate() + 7);
    }

    res.status(201).json({ message: "Workouts created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWorkoutTemplates,
  createWorkoutTemplate,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
  copyWorkoutTemplate,
};
