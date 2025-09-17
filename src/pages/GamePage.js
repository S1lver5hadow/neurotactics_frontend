import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Game from './match_options_displays/Game';

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId');
  const navigate = useNavigate();

  // If no matchId is provided, redirect to recent matches
  if (!matchId) {
    navigate('/recent-matches');
    return null;
  }

  return (
    <div>
      <Game matchId={matchId} />
    </div>
  );
} 