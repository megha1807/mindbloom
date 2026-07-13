import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudyPlanner.css";

function StudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/study", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching study tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await axios.post(
        "http://localhost:5000/api/study",
        { title, subject: subject || "General" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setSubject("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/study/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task status", err);
    }
  };

  const deleteTask = async (e, id) => {
    e.stopPropagation(); // prevent toggling completion when clicking delete
    try {
      await axios.delete(`http://localhost:5000/api/study/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const getSubjectColor = (subj) => {
    const s = subj.toLowerCase().trim();
    if (s.includes("math") || s.includes("calc")) return "#6366f1"; // indigo
    if (s.includes("science") || s.includes("physics") || s.includes("chem")) return "#10b981"; // green
    if (s.includes("code") || s.includes("cs") || s.includes("prog")) return "#ec4899"; // pink
    if (s.includes("english") || s.includes("write") || s.includes("lit")) return "#f59e0b"; // yellow
    return "#8b5cf6"; // purple (default)
  };

  return (
    <div className="planner-container">
      <div className="planner-card glass-panel">
        <h2>📚 Study Planner</h2>
        <p className="planner-sub">Map your daily study goals and checklist</p>

        <form onSubmit={addTask} className="task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Title (e.g., Read Chapter 4)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ background: "rgba(0,0,0,0.2)" }}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Subject (e.g., Math, Science)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ background: "rgba(0,0,0,0.2)" }}
            />
          </div>

          <button type="submit" className="btn-primary">Add Task</button>
        </form>

        <div className="task-list">
          <h3 className="list-title">My Checklist ({tasks.filter(t => !t.completed).length} active)</h3>
          
          {tasks.length === 0 && (
            <p className="empty-text">Your list is clean. Add a task above to start!</p>
          )}

          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-item glass-panel ${task.completed ? "completed" : ""}`}
              onClick={() => toggleTask(task._id)}
            >
              <div className="task-checkbox">
                {task.completed ? "✔" : ""}
              </div>

              <div className="task-details">
                <h4>{task.title}</h4>
                <span 
                  className="subject-badge"
                  style={{ backgroundColor: `${getSubjectColor(task.subject || "General")}20`, color: getSubjectColor(task.subject || "General") }}
                >
                  {task.subject || "General"}
                </span>
              </div>

              <button 
                className="task-delete-btn"
                onClick={(e) => deleteTask(e, task._id)}
                title="Delete Task"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudyPlanner;