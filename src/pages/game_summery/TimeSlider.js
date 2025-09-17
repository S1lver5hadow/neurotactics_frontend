import React from 'react';
import { timeStampToMinutes } from '../../utils/helpers';

export default function TimeSlider({ gameData, currentTime, setCurrentTime }) {
  if (!gameData || gameData.length === 0) {
    return <p style={{ color: 'white' }}>No game data available.</p>;
  }

  const handleSliderChange = (e) => {
    setCurrentTime(parseInt(e.target.value, 10));
  };

  return (
    <div style={{ padding: '10px', textAlign: 'center', backgroundColor: '#1e1e2e', borderRadius: '10px', marginTop: '10px' }}>
      <input
        type="range"
        min="0"
        max={gameData.length - 1}
        value={currentTime}
        onChange={handleSliderChange}
        style={{
          width: '100%',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
      />
      <p style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
        {"Game Time: " + timeStampToMinutes(gameData[currentTime]?.timeStamp || 0)}
      </p>
    </div>
  );
}
