import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-badge">🌱 Focus & Mental Wellness Workstation</div>
        <h1>
          Grow Your Focus with <span>MindBloom</span>
        </h1>

        <p>
          A smart productivity system designed to help students
          track focus sessions, manage study plans, and sustain emotional wellness.
        </p>

        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary">
            Open Workstation
          </Link>

          <Link to="/register" className="btn btn-secondary">
            Create Free Account
          </Link>
        </div>

        {/* Feature Previews Showcase */}
        <div className="landing-showcase">
          <div className="showcase-card glass-panel float-1">
            <span className="showcase-icon">⏳</span>
            <h4>Focus Sessions</h4>
            <p>Pomodoro timers integrated with loopable rain and lofi ambient soundscapes.</p>
          </div>
          
          <div className="showcase-card glass-panel float-2">
            <span className="showcase-icon">😊</span>
            <h4>Mood Analytics</h4>
            <p>Track stress and calm levels. Understand your emotional trends over time.</p>
          </div>

          <div className="showcase-card glass-panel float-3">
            <span className="showcase-icon">📚</span>
            <h4>Study Planner</h4>
            <p>Organize subject-categorized tasks and track focus time per item.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;