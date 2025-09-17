import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function PlayerStatsVisionGraph({ timeLabels, playerStats, oppStats }) {
  const chartData = timeLabels.map((time, index) => ({
    time: `${time} min`,
    kills: playerStats.kills[index],
    deaths: playerStats.deaths[index],
    assists: playerStats.assists[index],
    gold: playerStats.gold[index],
    oppGold: oppStats.gold[index],
    cs: playerStats.cs[index],
    wardsPlaced : playerStats.wardsPlaced[index],
    wardsKilled : playerStats.wardsKilled[index]
  }));

  return (
    <div className="graphs-container">
      {/* KDA Timeline */}
      <div className="graph-box">
        <h3 className="graph-title">Wards Placed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="wardsPlaced" stroke="limegreen" dot={false} name="Wards Placed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gold Earned */}
      <div className="graph-box">
        <h3 className="graph-title">Wards Killed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="wardsKilled" stroke="gold" dot={false} name="Wards Killed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
