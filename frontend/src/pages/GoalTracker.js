import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GoalTracker.css";

function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [sessionCount, setSessionCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGoals();
    fetchSessionCount();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const fetchSessionCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/focus/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessionCount(res.data.count);
    } catch (err) {
      console.error("Error fetching focus count", err);
    }
  };

  const createGoal = async () => {
    if (!name || !target) return;

    try {
      await axios.post(
        "http://localhost:5000/api/goals",
        { name, target },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setTarget("");
      fetchGoals();
    } catch (err) {
      console.error("Error creating goal", err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoals();
    } catch (err) {
      console.error("Error deleting goal", err);
    }
  };

  return (
    <div className="goal-container">
      <div className="goal-card">
        <h2>🎯 Goal Tracker</h2>

        <input
          placeholder="Goal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Target Sessions"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <button onClick={createGoal}>Create Goal</button>

        <div style={{ marginTop: "30px" }}>
          {goals.map((goal) => {
            const percentage =
              goal.target > 0
                ? Math.min((sessionCount / goal.target) * 100, 100)
                : 0;

            return (
              <div key={goal._id} className="goal-item">
                <h4>{goal.name}</h4>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p>
                  {sessionCount} / {goal.target} Sessions
                </p>

                <button
                  className="delete-btn"
                  onClick={() => deleteGoal(goal._id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GoalTracker;