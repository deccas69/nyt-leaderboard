import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScoreInput from "./components/ScoreInput";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <Router>
      <nav style={{ backgroundColor: "#222", padding: "1rem" }}>
        <a href="/" style={{ marginRight: "1rem", color: "limegreen" }}>Submit Score</a>
        <a href="/leaderboard" style={{ color: "gold" }}>View Leaderboard</a>
      </nav>

      <Routes>
        <Route path="/" element={<ScoreInput />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
