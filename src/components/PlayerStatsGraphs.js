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

export default function PlayerStatsGraphs({ timeLabels, playerStats, oppStats }) {
  // Prepare Data for Graphs
  const chartData = timeLabels.map((time, index) => ({
    time: `${time}`,
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
        <h3 className="graph-title">KDA Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc"
              />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="kills" stroke="limegreen" dot={false} name="Kills" />
            <Line type="monotone" dataKey="deaths" stroke="red" dot={false} name="Deaths" />
            <Line type="monotone" dataKey="assists" stroke="deepskyblue" dot={false} name="Assists" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gold Earned */}
      <div className="graph-box">
        <h3 className="graph-title">Gold Earned</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gold" stroke="gold" dot={false} name="Player Gold" />
            <Line type="monotone" dataKey="oppGold" stroke="orange" dot={false} name="Opponent Gold" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
