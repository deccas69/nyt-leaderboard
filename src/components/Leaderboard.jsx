import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Confetti from "react-confetti";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [players, setPlayers] = useState([]);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchScores();
    fetchPlayers();
  }, [dateFilter]);

  const fetchScores = async () => {
    const { data, error } = await supabase.from("Scores").select("*")
      .gte('created_at', `${dateFilter}T00:00:00Z`)
      .lte('created_at', `${dateFilter}T23:59:59Z`);

    if (!error) {
      setScores(data);
      if (data.length > 0) setShowConfetti(true);
    } else {
      console.error("Fetch error:", error);
    }
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from("Players").select("id, name");
    if (!error) setPlayers(data);
    else console.error("Player fetch error:", error);
  };

  const getPlayerName = (id) => {
    const match = players.find(p => p.id === id);
    return match ? match.name : id;
  };

  const playerNames = [...new Set(scores.map(s => s.player_id))];

  const calculateTotals = () => {
    return playerNames.map(player => {
      const playerScores = scores.filter(s => s.player_id === player);
      const total = playerScores.reduce((sum, s) => sum + s.score, 0);
      return {
        player,
        total,
        breakdown: playerScores
      };
    }).sort((a, b) => b.total - a.total);
  };

  const getGameColor = (game) => {
    switch (game) {
      case "wordle": return "#6aaa64";
      case "connections": return "#a56eff";
      case "strands": return "#f2c94c";
      default: return "#ccc";
    }
  };

  const leaderboard = calculateTotals();
  const winner = leaderboard.length > 0 ? leaderboard[0].player : null;

  return (
    <div style={{ backgroundColor: "#111", color: "white", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏆 NYT Leaderboard</h1>

      <label>Select Date: </label>
      <input
        type="date"
        value={dateFilter}
        onChange={e => setDateFilter(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#222", color: "white", border: "1px solid #555" }}
      />

      {leaderboard.map(({ player, total, breakdown }, i) => (
        <div key={player} style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#1a1a1a", borderRadius: "1rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>{getPlayerName(player)} {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ""}</h2>
          <p style={{ fontSize: "1.25rem" }}>Total: <strong>{total}</strong></p>
          <div>
            {breakdown.map(s => (
              <div key={s.id} style={{ margin: "0.25rem 0", padding: "0.5rem", backgroundColor: getGameColor(s.game_id), borderRadius: "0.5rem", color: "#000" }}>
                <strong>{s.game_id.toUpperCase()}</strong> — {s.score} pts
                {s.bonus && " ⭐"}
                {s.hints > 0 && ` 💡-${s.hints}`}
              </div>
            ))}
          </div>
        </div>
      ))}

      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}
    </div>
  );
};

export default Leaderboard;
