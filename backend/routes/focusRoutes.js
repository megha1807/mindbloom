const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const FocusSession = require("../models/FocusSession");
const mongoose = require("mongoose");

// Save session
router.post("/", verifyToken, async (req, res) => {
  try {
    const { type, duration, taskId } = req.body;

    const session = new FocusSession({
      user: req.userId,
      type,
      duration,
      taskId: taskId || null,
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Error saving session" });
  }
});

// Get sessions
router.get("/", verifyToken, async (req, res) => {
  try {
    const sessions = await FocusSession.find({ user: req.userId }).sort({
      completedAt: -1,
    });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await FocusSession.countDocuments({
      user: req.userId,
      type: "work",
    });

    res.json({ count });
  } catch (err) {
    console.error("Count error:", err);
    res.status(500).json({ message: "Error counting sessions" });
  }
});

// Get total work sessions count
router.get("/analytics", verifyToken, async (req, res) => {
  try {
    const sessions = await FocusSession.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          type: "work",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completedAt", // ✅ FIXED FIELD NAME
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(sessions);
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Analytics error" });
  }
});

module.exports = router;