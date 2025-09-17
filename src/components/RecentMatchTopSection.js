// src/components/Title.js
import React from 'react';

export default function Title() {
  return (
    <div style={{
      textAlign: 'left',
      padding: '20px 15px',
      fontSize: '50px',
      fontWeight: 'bold',
      color: 'white'
    }}>
      <span style={{ color: '#ffffff' }}>Recent</span> <span style={{ color: '#ff6700' }}>Matches</span>
      <p style={{ fontSize: '25px', fontWeight: 'normal', color: '#aaaaaa' }}>
        View and analyze your recent game performance
      </p>
    </div>
  );
}
