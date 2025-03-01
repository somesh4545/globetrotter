"use client";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<
    { username: string; total_points: number; wrong_attempts: number }[]
  >([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex justify-center pt-10 min-h-screen bg-[#1a1a1a] text-yellow-300 font-mono">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-yellow-400 drop-shadow-[4px_4px_0px_black]">
          🎮 Leaderboard 🎮
        </h1>
        <div className="border-4 border-yellow-400 bg-black p-4 shadow-[8px_8px_0px_black]">
          <table className="w-full border-collapse text-lg">
            <thead>
              <tr className="bg-yellow-400 text-black">
                <th className="border-2 border-black px-4 py-2">Rank</th>
                <th className="border-2 border-black px-4 py-2">Player</th>
                <th className="border-2 border-black px-4 py-2">Points</th>
                <th className="border-2 border-black px-4 py-2">
                  Wrong Attempts
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((player, index) => (
                  <tr key={index} className="border-2 border-yellow-400">
                    <td className="border-2 border-black px-4 py-2 font-bold">
                      #{index + 1}
                    </td>
                    <td className="border-2 border-black px-4 py-2">
                      {player.username}
                    </td>
                    <td className="border-2 border-black px-4 py-2">
                      {player.total_points}
                    </td>
                    <td className="border-2 border-black px-4 py-2">
                      {player.wrong_attempts}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center py-4">Loading leaderboard...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
