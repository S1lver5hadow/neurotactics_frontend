import React from 'react';
import { getCharacterImage } from '../../utils/helpers';

export default function EventLog({ eventLog, scoreboard, executionIcon }) {
  return (
    <div
      style={{
        height: '90%',
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e1e2e',
        borderRadius: '10px',
        padding: '5px',
        overflow: 'hidden',
      }}
    >
      <h3 style={{ color: '#fff', marginBottom: '10px' }}>Event Log</h3>
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {eventLog
            .filter((event) => event.type === 'CHAMPION_KILL')
            .map((event, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: '#2e2e3e',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={event.killer !== 0 ? getCharacterImage(scoreboard[event.killer - 1].character) : executionIcon}
                    alt="Killer"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: `2px solid ${scoreboard[event.victim - 1].team === 100 ? 'red' : 'blue'}`,
                    }}
                  />
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Killed</span>
                  <img
                    src={getCharacterImage(scoreboard[event.victim - 1].character)}
                    alt="Victim"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: `2px solid ${scoreboard[event.victim - 1].team === 100 ? 'blue' : 'red'}`,
                    }}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
