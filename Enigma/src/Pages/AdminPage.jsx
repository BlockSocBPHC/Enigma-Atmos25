import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [ranking, setRanking] = useState([]);

  const getRank = async () => {
    const res = await fetch("/getranking", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setRanking(data);
  };

  useEffect(() => {
    getRank();
    const interval = setInterval(getRank, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-10 flex flex-col items-center font-[Inter]">
      <h1 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
        🏆 Leaderboard
      </h1>

      <div className="w-full max-w-5xl bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-cyan-500/20 shadow-[0_0_40px_-10px_rgba(0,255,255,0.2)] overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-800/50 text-cyan-300 text-sm uppercase font-semibold tracking-widest py-4 px-6">
          <span className="text-left">Rank</span>
          <span className="text-center">User</span>
          <span className="text-center">Points</span>
        </div>

        <div className="divide-y divide-gray-800/70">
          {ranking.map((rank, i) => (
            <div
              key={rank._id}
              className={`grid grid-cols-3 items-center py-5 px-6 text-gray-200 hover:bg-cyan-500/10 transition-all duration-200 ${
                i === 0
                  ? "bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 text-yellow-300 font-bold"
                  : i === 1
                  ? "bg-gradient-to-r from-gray-500/20 to-gray-300/10 text-gray-300 font-bold"
                  : i === 2
                  ? "bg-gradient-to-r from-orange-600/20 to-orange-400/10 text-orange-300 font-bold"
                  : ""
              }`}
            >
              <span className="text-lg font-semibold text-left">#{i + 1}</span>
              <span className="text-center text-lg">{rank.name}</span>
              <span className="flex justify-center items-center text-lg font-mono">
                {rank.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
