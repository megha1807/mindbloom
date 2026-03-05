import React, { useState, useEffect } from "react";
import axios from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMoods = async () => {
    const res = await axios.get("/moods", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMoods(res.data);
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "/moods",
      { mood: selectedMood, note },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSelectedMood("");
    setNote("");
    fetchMoods();
  };

  // Prepare chart data
  const moodCount = {};
  moods.forEach((m) => {
    moodCount[m.mood] = (moodCount[m.mood] || 0) + 1;
  });

  const chartData = Object.keys(moodCount).map((key) => ({
    mood: key,
    count: moodCount[key],
  }));

  return (
  <div style={{ padding: "50px", maxWidth: "900px", margin: "auto" }}>
    <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
      Mood Tracker
    </h2>

    <div className="card">
      <form onSubmit={handleSubmit}>
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">Select Mood</option>
          <option value="Happy">😊 Happy</option>
          <option value="Calm">😌 Calm</option>
          <option value="Stressed">😫 Stressed</option>
          <option value="Sad">😢 Sad</option>
        </select>

        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        <button
          type="submit"
          style={{
            padding: "8px 15px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Save
        </button>
      </form>
    </div>

    <div style={{ marginTop: "40px" }} className="card">
      <h3>Mood History</h3>
      <ul style={{ marginTop: "10px" }}>
        {moods.map((m) => (
          <li key={m._id} style={{ marginBottom: "8px" }}>
            <strong>{m.mood}</strong> —{" "}
            {new Date(m.date).toLocaleDateString()} — {m.note}
          </li>
        ))}
      </ul>
    </div>

    <div style={{ marginTop: "40px" }} className="card">
      <h3>Mood Analytics</h3>
      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mood" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#4f46e5" />
      </BarChart>
    </div>
  </div>
);
}

export default MoodTracker;