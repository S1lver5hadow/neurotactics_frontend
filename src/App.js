import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RecentMatchesPage from './pages/match_options_displays/RecentMatches';
import Login from './pages/Login';
import GamePage from './pages/GamePage';
import SimilarMatchesPage from './pages/match_options_displays/SimilarMatches';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem('username') && !!sessionStorage.getItem('tag') && !!sessionStorage.getItem('region')
  );

  useEffect(() => {
    // Function to check login status
    const checkLoginStatus = () => {
      setIsLoggedIn(
        !!sessionStorage.getItem('username') && !!sessionStorage.getItem('tag') && !!sessionStorage.getItem('region')
      );
    };

    // Listen for custom login event
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/recent-matches" /> : <Navigate to="/login" />} />
        <Route path="/recent-matches" element={isLoggedIn ? <RecentMatchesPage /> : <Navigate to="/login" />} /> 
        <Route path="/login" element={isLoggedIn ? <Navigate to="/recent-matches" /> : <Login />} />
        <Route path="/game" element={isLoggedIn ? <GamePage /> : <Navigate to="/login" />} />
        <Route path="/similar-matches" element={isLoggedIn ? <SimilarMatchesPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
