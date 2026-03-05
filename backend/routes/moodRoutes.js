const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");
const verifyToken = require("../middleware/authMiddleware");

// Add mood
router.post("/", verifyToken, async (req, res) => {
  try {
    const { mood, note } = req.body;

    const newMood = new Mood({
      user: req.userId, // ✅ use req.userId
      mood,
      note,
    });

    await newMood.save();
    res.status(201).json(newMood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving mood" });
  }
});

// Get user's moods
router.get("/", verifyToken, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.userId }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching moods" });
  }
});

module.exports = router;