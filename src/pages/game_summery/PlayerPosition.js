import React from 'react';
import { translateCoords, getCharacterImage } from '../../utils/helpers';

export default function PlayerPosition({ player, id }) {
  const mapPoint = translateCoords(player.x, player.y);
  const randomOff = Math.random() * 3;
  const offset = player.team === 100 ? -randomOff : randomOff;

  return (
    <div
      key={`Player Position ${id}`}
      style={{
        position: 'absolute',
        left: `${mapPoint.x_percent + offset}%`,
        top: `${mapPoint.y_percent + offset}%`,
        border: `3px solid ${player.team === 100 ? 'blue' : 'red'}`,
        borderRadius: '50%',
      }}
      id={`Player Position ${id}`}
    >
      <img
        src={getCharacterImage(player.character)}
        alt={`Player ${id}`}
        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
      />
    </div>
  );
}
