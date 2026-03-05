import React from "react";
import { Link } from "react-router-dom";
import "./Features.css";

const Features = () => {
  return (
    <div className="features-page">
      <h2>Choose Your Productivity Tool</h2>

      <div className="features-grid">

        <Link to="/study" className="feature-box">
          <h3>📚 Study Planner</h3>
          <p>Organize daily study tasks and track completion.</p>
        </Link>

        <Link to="/focus" className="feature-box">
          <h3>⏳ Focus Timer</h3>
          <p>Use Pomodoro sessions to improve concentration.</p>
        </Link>

        <Link to="/goals" className="feature-box">
          <h3>🎯 Goal Tracker</h3>
          <p>Set long-term goals and monitor your progress.</p>
        </Link>

        <Link to="/moodtracker" className="feature-box">
          <h3>😊 Mood Tracker</h3>
          <p>Track your emotions and analyze mood patterns.</p>
        </Link>

      </div>
    </div>
  );
};

export default Features;