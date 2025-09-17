import React from 'react';
import "./styles/winBar.css";

const WinBar = ({ blueWinRate, redWinRate }) => {
    return (
        <div className="win-bar-container">
            <div className="labels">
                <span style={{ 
                    backgroundColor: '#3a3a4a', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flexShrink: 0
                }}>
                    {blueWinRate}%
                </span>
                <span style={{ 
                    backgroundColor: '#3a3a4a', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flexShrink: 0
                }}>
                    {redWinRate}%
                </span>
            </div>
            <div className="win-bar-background">
                <div
                className="win-bar-a"
                style={{ width: `${blueWinRate}%`, backgroundColor: '#4a7bff' }}
                />
                <div
                className="win-bar-b"
                style={{ width: `${redWinRate}%`, backgroundColor: '#ff6b6b' }}
                />
            </div>
        </div>
    )
}

export default WinBar;