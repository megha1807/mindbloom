import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FocusTimer.css";

function FocusTimer() {
  const WORK_TIME = 25*60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [mode, setMode] = useState("work"); // work | short | long
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const timerRef = useRef(null);

  const totalTime =
    mode === "work"
      ? WORK_TIME
      : mode === "short"
      ? SHORT_BREAK
      : LONG_BREAK;

  const token = localStorage.getItem("token");

  // 🔊 Sound Notification
  const playSound = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );
    audio.play();
  };

  // 💾 Save session to backend
  const saveSession = async (type, duration) => {
    try {
      await axios.post(
        "http://localhost:5000/api/focus",
        {
          type,
          duration,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error saving session");
    }
  };

  // ⏱ Timer Logic
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
  }, [isRunning, timeLeft]);

  // 🧮 Format Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 🔄 Reset
  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
  };

  // 📊 Circle Progress
  const progress = ((totalTime - timeLeft) / totalTime) * 283;

  return (
    <div className="timer-container">
      <div className="timer-card">
        <h2>⏳ Focus Timer</h2>

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
            Work
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
          <svg width="150" height="150">
            <circle
              cx="75"
              cy="75"
              r="60"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="75"
              cy="75"
              r="60"
              stroke="#4f46e5"
              strokeWidth="10"
              fill="none"
              strokeDasharray="377"
              strokeDashoffset={377 - progress}
              strokeLinecap="round"
              transform="rotate(-90 75 75)"
            />
          </svg>
          <div className="time-text">{formatTime(timeLeft)}</div>
        </div>

        {/* Controls */}
        <div className="timer-buttons">
          {!isRunning ? (
            <button onClick={() => setIsRunning(true)}>Start</button>
          ) : (
            <button onClick={() => setIsRunning(false)}>Pause</button>
          )}

          <button onClick={handleReset} className="reset-btn">
            Reset
          </button>
        </div>

        <div className="session-count">
          Sessions Completed: {sessions}
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;