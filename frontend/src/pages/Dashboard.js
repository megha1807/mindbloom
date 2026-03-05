import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/focus/analytics",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const formatted = res.data.map((item) => ({
      date: item._id,
      sessions: item.count,
    }));

    setData(formatted);
  };

  return (
    <div className="dashboard-container">
      <h2>📊 Productivity Dashboard</h2>

      <div className="chart-card">
        <h3>Daily Focus Sessions</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#4f46e5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;