import React, { useState, useEffect } from "react";
import axios from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MOODS = [
  { name: "Happy", emoji: "😊" },
  { name: "Calm", emoji: "😌" },
  { name: "Stressed", emoji: "😫" },
  { name: "Sad", emoji: "😢" },
];

function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMoods = async () => {
    try {
      const res = await axios.get("/moods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoods(res.data);
    } catch (err) {
      console.error("Error fetching moods", err);
    }
  };

  useEffect(() => {
    fetchMoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    try {
      await axios.post(
        "/moods",
        { mood: selectedMood, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedMood("");
      setNote("");
      fetchMoods();
    } catch (err) {
      console.error("Error saving mood", err);
    }
  };

  // Prepare chart data
  const moodCount = { Happy: 0, Calm: 0, Stressed: 0, Sad: 0 };
  moods.forEach((m) => {
    if (moodCount[m.mood] !== undefined) {
      moodCount[m.mood]++;
    }
  });

  const chartData = Object.keys(moodCount).map((key) => ({
    mood: key,
    count: moodCount[key],
  }));

  // Analyze dominant mood
  const getWellnessAdvice = () => {
    let dominant = "Happy";
    let max = -1;
    Object.keys(moodCount).forEach((k) => {
      if (moodCount[k] > max) {
        max = moodCount[k];
        dominant = k;
      }
    });

    if (max === 0) return "Log your mood to receive personalized wellness advice.";

    switch (dominant) {
      case "Happy":
        return "You're doing great! Keep up this positive energy and share your vibes with peers. 🌟";
      case "Calm":
        return "A calm mind is perfect for deep work. Ideal time to tackle your hardest tasks! 🌲";
      case "Stressed":
        return "Stressing out? Try our 1-minute breathing exercise on the Home screen to recenter. 🧘";
      case "Sad":
        return "Be kind to yourself today. Take a light walk or listen to a soundscape. It's okay to rest. ❤️";
      default:
        return "Keep focus session tracking to align your energy and routines.";
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "8px", fontSize: "2.2rem", background: "var(--primary-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        😊 Mood Tracker
      </h2>
      <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "32px", fontSize: "0.95rem" }}>
        Align your emotional wellness with your academic productivity
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "30px" }}>
        {/* LEFT COLUMN: LOG MOOD & ADVICE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div className="glass-panel" style={{ padding: "28px" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "1.2rem" }}>How are you feeling today?</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {MOODS.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedMood(m.name)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      padding: "12px 6px",
                      borderRadius: "12px",
                      background: selectedMood === m.name ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${selectedMood === m.name ? "var(--primary)" : "var(--glass-border)"}`,
                      color: "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "1.8rem" }}>{m.emoji}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: selectedMood === m.name ? "var(--primary)" : "var(--text-secondary)" }}>{m.name}</span>
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="mood-note">Personal Note</label>
                <input
                  id="mood-note"
                  type="text"
                  placeholder="What's making you feel this way? (Optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ background: "rgba(0,0,0,0.2)" }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                Save Mood Log
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <h4 style={{ color: "var(--secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              Mental Wellness Insight
            </h4>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "var(--text-primary)" }}>
              {getWellnessAdvice()}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS & HISTORY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div className="glass-panel" style={{ padding: "28px" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "1.2rem" }}>Mood Analytics</h3>
            <div style={{ width: "100%", height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="mood" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "white" }}
                  />
                  <Bar dataKey="count" fill="url(#bar-grad)" radius={[4, 4, 0, 0]}>
                    <defs>
                      <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "28px", flex: 1, maxHeight: "300px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "1.2rem" }}>Mood Logs</h3>
            <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
              {moods.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic" }}>No entries logged yet.</p>
              ) : (
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {moods.map((m) => {
                    const moodObj = MOODS.find((item) => item.name === m.mood);
                    return (
                      <li
                        key={m._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 14px",
                          background: "rgba(255,255,255,0.01)",
                          border: "1px solid rgba(255,255,255,0.04)",
                          borderRadius: "8px"
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>
                            {moodObj ? moodObj.emoji : "😊"}
                          </span>
                          <strong style={{ fontSize: "0.9rem" }}>{m.mood}</strong>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {m.note || "No notes"}
                          </p>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {new Date(m.date).toLocaleDateString()}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;