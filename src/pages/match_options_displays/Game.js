import React, { useState, useEffect } from 'react';
import '../../App.css';
import { getAvgStats, getMatch, getKeyEvents } from '../../api';
import MapDisplay from '../game_summery/MapDisplay';
import Scoreboard from '../game_summery/Scoreboard';
import PlayerStats from '../game_summery/PlayerStats';
import { getCharacterImage } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function Game({ matchId }) {
  const [gameData, setGameData] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);
  const [currentTab, setCurrentTab] = useState('map');
  const [currentPlayerStats, setCurrentPlayerStats] = useState(0);
  const [items, setItems] = useState(null)
  const [currentTime, setCurrentTime] = useState(0);
  const [eventLog, setEventLog] = useState([]);
  const [avgStats, setAvgStats] = useState(null);
  const [mapPositions, setMapPositions] = useState([]);
  const [keyEvents, setKeyEvents] = useState([]);
  const [eventFilters, setEventFilters] = useState(['KEY_EVENT', 'CHAMPION_KILL']); // Default show all events
  const [winProbs, setWinProbs] = useState([{ time: 0, blue_win_prob: 0.5 }]); // Default 50/50 win probability
  const [showScoreboardModal, setShowScoreboardModal] = useState(false);
  const [showPlayerStatsModal, setShowPlayerStatsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!matchId) {
      alert('Match ID is required');
      return;
    }

    let mounted = true;
    setIsLoading(true);

    // Check if data exists in sessionStorage first
    const cachedData = sessionStorage.getItem(`match_${matchId}`);
    const cachedKeyEvents = sessionStorage.getItem(`keyEvents_${matchId}`);
    const cachedAvgStats = sessionStorage.getItem('avgStats');
    const cachedItems = sessionStorage.getItem('items');

    // Fetch items data
    if (cachedItems) {
      setItems(JSON.parse(cachedItems));
    } else {
      fetch("/items/items.json").then(response => {
        if (!response.ok) {
          throw new Error("No item data");
        }
        return response.json();
      }).then(json => {
        if (mounted) {
          setItems(json.data);
          sessionStorage.setItem('items', JSON.stringify(json.data));
        }
      }).catch(error => console.error("Error fetching items:", error));
    }
    
    // Fetch average stats
    if (cachedAvgStats) {
      setAvgStats(JSON.parse(cachedAvgStats));
    } else {
      getAvgStats().then(data => {
        if (mounted) {
          setAvgStats(data);
          sessionStorage.setItem('avgStats', JSON.stringify(data));
        }
      }).catch(error => console.error("Error fetching average stats:", error));
    }

    // Fetch match data
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setGameData(parsedData.frames);
      setScoreboard(parsedData.scoreboard);
      setEventLog([parsedData.frames[0].events]);
      setWinProbs(parsedData.win_probabilities);
      setIsLoading(false);
    } else {
      getMatch(matchId).then(data => {
        if (mounted) {
          setGameData(data.frames);
          setScoreboard(data.scoreboard);
          setEventLog([data.frames[0].events]);
          setWinProbs(data.win_probabilities);
          sessionStorage.setItem(`match_${matchId}`, JSON.stringify(data));
          setIsLoading(false);
        }
      }).catch(error => {
        console.error("Error fetching match data:", error);
        setIsLoading(false);
      });
    }

    // Fetch key events
    if (cachedKeyEvents) {
      setKeyEvents(JSON.parse(cachedKeyEvents));
    } else {
      getKeyEvents(matchId, 100).then(data => {
        if (mounted) {
          setKeyEvents(data["key_events"]);
          sessionStorage.setItem(`keyEvents_${matchId}`, JSON.stringify(data["key_events"]));
        }
      }).catch(error => console.error("Error fetching key events:", error));
    }

    return () => (mounted = false);
  }, [matchId]);

  const tabComponents = {
    map: (
      <MapDisplay
        gameData={gameData || { frames: [] }}
        scoreboard={scoreboard || []}
        eventLog={eventLog}
        setEventLog={setEventLog}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        mapPositions={mapPositions}
        setMapPositions={setMapPositions}
        avgStats={avgStats}
        playerId={currentPlayerStats}
        keyEvents={keyEvents}
        eventFilters={eventFilters}
        setEventFilters={setEventFilters}
        winProbs={winProbs}
        isLoading={isLoading}
      />
    ),
  };

  return (
    <div>
      <header
        style={{
          backgroundColor: '#0c0c0c',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate("/")}
            style={{ 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'none',
              border: '1px solid #4a4a5e',
              borderRadius: '4px',
              padding: '6px 12px',
              color: 'white'
            }}
          >
            ← Go back
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            color: '#a0a0b8', 
            fontSize: '13px', 
            marginBottom: '8px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            opacity: '0.8'
          }}>
            Click champion to view player stats
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isLoading ? (
              <div style={{ color: '#a0a0b8', fontSize: '14px' }}>Loading champions...</div>
            ) : (
              scoreboard.map((player, id) => (
                <img
                  key={id}
                  src={getCharacterImage(player.character)}
                  alt={`Player ${id}`}
                  onClick={() => {
                    setCurrentPlayerStats(id);
                    setShowPlayerStatsModal(true);
                  }}
                  style={{
                    border: `3px solid ${player.team === 100 ? 'blue' : 'red'}`,
                    height: '40px',
                    width: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                />
              ))
            )}
          </div>
        </div>
      </header>

      <div style={{ padding: '20px', backgroundColor: '#0c0c0c', height: 'calc(100vh - 80px)' }}>
        {isLoading && (
          <div className="loading-overlay" style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5
          }}>
            <div className="spinner"></div>
          </div>
        )}
        {tabComponents[currentTab]}
      </div>

      {showScoreboardModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div 
            style={{
              backgroundColor: '#1e1e2e',
              padding: '20px',
              borderRadius: '8px',
              width: '80%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowScoreboardModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'none',
                border: 'none',
                fontSize: '40px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Scoreboard</h2>
            <Scoreboard scoreboard={scoreboard} items={items} />
          </div>
        </div>
      )}

      {showPlayerStatsModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
            <PlayerStats 
              playerId={currentPlayerStats}
              gameData={gameData}
              scoreboard={scoreboard}
              avgStats={avgStats}
              onClose={() => setShowPlayerStatsModal(false)}  // Pass close function
            />
          </div>
      )}
    </div>
  );
}
