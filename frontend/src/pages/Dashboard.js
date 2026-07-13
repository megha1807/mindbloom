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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAnalytics = async () => {
    try {
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
    } catch (err) {
      console.error("Error fetching analytics data", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>📊 Productivity Dashboard</h2>

      <div className="chart-card glass-panel">
        <h3>Daily Focus Sessions</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "white" }}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="var(--primary)"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;