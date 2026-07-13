import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AppHome.css";

const AFFIRMATIONS = [
  "You are capable of doing hard things. Take it one step at a time! 🌟",
  "Focus is a muscle. Every minute you study, you are building it stronger. 💪",
  "Don't worry about being perfect. Just focus on being 1% better than yesterday. 📈",
  "Deep breath in, slow breath out. You've got this. 🧘",
  "Rest is productive too. Make sure to take your breaks! 🌿",
  "Progress, not perfection, is the goal. Keep going! 🚀"
];

function AppHome({ stats, loading }) {
  const [affirmation, setAffirmation] = useState("");
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale"); // Inhale | Hold | Exhale
  const [breathSeconds, setBreathSeconds] = useState(4);

  // Set random affirmation
  useEffect(() => {
    const dayIndex = new Date().getDate() % AFFIRMATIONS.length;
    setAffirmation(AFFIRMATIONS[dayIndex]);
  }, []);

  // Breathing Guide loop (4s Inhale, 7s Hold, 8s Exhale)
  useEffect(() => {
    let interval = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            if (breathPhase === "Inhale") {
              setBreathPhase("Hold");
              return 7;
            } else if (breathPhase === "Hold") {
              setBreathPhase("Exhale");
              return 8;
            } else {
              setBreathPhase("Inhale");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase("Inhale");
      setBreathSeconds(4);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();

      // Reminder at 7:00 PM
      if (hour === 19 && minutes === 0) {
        if (Notification.permission === "granted") {
          new Notification("⏰ Focus Reminder", {
            body: "Time to start a focus session on MindBloom!",
            icon: "/logo192.png",
          });
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning ☀️";
    if (hr < 17) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  };

  return (
    <div className="app-container">
      {/* HEADER & AFFIRMATION */}
      <div className="app-welcome-section glass-panel">
        <div className="welcome-text">
          <h1>{getGreeting()}, Student! 👋</h1>
          <p className="current-date">{new Date().toDateString()}</p>
        </div>
        <div className="affirmation-card">
          <span className="affirmation-label">Daily Affirmation 🌱</span>
          <p className="affirmation-text">"{affirmation}"</p>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Gathering your statistics...</p>
      ) : (
        <div className="dashboard-grid">
          {/* STATS CARDS */}
          <div className="stats-container">
            <h3 className="section-title">Focus Dashboard</h3>
            <div className="app-stats">
              <div className="card stat-card glass-panel">
                <div className="stat-icon">🔥</div>
                <h2>{stats.streak}</h2>
                <p>Day Streak</p>
              </div>

              <div className="card stat-card glass-panel">
                <div className="stat-icon">⏳</div>
                <h2>{stats.sessions}</h2>
                <p>Focus Sessions</p>
              </div>

              <div className="card stat-card glass-panel">
                <div className="stat-icon">🎯</div>
                <h2>{stats.goals}</h2>
                <p>Active Goals</p>
              </div>
            </div>
            
            <div className="app-actions">
              <Link to="/dashboard">
                <button className="btn-primary">View Full Analytics</button>
              </Link>
            </div>
          </div>

          {/* WELLNESS CORNER (Breathing Guide) */}
          <div className="wellness-corner glass-panel">
            <h3>🧘 Mindful Wellness Corner</h3>
            <p className="wellness-desc">Take a minute to clear your mind before studying.</p>

            <div className="breathing-session">
              <div className={`breathing-circle-outer ${breathingActive ? breathPhase.toLowerCase() : "idle"}`}>
                <div className="breathing-circle-inner">
                  <span className="breath-action">{breathingActive ? breathPhase : "Ready?"}</span>
                  {breathingActive && <span className="breath-count">{breathSeconds}s</span>}
                </div>
              </div>

              <button 
                className={`btn ${breathingActive ? "btn-secondary" : "btn-primary"}`} 
                onClick={() => setBreathingActive(!breathingActive)}
              >
                {breathingActive ? "Stop Breathing Exercise" : "Start 4-7-8 Breathing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      <div className="badges-section glass-panel">
        <h3>Your Achievements 🏆</h3>
        <p className="badges-desc">Keep completing focus sessions to unlock more badges</p>

        <div className="badges-grid">
          {stats.badges && stats.badges.length > 0 ? (
            stats.badges.map((badge, index) => (
              <div key={index} className="badge-item glass-panel">
                <span className="badge-icon">🎖️</span>
                <span className="badge-text">{badge}</span>
              </div>
            ))
          ) : (
            <p className="empty-badges">No achievements yet. Start focusing to unlock badges!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppHome;