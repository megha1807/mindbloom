const express = require("express");
const router = express.Router();
const StudyTask = require("../models/StudyTask");
const verifyToken = require("../middleware/authMiddleware");

// Add Task
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, subject } = req.body;

    const newTask = new StudyTask({
      user: req.userId,
      title,
      subject,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Get Tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await StudyTask.find({ user: req.userId }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Toggle Complete
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const task = await StudyTask.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete Task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const task = await StudyTask.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;