import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Features from "./pages/Features";
import MoodTracker from "./pages/MoodTracker";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudyPlanner from "./pages/StudyPlanner";
import FocusTimer from "./pages/FocusTimer";
import GoalTracker from "./pages/GoalTracker";
import Dashboard from "./pages/Dashboard";

function PrivateRoute({ children, token }) {
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const loginUser = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Navbar token={token} handleLogout={logoutUser} />
      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route 
          path="/features" 
          element={<PrivateRoute token={token}><Features /></PrivateRoute>} 
        />
        <Route path="/moodtracker" element={<PrivateRoute token={token}><MoodTracker /></PrivateRoute>} />
        <Route path="/login" element={<Login onLogin={loginUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/study"
          element={<PrivateRoute token={token}><StudyPlanner /></PrivateRoute>}
        />
        <Route
          path="/focus"
          element={
            <PrivateRoute token={token}>
              <FocusTimer />
            </PrivateRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <PrivateRoute token={token}>
              <GoalTracker />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute token={token}>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;