const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const moodRoutes = require("./routes/moodRoutes");
app.use("/api/moods", moodRoutes);

const studyRoutes = require("./routes/studyRoutes");
app.use("/api/study", studyRoutes);

const focusRoutes = require("./routes/focusRoutes");
app.use("/api/focus", focusRoutes);

const goalRoutes = require("./routes/goalRoutes");
app.use("/api/goals", goalRoutes);

const statsRoutes = require("./routes/statsRoutes");
app.use("/api/stats", statsRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));