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

export default function PlayerStatsCombatGraphs({ timeLabels, playerStats, oppStats }) {
  // Prepare Data for Graphs
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
        <h3 className="graph-title">Kills</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="kills" stroke="limegreen" dot={false} name="Kills" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gold Earned */}
      <div className="graph-box">
        <h3 className="graph-title">Deaths</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="deaths" stroke="red" dot={false} name="Deaths" />
          </LineChart>
        </ResponsiveContainer>
      </div>

        {/* Gold Earned */}
        <div className="graph-box">
        <h3 className="graph-title">Assists</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="assists" stroke="deepskyblue" dot={false} name="Assists" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
