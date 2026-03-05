import React from "react";
import { Link } from "react-router-dom";

function Tools() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Productivity Tools</h2>

      <div style={{ marginTop: "30px" }}>
        <Link to="/mood" className="btn-primary" style={{ marginRight: "15px" }}>
          Open Mood Tracker
        </Link>
      </div>
    </div>
  );
}

export default Tools;