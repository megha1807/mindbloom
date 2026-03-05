import React, { useEffect, useState } from "react";
import axios from "axios";
import LandingPage from "./LandingPage";
import AppHome from "./AppHome";

function Home() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    streak: 0,
    sessions: 0,
    goals: 0,
    badges:[],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:5000/api/stats",
          {
           headers: {
  Authorization: `Bearer ${token}`,
}
          }
        );

        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  return token ? (
    <AppHome stats={stats} loading={loading} />
  ) : (
    <LandingPage />
  );
}

export default Home;