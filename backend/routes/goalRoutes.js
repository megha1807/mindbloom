const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Goal = require("../models/Goal");

// Create Goal
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, target } = req.body;

    const goal = new Goal({
      user: req.userId,
      name,
      target,
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error creating goal" });
  }
});

// Get User Goals
router.get("/", verifyToken, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching goals" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting goal" });
  }
});

module.exports = router;