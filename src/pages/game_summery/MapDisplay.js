import React, { useEffect, useState } from 'react';
import { translateCoords, getCharacterImage, ranksToColour, getRankImg, timeStampToMinutes } from '../../utils/helpers';
import Xarrow from 'react-xarrows';
import WinBar from "../../components/winBar";

export default function MapDisplay({
  gameData,
  scoreboard,
  eventLog,
  setEventLog,
  currentTime,
  setCurrentTime,
  mapPositions,
  setMapPositions,
  avgStats,
  playerId,
  keyEvents,
  eventFilters,
  setEventFilters,
  winProbs,
  isLoading
}) {

  /* For the arrows to update we need an effect to take place when currentTime is updated which 
     causes a rerender to take place. This ensures the arrows always update their locations. */
  const [handleArrows, setHandleArrows] = useState(currentTime);
  useEffect(() => {
    setHandleArrows(currentTime);
  }, [currentTime, keyEvents])

  const handleSliderChange = (e) => {
    const newTime = parseInt(e.target.value, 10);
    setCurrentTime(newTime);

    // Collect all events from time 0 to the new time
    const updatedEventLog = gameData
      .slice(0, newTime + 1)
      .flatMap((data) => data.events);

    setEventLog(updatedEventLog);
  };

  const toggleAverageRank = (rank) => {
    var newPositions = mapPositions;
    if (mapPositions.includes(rank)) {
      newPositions = mapPositions.filter(elem => elem !== rank);
    } else {
      newPositions.push(rank);
    }

    setMapPositions(newPositions);
  }

  // Default to first frame if loading or no data
  const currentData = gameData[currentTime] || { timeStamp: 0, players_metadata: [] };
  const executionIcon = `/items/Long Sword.webp`;


  const eventColors = {
    'good': '#5a85cc',
    'general up': 'green',
    'general down': 'yellow',
    'bad': 'red',
  };

  const ratingMap = {
    'good': 'brilliant.png',
    'general up': 'great.png',
    'general down': 'bad.png',
    'bad': 'blunder.png',
  };

  // Event filter handler
  const handleFilterChange = (eventType) => {
    if (eventFilters.includes(eventType)) {
      setEventFilters(eventFilters.filter(type => type !== eventType));
    } else {
      setEventFilters([...eventFilters, eventType]);
    }
  };

  // Default win probability while loading
  const currentWinProb = isLoading ? 0.5 :
    timeStampToMinutes(currentData.timeStamp) == 0 ? 0.5 : // Default to 50/50 while loading
      (winProbs && winProbs[timeStampToMinutes(currentData.timeStamp)]) || 0.5;

  return (
    <div>
      
      {/* Add WinBar component at the top */}
      <WinBar
        redWinRate={(currentWinProb * 100).toFixed(2)}
        blueWinRate={(100 - (currentWinProb * 100)).toFixed(2)}
      />
      
      <div style={{ display: 'flex', height: '90vh', padding: '5px', flexDirection: 'row', justifyContent: 'space-around' }}>
        {/* Map Section */}
        <div
          style={{
            position: 'relative',
            width: '65%',
            height: '90%',
            marginRight: '20px',
            border: '1px solid #333',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <img src="/map.png" alt="Game Map" style={{ width: '100%', height: '100%' }} />

          {currentData.players_metadata.map((player, id) => {
            const mapPoint = translateCoords(player.x, player.y);
            const randomOff = Math.random() * 3;
            const offset = player.team === 100 ? -randomOff : randomOff;
            return (
              <>
                <div
                  key={"Player Position " + id}
                  style={{
                    position: 'absolute',
                    left: `${mapPoint.x_percent + offset}%`,
                    top: `${mapPoint.y_percent + offset}%`,
                    border: `3px solid ${player.team === 100 ? 'blue' : 'red'}`,
                    borderRadius: '50%',
                  }}
                  id={"Player Position " + id}
                >
                  <img
                    src={getCharacterImage(player.character)}
                    alt={`Player ${id}`}
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />

                  {player.team === 100 && player.pos === 'JUNGLE' && keyEvents
                    .filter(([time, _, _2, _3]) => 0 <= currentTime - time && currentTime - time <= 1)
                    .map(([_, event, winnerPositions, loserPositions], index) => (
                        <img
                          key={index}
                          src={`/ratings/${ratingMap[event]}`} // Adjust the path and naming convention as needed
                          alt={`${event} Rating`}
                          style={{
                            position: 'absolute',
                            left: `${mapPoint.x_percent + index * 50}%`, // Adjust position as needed
                            top: `${mapPoint.y_percent - 15}%`, // Adjust position as needed
                            width: '20px',
                            height: '20px',
                          }}
                        />
                    ))} 
                </div>

                {player.team === 100 && player.pos === 'JUNGLE' && keyEvents
                    .filter(([time, _, _2, _3]) => 0 <= currentTime - time && currentTime - time <= 1)
                    .map(([_, event, winnerPositions, loserPositions], index) => (
                      <>
                        {winnerPositions.map(([x, y, _], idx) => {
                          const mapPoint = translateCoords(x * 13982, y * 14446);
                          return (
                            <img
                              key={`winner-${index}-${idx}`}
                              src={`/ratings/green_x.png`} // Adjust the path and naming convention as needed
                              alt={`${event} Rating`}
                              style={{
                                position: 'absolute',
                                left: `${mapPoint.x_percent}%`,
                                top: `${mapPoint.y_percent}%`,
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'transparent',
                              }}
                            />
                          );
                        })}

                        {loserPositions.map(([x, y], idx) => {
                          const mapPoint = translateCoords(x * 13982, y * 14446);
                          return (
                            <img
                              key={`loser-${index}-${idx}`}
                              src={`/ratings/red_x.png`} // Adjust the path and naming convention as needed
                              alt={`${event} Rating`}
                              style={{
                                position: 'absolute',
                                left: `${mapPoint.x_percent}%`,
                                top: `${mapPoint.y_percent}%`,
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'transparent',
                              }}
                            />
                          );
                        })}
                      </>
                    ))}
              </>
            );
          })}


          {currentTime > 0 && gameData[currentTime - 1]?.players_metadata.map((player, id) => {
            const mapPoint = translateCoords(player.x, player.y);
            const randomOff = Math.random() * 3;
            const offset = player.team === 100 ? -randomOff : randomOff;

            {/* Filter key events for the last minute and create a list of PNGs */ }

            return (
              <div>
                {/* Ghostly images of the previous location of the character */}
                <div
                  key={"Old Player Position " + id}
                  style={{
                    position: 'absolute',
                    left: `${mapPoint.x_percent + offset}%`,
                    top: `${mapPoint.y_percent + offset}%`,
                    border: `3px solid ${player.team === 100 ? 'blue' : 'red'}`,
                    borderRadius: '50%',
                    opacity: 0.5,
                  }}
                  id={"Old Player Position " + id}
                >
                  <img
                    src={getCharacterImage(player.character)}
                    alt={`Player ${id}`}
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />
                </div>

                {/* Arrow connecting ghostly image to new location */}
                <Xarrow
                  start={"Old Player Position " + id}
                  end={"Player Position " + id}
                  lineColor={player.team === 100 ? 'blue' : 'red'}
                  headColor={player.team === 100 ? 'blue' : 'red'}
                  tailColor={player.team === 100 ? 'blue' : 'red'}
                  dashness={true}
                  animateDrawing={true}
                  strokeWidth={2}
                />
              </div>
            );
          })}

          {mapPositions.map((rank) => {
            var xPos = 0;
            var yPos = 0;
            if (avgStats && currentTime < avgStats.length) {
              xPos = avgStats[currentTime][rank]["pos"][playerId][0]
              yPos = avgStats[currentTime][rank]["pos"][playerId][1]
            }
            const mapPoint = translateCoords(xPos, yPos)
            const offset = Math.random() * 3;
            return (
              <div
                key={rank}
                style={{
                  position: 'absolute',
                  left: `${mapPoint.x_percent + offset}%`,
                  top: `${mapPoint.y_percent + offset}%`,
                  border: `3px solid ${ranksToColour[rank]}`,
                  borderRadius: '50%',
                }}
              >
                <img
                  src={getRankImg(rank)}
                  alt={`Average ${rank} Position`}
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              </div>
            );
          })}
        </div>

        {/* Event Log Section */}
        <div
          style={{
            height: '90%',
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1e1e1e',
            borderRadius: '10px',
            padding: '5px',
            overflow: 'hidden',
          }}
        >
          <h1 style={{ color: '#ff6700', display:'flex', justifyContent:'center', marginBottom: '10px' }}>Event Log</h1>
          
          {/* Event Filter Dropdown */}
          <div style={{ 
            marginBottom: '15px', 
            backgroundColor: '#292929', 
            padding: '12px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <h4 style={{ 
              color: '#fff', 
              marginTop: 0, 
              marginBottom: '10px', 
              borderBottom: '1px solid #444',
              paddingBottom: '8px',
              fontSize: '16px'
            }}>
              Event Filters
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '6px',
                borderRadius: '4px',
                backgroundColor: eventFilters.includes('KEY_EVENT') ? '#1e1e1e' : '#292929', 
                transition: 'background-color 0.2s'
              }}>
                <input
                  type="checkbox"
                  checked={eventFilters.includes('KEY_EVENT')}
                  onChange={() => handleFilterChange('KEY_EVENT')}
                  style={{ accentColor: '#6c5ce7' }}
                />
                <img
                  src={`/ratings/${ratingMap['good']}`}
                  alt="Key Event"
                  style={{
                    width: '20px',
                    height: '20px',
                  }}
                />
                <span style={{ fontWeight: 'bold' }}>Key Events</span>
              </label>
              
              <label style={{ 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '6px',
                borderRadius: '4px',
                backgroundColor: eventFilters.includes('CHAMPION_KILL') ? '#1e1e1e' : '#292929',
                transition: 'background-color 0.2s'
              }}>
                <input
                  type="checkbox"
                  checked={eventFilters.includes('CHAMPION_KILL')}
                  onChange={() => handleFilterChange('CHAMPION_KILL')}
                  style={{ accentColor: '#6c5ce7' }}
                />
                <img
                  src={executionIcon}
                  alt="Champion Kill"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%'
                  }}
                />
                <span style={{ fontWeight: 'bold' }}>Champion Kills</span>
              </label>
            </div>
          </div>
          
          {/* Timeline slider moved to the top, before event log content */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              position: 'relative', 
              width: '100%',
              backgroundColor: '#292929',
              padding: '15px 15px 5px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <input
                type="range"
                min="0"
                max={Math.max(0, gameData.length - 1)}
                value={currentTime}
                onChange={handleSliderChange}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  height: '8px',
                  appearance: 'none',
                  background: 'linear-gradient(to right, #000000, #000000)',
                  borderRadius: '4px',
                  outline: 'none',
                  display: 'block',
                  boxSizing: 'border-box'
                }}
                disabled={isLoading}
              />
              {keyEvents && keyEvents.map(([time, event, _, _2], index) => {
                const position = Math.min(98, Math.max(2, (time / Math.max(1, gameData.length - 1)) * 100));
                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: `${position}%`,
                      top: '12px', // Raised above the slider
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '12px',
                      backgroundColor: eventColors[event] || 'white',
                      borderRadius: '50%',
                      border: '2px solid black',
                      cursor: 'pointer',
                      zIndex: 10,
                      pointerEvents: 'none',
                    }}
                    title={event}
                    onClick={() => !isLoading && setCurrentTime(time)}
                  />
                );
              })}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                color: '#fff',
                fontSize: '14px',
                marginTop: '5px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ 
                  backgroundColor: '#292929', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flexShrink: 0
                }}>
                  0:00
                </span>
                <span style={{ 
                  backgroundColor: '#292929', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flexShrink: 0
                }}>
                  {`Game Time: ${timeStampToMinutes(currentData.timeStamp)}:00`}
                </span>
                <span style={{ 
                  backgroundColor: '#2a2a2a', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flexShrink: 0
                }}>
                  {gameData.length > 0 ? timeStampToMinutes(gameData[gameData.length-1].timeStamp) : 0}:00
                </span>
              </div>
            </div>
            <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #000;
          }

          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #000;
          }
        `}
      </style>

          </div>
          
          <div style={{ overflowY: 'auto', flexGrow: 1 }}>
            {isLoading ? (
              <div style={{ 
                color: '#a0a0b8', 
                textAlign: 'center', 
                padding: '20px',
                fontSize: '14px'
              }}>
                Loading event data...
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {/* Combined and chronologically ordered events */}
                {[
                  // Key events with time and type
                  ...(eventFilters.includes('KEY_EVENT') && keyEvents ? keyEvents
                    .filter(([time, _, __, ___]) => time <= currentTime)
                    .map(([time, event, winnerPositions, loserPositions]) => {
                      return {
                        type: 'KEY_EVENT',
                        time: time,
                        eventType: event,
                        timestamp: gameData[time]?.time || 0
                      };
                    }) : []),
                  
                  // Champion kills with time
                  ...(eventFilters.includes('CHAMPION_KILL') ? eventLog
                    .filter((event) => event.type === 'CHAMPION_KILL')
                    .map((event) => {
                      return {
                        type: 'CHAMPION_KILL',
                        eventData: event,
                        timestamp: event.timestamp // Use the event's actual timestamp
                      };
                    }) : [])
                ]
                  .sort((a, b) => {
                    let aTime = 0;
                    if (a.type === 'KEY_EVENT') {
                      aTime = a.time;
                    } else {
                      aTime = timeStampToMinutes(a.timestamp);
                    }

                    let bTime = 0;
                    if (b.type === 'KEY_EVENT') {
                      bTime = b.time;
                    } else {
                      bTime = timeStampToMinutes(b.timestamp);
                    }
                    
                    return bTime - aTime;
                  }) // Sort by timestamp (descending - newest first)
                  .map((event, index) => {
                    
                    if (event.type === 'KEY_EVENT') {
                      return (
                        <li
                          key={`event-${index}`}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: '#292929',
                            borderRadius: '6px',
                            borderLeft: `4px solid ${eventColors[event.eventType] || 'white'}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              color: '#aaa', 
                              minWidth: '40px', 
                              textAlign: 'center',
                              padding: '2px 5px',
                              backgroundColor: '#1e1e2e',
                              borderRadius: '4px',
                              fontSize: '0.9em'
                            }}>
                              {event.time.toFixed(0)}:00
                            </span>
                            <img
                              src={`/ratings/${ratingMap[event.eventType]}`}
                              alt={event.eventType}
                              style={{
                                width: '24px',
                                height: '24px',
                              }}
                            />
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>
                              {`${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)} play`}
                            </span>
                          </div>
                        </li>
                      );
                    } else {
                      // Champion kill event
                      const killEvent = event.eventData;
                      return (
                        <li
                          key={`event-${index}`}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: '#292929',
                            borderRadius: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              color: '#aaa', 
                              minWidth: '40px', 
                              textAlign: 'center',
                              padding: '2px 5px',
                              backgroundColor: '#1e1e2e',
                              borderRadius: '4px',
                              fontSize: '0.9em'
                            }}>
                              {timeStampToMinutes(killEvent.timestamp)}:00
                            </span>
                            <img
                              src={killEvent.killer !== 0 ? getCharacterImage(scoreboard[killEvent.killer - 1].character) : executionIcon}
                              alt="Killer"
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: '2px solid ' + (scoreboard[killEvent.victim - 1].team === 100 ? 'red' : 'blue'),
                              }}
                            />
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>Killed</span>
                            <img
                              src={getCharacterImage(scoreboard[killEvent.victim - 1].character)}
                              alt="Victim"
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: '2px solid ' + (scoreboard[killEvent.victim - 1].team === 100 ? 'blue' : 'red'),
                              }}
                            />
                          </div>
                        </li>
                      );
                    }
                  })}
              </ul>
            )}
          </div>
        </div>
      </div>
      

      </div>

  );
}

