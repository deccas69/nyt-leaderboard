import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ScoreInput = () => {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [scoreText, setScoreText] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from("Players").select("id, name");
      if (!error) setPlayers(data);
      else console.error("Error fetching players:", error);
    };

    const fetchGames = async () => {
      const { data, error } = await supabase.from("Games").select("id, name");
      if (!error) setGames(data);
      else console.error("Error fetching games:", error);
    };

    fetchPlayers();
    fetchGames();
  }, []);

const parseWordleScore = (text) => {
  const match = text.match(/Wordle\s+([\d,]+)\s+([X1-6])\/6\*?/i);
  if (!match) return 0;
  const guess = match[2];
  return guess === "X" ? 0 : 7 - parseInt(guess);
};

  const parseConnectionsScore = (text) => {
    const guessLines = text.split("\n").filter((line) => /[🟨🟦🟪🟩]/.test(line));
    const totalGuesses = guessLines.length;
    const wrongGuesses = totalGuesses - 4;
    let score = 10 - wrongGuesses;
    if (guessLines[0]?.includes("🟪🟪🟪🟪")) score += 1;
    return Math.max(score, 0);
  };

  const parseStrandsScore = (text) => {
    const emojis = [...text.matchAll(/[🔵🟡💡]/g)].map(m => m[0]);
    const hints = emojis.filter(e => e === "💡").length;
    const spanagramFirst = text.split("\n").find(line => line.includes("🟡"))?.startsWith("🟡");
    let score = 10 + (spanagramFirst ? 1 : 0) - hints;
    return Math.max(score, 0);
  };

  const extractGameNumber = (text) => {
    const match = text.match(/#(\\d+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let score = 0;
    if (selectedGame === "wordle") score = parseWordleScore(scoreText);
    if (selectedGame === "connections") score = parseConnectionsScore(scoreText);
    if (selectedGame === "strands") score = parseStrandsScore(scoreText);

    const gameNumber = extractGameNumber(scoreText);

    const { error } = await supabase.from("Scores").insert([
      {
        player_id: selectedPlayer,
        game_id: selectedGame,
        score,
        date: selectedGame === "wordle" ? date : null,
        game_number: gameNumber,
      },
    ]);

    if (error) console.error("Error submitting score:", error);
    else setScoreText("");
  };

  return (
    <div style={{ backgroundColor: "#111", minHeight: "100vh", color: "#fff", padding: "2rem" }}>
      <h1 style={{ textAlign: "left", marginBottom: "2rem" }}>NYT Games Leaderboard</h1>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2>Submit NYT Game Score</h2>
        <form onSubmit={handleSubmit}>
          <label>Select Player:</label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          >
            <option value="">-- Choose Player --</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <label>Select Game:</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          >
            <option value="">-- Choose Game --</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          {selectedGame === "wordle" && (
            <>
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
                required
              />
            </>
          )}

          <label>Paste your NYT game score here:</label>
          <textarea
            value={scoreText}
            onChange={(e) => setScoreText(e.target.value)}
            placeholder="Paste your NYT game score here..."
            rows={6}
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "limegreen",
              border: "none",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Submit Score
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScoreInput;
