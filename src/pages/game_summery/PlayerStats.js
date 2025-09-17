import React, { useState } from 'react';
import { getCharacterImage } from '../../utils/helpers';
import '../../styles/stats_styles.css';
import PlayerStatsGraphs from '../../components/PlayerStatsGraphs.js';
import PlayerStatsCombatGraphs from '../../components/PlayerStatsCombatGraphs.js';
import PlayerStatsIncomeGraphs from '../../components/PlayerStatsIncomeGraphs.js';
import PlayerStatsVisionGraph from '../../components/PlayerStatsVisionGraph.js';

export default function DisplayPlayerStats({ playerId, gameData, scoreboard, onClose }) {
    const [activeTab, setActiveTab] = useState('overview'); // State for tracking active tab

    const player = gameData[0].players_metadata[playerId];
    const characterImage = getCharacterImage(player.character);
    const team = player.team;
    const oppId = team === 100 ? playerId + 5 : playerId - 5;
    
    // Calculate Key Stats
    let teamKills = 0;
    for (let i = 0; i < 5; i++) {
        teamKills += team === 100 ? scoreboard[i].kills : scoreboard[i + 5].kills;
    }
    const gameLength = Math.round(gameData[gameData.length - 1].timeStamp / 60000);
    const killParticipation = Math.round((scoreboard[playerId].kills + scoreboard[playerId].assists) / teamKills * 100);
    const csPerMinute = (scoreboard[playerId].cs / gameLength).toFixed(1);
    const goldPerMinute = Math.round(scoreboard[playerId].gold / gameLength);

    // Prepare Data for Graphs
    const timeLabels = gameData.map((entry) => Math.round(entry.timeStamp / 60000));
    const playerStats = {
        kills: gameData.map(entry => entry.players_metadata[playerId].kills),
        deaths: gameData.map(entry => entry.players_metadata[playerId].deaths),
        assists: gameData.map(entry => entry.players_metadata[playerId].assists),
        gold: gameData.map(entry => entry.players_metadata[playerId].gold),
        cs: gameData.map(entry => entry.players_metadata[playerId].cs),
        wardsPlaced: gameData.map(entry =>  entry.players_metadata[playerId].wards_placed),
        wardsKilled: gameData.map(entry =>  entry.players_metadata[playerId].wards_killed)
    };
    const oppStats = {
        gold: gameData.map(entry => entry.players_metadata[oppId].gold),
    };

    return (
        <div className="player-overview">
            {/* Header Section */}
            <div className="header-container">
                <button className="close-button" onClick={onClose}>X</button>
                <div className="player-header">
                    <img src={characterImage} alt="Champion" className="champion-icon" />
                </div>                
            </div>

            {/* Key Stats */}
            <div className="key-stats-container">
                <div className="stat-box">
                    <h3>{killParticipation}%</h3>
                    <p>Kill Participation</p>
                </div>
                <div className="stat-box">
                    <h3>{csPerMinute}</h3>
                    <p>CS Per Minute</p>
                </div>
                <div className="stat-box">
                    <h3>{goldPerMinute}</h3>
                    <p>Gold Per Minute</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="nav-tabs">
                <button className={activeTab === 'overview' ? 'active-tab' : ''} onClick={() => setActiveTab('overview')}>
                    Overview
                </button>
                <button className={activeTab === 'combat' ? 'active-tab' : ''} onClick={() => setActiveTab('combat')}>
                    Combat
                </button>
                <button className={activeTab === 'income' ? 'active-tab' : ''} onClick={() => setActiveTab('income')}>
                    Income
                </button>
                <button className={activeTab === 'vision' ? 'active-tab' : ''} onClick={() => setActiveTab('vision')}>
                    Vision
                </button>
            </div>

            {/* Conditional Rendering for Graphs */}
            {activeTab === 'overview' && <PlayerStatsGraphs timeLabels={timeLabels} playerStats={playerStats} oppStats={oppStats} />}
            {activeTab === 'combat' && <PlayerStatsCombatGraphs timeLabels={timeLabels} playerStats={playerStats} oppStats={oppStats} />}
            {activeTab === 'income' && <PlayerStatsIncomeGraphs timeLabels={timeLabels} playerStats={playerStats} oppStats={oppStats} />}
            {activeTab === 'vision' && <PlayerStatsVisionGraph timeLabels={timeLabels} playerStats={playerStats} oppStats={oppStats} />}

        </div>
    );
}
