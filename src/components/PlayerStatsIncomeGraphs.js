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

export default function PlayerStatsIncomeGraphs({ timeLabels, playerStats, oppStats }) {
  const chartData = timeLabels.map((time, index) => ({
    time: `${time} min`,
    kills: playerStats.kills[index],
    deaths: playerStats.deaths[index],
    assists: playerStats.assists[index],
    gold: playerStats.gold[index],
    oppGold: oppStats.gold[index],
    cs: playerStats.cs[index],
  }));

  return (
    <div className="graphs-container">
      {/* KDA Timeline */}
      <div className="graph-box">
        <h3 className="graph-title">Gold Earned</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gold" stroke="limegreen" dot={false} name="Player Gold" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gold Earned */}
      <div className="graph-box">
        <h3 className="graph-title">CS Score</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cs" stroke="gold" dot={false} name="Player CS" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
