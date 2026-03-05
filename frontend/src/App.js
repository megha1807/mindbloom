import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Features from "./pages/Features";
import Tools from "./pages/Tools";
import MoodTracker from "./pages/MoodTracker";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudyPlanner from "./pages/StudyPlanner";
import FocusTimer from "./pages/FocusTimer";
import GoalTracker from "./pages/GoalTracker";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
       <Route 
  path="/features" 
  element={<PrivateRoute><Features /></PrivateRoute>} 
/>
        <Route path="/tools" element={<PrivateRoute><Tools /></PrivateRoute>} />
        <Route path="/moodtracker" element={<PrivateRoute><MoodTracker /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/study"
  element={<PrivateRoute><StudyPlanner /></PrivateRoute>}
/>
<Route
  path="/focus"
  element={
    <PrivateRoute>
      <FocusTimer />
    </PrivateRoute>
  }
/>
<Route
  path="/goals"
  element={
    <PrivateRoute>
      <GoalTracker />
    </PrivateRoute>
  }
/>
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;