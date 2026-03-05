import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>
          Grow Your Focus with <span>MindBloom</span> 🚀
        </h1>

        <p>
          A smart productivity system designed to help students
          track focus sessions, manage goals, and build daily consistency.
        </p>

        <div className="landing-buttons">
          <Link to="/login">
            <button className="landing-btn primary">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="landing-btn secondary">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;