import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudyPlanner.css";

function StudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/study", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/study",
      { title, subject },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    setSubject("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.put(
      `http://localhost:5000/api/study/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  return (
    <div className="planner-container">
      <div className="planner-card">
        <h2>📚 Study Planner</h2>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <button type="submit">Add Task</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 && (
            <p className="empty-text">No tasks added yet.</p>
          )}

          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-item ${task.completed ? "completed" : ""}`}
              onClick={() => toggleTask(task._id)}
            >
              <div>
                <h4>{task.title}</h4>
                <small>{task.subject}</small>
              </div>
              <span>{task.completed ? "✔" : "○"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudyPlanner;