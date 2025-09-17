import React from 'react';

export default function ClusterToggleButton({ showClustering, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        backgroundColor: 'black',
        color: 'white',
        border: '2px solid white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        gap: '8px', // Space for potential icon
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#222';
        e.target.style.borderColor = '#ff6700';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'black';
        e.target.style.borderColor = 'white';
      }}
    >
      {showClustering ? 'Show Similar Matches' : 'Show Clustering'}
    </button>
  );
}
