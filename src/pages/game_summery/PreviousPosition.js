import React from 'react';
import Xarrow from 'react-xarrows';
import { translateCoords, getCharacterImage } from '../../utils/helpers';

export default function PreviousPosition({ player, id }) {
  const mapPoint = translateCoords(player.x, player.y);
  const randomOff = Math.random() * 3;
  const offset = player.team === 100 ? -randomOff : randomOff;

  return (
    <div>
      <div
        key={`Old Player Position ${id}`}
        style={{
          position: 'absolute',
          left: `${mapPoint.x_percent + offset}%`,
          top: `${mapPoint.y_percent + offset}%`,
          border: `3px solid ${player.team === 100 ? 'blue' : 'red'}`,
          borderRadius: '50%',
          opacity: 0.5,
        }}
        id={`Old Player Position ${id}`}
      >
        <img
          src={getCharacterImage(player.character)}
          alt={`Player ${id}`}
          style={{ width: '30px', height: '30px', borderRadius: '50%' }}
        />
      </div>

      <Xarrow
        start={`Old Player Position ${id}`}
        end={`Player Position ${id}`}
        lineColor={player.team === 100 ? 'blue' : 'red'}
        headColor={player.team === 100 ? 'blue' : 'red'}
        tailColor={player.team === 100 ? 'blue' : 'red'}
        dashness
        animateDrawing
        strokeWidth={2}
      />
    </div>
  );
}
