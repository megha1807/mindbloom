import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./AppHome.css";


function AppHome({ stats, loading }) {

  // =========================
  // DAILY FOCUS REMINDER
  // =========================
  useEffect(() => {

    // ask notification permission
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

    }, 60000); // check every minute

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="app-container">

      {/* HEADER */}
      <div className="app-header">
        <h1>Welcome Back 👋</h1>
        <p>{new Date().toDateString()}</p>
      </div>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <>

          {/* ========================= */}
          {/* STATS CARDS */}
          {/* ========================= */}
          <div className="app-stats">

            <div className="card">
              <h2>🔥 {stats.streak}</h2>
              <p>Day Streak</p>
            </div>

            <div className="card">
              <h2>⏳ {stats.sessions}</h2>
              <p>Focus Sessions</p>
            </div>

            <div className="card">
              <h2>🎯 {stats.goals}</h2>
              <p>Active Goals</p>
            </div>

          </div>


          {/* ========================= */}
          {/* ACHIEVEMENT BADGES */}
          {/* ========================= */}
          <div className="badges-section">

            <h3>Your Achievements 🏆</h3>

            <div className="badges-grid">

              {stats.badges && stats.badges.length > 0 ? (
                stats.badges.map((badge, index) => (
                  <div key={index} className="badge">
                    {badge}
                  </div>
                ))
              ) : (
                <p>No achievements yet. Start focusing!</p>
              )}

            </div>

          </div>

        </>
      )}

      {/* ========================= */}
      {/* QUICK ACTIONS */}
      {/* ========================= */}
      <div className="app-actions">

        <Link to="/dashboard">
          <button>Open Dashboard</button>
        </Link>

      </div>

      

    </div>
  );
}

export default AppHome;