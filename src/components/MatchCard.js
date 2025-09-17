import React, { useState } from 'react';
import { getItemImage, getCharacterImage, ICON_HEIGHT_NUMERICAL, ICON_HEIGHT } from '../utils/helpers.js'; // Assuming you have this function

export default function MatchCard({ match, playerId, items, onViewGame, onViewSimilarGame }) {
  const [isHovered, setIsHovered] = useState(false);

  const player = match.scoreboard.find((p) => p.playerid === playerId);
  if (!player) return null;

  const isWin = player.did_win;
  const resultColor = isWin ? "#00ff00" : "#ff3333";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? '#6d727b' : '#292929',
        borderRadius: '12px',
        paddingLeft: '0.7vw',
        paddingBottom: '0.7vw',
        paddingTop: '0.7vw',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        boxShadow: isHovered ? '0px 0px 15px rgba(255, 102, 0, 0.7)' : 'none',
      }}
    >
      {/* Win/Loss Indicator */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '6px',
        backgroundColor: resultColor
      }}></div>

      {/* Left Section: Player Info & Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1%', flex: '2' }}>
        
        {/* Champion Icon */}
        <img 
          src={getCharacterImage(player.character)} 
          alt="champion" 
          style={{ height: ICON_HEIGHT_NUMERICAL + 0.2 + 'vh', borderRadius: '50%', border: '3px solid white' }} 
        />

        {/* KDA and CS */}
        <div>
          <span style={{ fontSize: '3vh', fontWeight: 'bold', color: '#ff6700' }}>
            {player.kills}/{player.deaths}/{player.assists} KDA
          </span>
          <br />
          <span style={{ fontSize: '2vh', color: 'gray' }}>CS: {player.cs}</span>
        </div>

        {/* Item Slots */}
        <div style={{ display: 'flex', gap: '0.3vw' }}>
          {player.items.map((item, index) => (
            <img
              key={index}
              src={getItemImage(items, item)}
              alt={`Item ${index}`}
              style={{
                height: ICON_HEIGHT,
                background: 'white',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Middle Section: Team Info */}
      <div style={{ textAlign: 'center', flex: '3', display: 'flex', justifyContent: 'center', gap: '1vw'}}>
        {/* Your Team */}
        <div>
          <div style={{ color: '#0059ff', fontWeight: 'bold', fontSize: '2.5vh', marginBottom: '2vh' }}>Your Team</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3vw' }}>
            {match.scoreboard
              .filter((p) => p.team === 100)
              .map((p, index) => (
                <img
                  key={index}
                  src={getCharacterImage(p.character)}
                  alt="champion"
                  style={{ height: ICON_HEIGHT, borderRadius: '50%', border: '2px solid #0059ff' // Added border
                   }}
                />
              ))}
          </div>
        </div>

        {/* Enemy Team */}
        <div>
          <div style={{ color: '#e60026', fontWeight: 'bold', fontSize: '2.5vh', marginBottom: '2vh' }}>Enemy Team</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3vw' }}>
            {match.scoreboard
              .filter((p) => p.team === 200)
              .map((p, index) => (
                <img
                  key={index}
                  src={getCharacterImage(p.character)}
                  alt="champion"
                  style={{ height: ICON_HEIGHT, borderRadius: '50%', border: '2px solid #e60026' }}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1', alignItems: 'center' }}>
        
        <button
          onClick={() => onViewGame(match)}
          style={{
            padding: '12px 15px',
            background: '#ff6700',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '6px',
            width: '140px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          View Game
        </button>
        <button
          onClick={() => onViewSimilarGame(match)}
          style={{
            padding: '12px 15px',
            background: '#333',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '6px',
            width: '140px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Similar Games
        </button>
      </div>
    </div>
  );
}
