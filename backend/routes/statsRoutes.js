const express = require("express");
const router = express.Router();

const FocusSession = require("../models/FocusSession");
const Goal = require("../models/Goal");

const authMiddleware = require("../middleware/authMiddleware");

const getBadges = require("../utils/badges");


router.get("/", authMiddleware, async (req, res) => {
  try {

    console.log("User ID:", req.userId);

    const userId = req.userId;

    const sessions = await FocusSession.countDocuments({ user: userId });
    const goals = await Goal.countDocuments({ user: userId });

    const streak = Math.floor(sessions / 2);

    const stats = {
      sessions,
      goals,
      streak
    };

    const badges = getBadges(stats);

    console.log("Stats:", stats);
    console.log("Badges:", badges);

    res.json({
      ...stats,
      badges
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;