const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["work", "break"],
    required: true,
  },
  duration: Number,
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FocusSession", focusSessionSchema);