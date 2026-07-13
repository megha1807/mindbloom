import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FocusTimer.css";

const SOUNDSCAPES = [
  { name: "🔇 Mute / Silence", url: "" },
  { name: "🌧 Rain Storm", url: "https://www.soundjay.com/nature/sounds/rain-07.mp3" },
  { name: "🌲 Forest Wind", url: "https://www.soundjay.com/nature/sounds/forest-wind-1.mp3" },
  { name: "☕ Cafe Ambient", url: "https://assets.mixkit.co/active_storage/sfx/936/936-84.wav" },
  { name: "🌊 Gentle Stream", url: "https://www.soundjay.com/nature/sounds/river-1.mp3" },
];

function FocusTimer() {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [mode, setMode] = useState("work"); // work | short | long
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedSound, setSelectedSound] = useState("");

  const timerRef = useRef(null);
  const ambientAudioRef = useRef(new Audio());

  const totalTime =
    mode === "work"
      ? WORK_TIME
      : mode === "short"
      ? SHORT_BREAK
      : LONG_BREAK;

  const token = localStorage.getItem("token");

  // Fetch active tasks from Study Planner
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/study", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data.filter((t) => !t.completed));
      } catch (err) {
        console.error("Error fetching tasks for FocusTimer", err);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  // Ambient sound play/pause logic
  useEffect(() => {
    const audio = ambientAudioRef.current;
    if (selectedSound && isRunning) {
      audio.src = selectedSound;
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Audio play blocked", e));
    } else {
      audio.pause();
    }
  }, [selectedSound, isRunning]);

  // Cleanup audio on unmount
  useEffect(() => {
    const audio = ambientAudioRef.current;
    return () => {
      audio.pause();
    };
  }, []);

  // Sound notification when timer finishes
  const playSound = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );
    audio.play();
  };

  // Save session to backend
  const saveSession = async (type, duration) => {
    try {
      await axios.post(
        "http://localhost:5000/api/focus",
        {
          type,
          duration,
          taskId: selectedTaskId || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error saving session");
    }
  };

  // Timer Logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      playSound();

      if (mode === "work") {
        const newSessionCount = sessions + 1;
        setSessions(newSessionCount);

        // Save work session
        saveSession("work", 25);

        if (newSessionCount % 4 === 0) {
          setMode("long");
          setTimeLeft(LONG_BREAK);
          alert("🌿 4 Sessions Completed! Take a Long Break.");
        } else {
          setMode("short");
          setTimeLeft(SHORT_BREAK);
          alert("☕ Work Session Complete! Take a Short Break.");
        }
      } else {
        setMode("work");
        setTimeLeft(WORK_TIME);
        alert("🚀 Break Over! Back to Work.");
      }
    }

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  // Format Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Reset
  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
    ambientAudioRef.current.pause();
  };

  // Circle Progress (Radius=60, Circumference=377)
  const progress = ((totalTime - timeLeft) / totalTime) * 377;

  return (
    <div className="timer-container">
      <div className="timer-card glass-panel">
        <h2>⏳ Focus Timer</h2>
        <p className="timer-sub">Gently drift into deep work sessions</p>

        {/* Mode Buttons */}
        <div className="mode-buttons">
          <button
            className={mode === "work" ? "active" : ""}
            onClick={() => {
              setMode("work");
              setTimeLeft(WORK_TIME);
              setIsRunning(false);
            }}
          >
            Work Session
          </button>

          <button
            className={mode === "short" ? "active" : ""}
            onClick={() => {
              setMode("short");
              setTimeLeft(SHORT_BREAK);
              setIsRunning(false);
            }}
          >
            Short Break
          </button>

          <button
            className={mode === "long" ? "active" : ""}
            onClick={() => {
              setMode("long");
              setTimeLeft(LONG_BREAK);
              setIsRunning(false);
            }}
          >
            Long Break
          </button>
        </div>

        {/* Circular Timer */}
        <div className="circle-wrapper">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="url(#timer-grad)"
              strokeWidth="8"
              fill="none"
              strokeDasharray="377"
              strokeDashoffset={377 - progress}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <defs>
              <linearGradient id="timer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="time-text">{formatTime(timeLeft)}</div>
        </div>

        {/* Task Selector (Only during work mode) */}
        {mode === "work" && (
          <div className="timer-setting">
            <label htmlFor="task-select">Focusing on:</label>
            <select
              id="task-select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <option value="">General Focus Session</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title} ({task.subject || "No Subject"})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Soundscape Selector */}
        <div className="timer-setting">
          <label htmlFor="sound-select">Background Soundscape:</label>
          <select
            id="sound-select"
            value={selectedSound}
            onChange={(e) => setSelectedSound(e.target.value)}
          >
            {SOUNDSCAPES.map((sound) => (
              <option key={sound.url} value={sound.url}>
                {sound.name}
              </option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <div className="timer-buttons">
          {!isRunning ? (
            <button className="btn-primary" onClick={() => setIsRunning(true)}>Start Session</button>
          ) : (
            <button className="btn-secondary" onClick={() => setIsRunning(false)}>Pause Session</button>
          )}

          <button onClick={handleReset} className="btn-danger">
            Reset
          </button>
        </div>

        <div className="session-count">
          Completed Sessions Today: <span>{sessions}</span>
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;