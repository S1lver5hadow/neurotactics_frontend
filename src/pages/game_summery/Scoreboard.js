import React from 'react';
import { getCharacterImage, getItemImage } from '../../utils/helpers.js';
import scoreboardStyles from '../styles/scoreboardStyles.js';

export default function Scoreboard({ scoreboard, items }) {

  // Separate the players into teams
  const blueTeam = scoreboard.filter((player) => player.team === 100);
  const redTeam = scoreboard.filter((player) => player.team === 200);

  // Render a single player's row
  const renderPlayerRow = (player) => (
    <tr key={player.id} style={scoreboardStyles.row}>
      {/* Player Icon and Name */}
      <td style={scoreboardStyles.iconCell}>
        <img
          src={getCharacterImage(player.character)}
          alt={player.character}
          style={scoreboardStyles.playerIcon(player.team)}
        />
      </td>
      {/* Kills/Deaths/Assists */}
      <td style={scoreboardStyles.kdaCell}>
        <p style={scoreboardStyles.kdaText}>
          {player.kills} / {player.deaths} / {player.assists}
        </p>
      </td>
      {/* Items */}
      <td style={scoreboardStyles.itemsCell}>
        {player.items.map((itemId, index) => (
          <img
            key={index}
            src={getItemImage(items, itemId)}
            alt={`Item ${index}`}
            style={scoreboardStyles.itemIcon}
          />
        ))}
        {/* Trinket */}
        <img
          src={getItemImage(items, player.trinket)}
          alt="Trinket"
          style={scoreboardStyles.trinketIcon}
        />
      </td>
    </tr>
  );

  return (
    <div style={scoreboardStyles.container}>
      <h2 style={scoreboardStyles.header}>Scoreboard</h2>
      <div style={scoreboardStyles.teamsContainer}>
        {/* Blue Team */}
        <div style={scoreboardStyles.teamTable}>
          <h3 style={scoreboardStyles.teamHeader('blue')}>Blue Team</h3>
          <table style={scoreboardStyles.table}>
            <thead>
              <tr>
                <th style={scoreboardStyles.headerCell}>Player</th>
                <th style={scoreboardStyles.headerCell}>K/D/A</th>
                <th style={scoreboardStyles.headerCell}>Items</th>
              </tr>
            </thead>
            <tbody>{blueTeam.map(renderPlayerRow)}</tbody>
          </table>
        </div>

        {/* Red Team */}
        <div style={scoreboardStyles.teamTable}>
          <h3 style={scoreboardStyles.teamHeader('red')}>Red Team</h3>
          <table style={scoreboardStyles.table}>
            <thead>
              <tr>
                <th style={scoreboardStyles.headerCell}>Player</th>
                <th style={scoreboardStyles.headerCell}>K/D/A</th>
                <th style={scoreboardStyles.headerCell}>Items</th>
              </tr>
            </thead>
            <tbody>{redTeam.map(renderPlayerRow)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
