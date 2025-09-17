import React, { useState } from 'react';
import { getItemImage, getCharacterImage, getRankImg, getRegion, ICON_HEIGHT_NUMERICAL, ICON_HEIGHT } from '../utils/helpers.js';
import { useNavigate } from 'react-router-dom';

export default function SimilarMatchCard({ match, player, items }) {
    const [isHovered, setIsHovered] = useState(false);
  
  const navigate = useNavigate();

  const isWin = player.did_win;
  const resultColor = isWin ? "#00ff00" : "#ff3333";

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/game?matchId=${match.matchId}`)} 
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
        width: '90%',
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

      {/* Middle Section: Region & Rank */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1vw',
          flex: '1',
          padding: '10px 20px',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >

      <div>
          <span style={{ fontSize: '3vh', fontWeight: 'bold', color: '#ff6700' }}>
          Average Match Rank:
          </span>
          <br />
          <span style={{ fontSize: '2vh', color: 'gray' }}>Region: {getRegion(match.matchId)}</span>
        </div>

        {/* Rank Image */}
        <img
          src={getRankImg(match.rank)}
          alt={match.rank}
          style={{
            height: '80px',
            borderRadius: '10px',
            objectFit: 'cover',
          }}
        />
      </div>


      {/* Middle Section: Team Info */}
      <div style={{ textAlign: 'center', flex: '3', display: 'flex', justifyContent: 'center', gap: '1vw'}}>
        {/* Your Team */}
        <div>
          <div style={{ color: '#0059ff', fontWeight: 'bold', fontSize: '2.5vh', marginBottom: '2vh' }}>Blue Team</div>
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
          <div style={{ color: '#e60026', fontWeight: 'bold', fontSize: '2.5vh', marginBottom: '2vh' }}>Red Team</div>
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

    </div>
  );
}
