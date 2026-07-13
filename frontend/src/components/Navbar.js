import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ token, handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="navbar glass-navbar">
      <h2 className="logo">🌱 MindBloom</h2>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/features" className="nav-link">Tools</Link>
            <button className="logout-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;