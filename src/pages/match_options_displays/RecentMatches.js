import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getRecentMatches } from '../../api.js'; // Import the API functions
import { getCharacterImage, getItemImage } from '../../utils/helpers.js';
import SimilarMatchesPage from './SimilarMatches.js';
import matchStyles from '../styles/matchStyles.js';
import '../../styles/styles.css'; // Import the styles from Login
import MatchCard  from '../../components/MatchCard.js';
import RecentMatchTopSection from '../../components/RecentMatchTopSection.js';
import MatchFilterBar from '../../components/MatchFilterBar';


export default function RecentMatchesPage() {
  const [recentMatches, setRecentMatches] = useState([]);
  const [playerId, setPlayerId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [posId, setPosId] = useState(null);
  const [username, setUsername] = useState('');
  const [tag, setTag] = useState('');
  const [region, setRegion] = useState('');
  const [count, setCount] = useState(5);  // Track how many matches to fetch
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all session storage data
    sessionStorage.clear();
    window.dispatchEvent(new Event('loginStatusChanged'));

    // Navigate to login page
    navigate('/login');
  };

  async function fetchRecentMatches() {
    try {
      // Check if we have cached data for this username and tag
      const cachedKey = `recentMatches_${username}_${tag}_${count}`;
      const cachedData = sessionStorage.getItem(cachedKey);
      
      if (cachedData) {
        // Use cached data if available
        const parsedData = JSON.parse(cachedData);
        setRecentMatches(parsedData.matches);
        setPlayerId(parsedData.playerid);
        setLoading(false);
      } else {
        // Fetch new data if no cache exists
        try {
          const matches = await getRecentMatches(username, tag, region, count);

          setRecentMatches(matches["matches"]);
          setPlayerId(matches["playerid"]);

          // We only allow a max of 25 items  
          for (let i = 5; i < 26; i += 5) {
            const oldKey = `recentMatches_${username}_${tag}_${i}`;
            if (sessionStorage.getItem(oldKey)) {
              sessionStorage.removeItem(oldKey);
            }
          }

          // Cache the results
          sessionStorage.setItem(cachedKey, JSON.stringify({
            matches: matches["matches"],
            playerid: matches["playerid"],
            timestamp: Date.now()
          }));
        } catch (err) {
          navigate('/login');
          return;
        }

        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    // Get username and tag from session storage
    const storedUsername = sessionStorage.getItem('username');
    const storedTag = sessionStorage.getItem('tag');
    const storedRegion = sessionStorage.getItem('region')

    if (storedUsername && storedTag && storedRegion) {
      setUsername(storedUsername);
      setTag(storedTag);
      setRegion(storedRegion);
    } else {
      // If no credentials in session storage, redirect to login
      navigate('/login');
      return; // Return early to prevent further execution
    }
  }, [navigate]);
  
  useEffect(() => {
    if (username && tag) {
      let mounted = true;
  
      fetch("/items/items.json").then(response => {
        if (!response.ok) {
          throw new Error("No item data");
        }
        return response.json();
      }).then(json => {
        if (mounted) {
          setItems(json.data);
        }
      });
  
      fetchRecentMatches();
  
      return () => {
        mounted = false;
      };
    }
  }, [count, username, tag]);
  

  if (error) return <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;

  const openSecondModal = (match, newPosId) => {
    navigate(`/similar-matches?matchId=${match.matchId}&posId=${newPosId}`);
  };  

  const filterMatches = () => {
    let filteredMatches = [...recentMatches];
  
    if (filter === 'win') {
      filteredMatches = filteredMatches.filter(match => {
        const player = match.scoreboard.find((p) => p.playerid === playerId);
        return player ? player.did_win : false;
      });
    }   
    else if (filter === 'loss') {
      filteredMatches = filteredMatches.filter(match => {
        const player = match.scoreboard.find((p) => p.playerid === playerId);
        return player ? !player.did_win : false;
      });
    }
  
    // Apply Sorting
    if (sort === 'kda') {
      filteredMatches = filteredMatches.sort((a, b) => {
        const playerA = a.scoreboard.find((p) => p.playerid === playerId);
        const playerB = b.scoreboard.find((p) => p.playerid === playerId);
        
        const kdaA = playerA ? (playerA.kills + playerA.assists) / Math.max(1, playerA.deaths) : 0;
        const kdaB = playerB ? (playerB.kills + playerB.assists) / Math.max(1, playerB.deaths) : 0;
  
        return kdaB - kdaA;
      });
    }
    else if (sort === 'cs') {
      filteredMatches = filteredMatches.sort((a, b) => {
        const playerA = a.scoreboard.find((p) => p.playerid === playerId);
        const playerB = b.scoreboard.find((p) => p.playerid === playerId);
        
        return playerB.cs - playerA.cs;
      });
    }

  
    return filteredMatches;
  };
  

  const renderMatch = (match, index) => {
    const player = match.scoreboard.find(
      (player) => player["playerid"] === playerId
    );

    if (!player) {
      return (
        <div key={index} className="match-card">
          <h4 style={{ color: 'white' }}>Player not found in this match.</h4>
        </div>
      );
    }

    var matchPosId = -1;
    for (var i = 0; i < 10; i++) {
      if (match.scoreboard[i]["playerid"] === playerId) {
        matchPosId = i;
      }
    } 

    return (
      <MatchCard 
      key={index} 
      match={match} 
      playerId={playerId}
      items={items} 
      onViewGame={(selectedMatch) => navigate(`/game?matchId=${match.matchId}`)} 
      onViewSimilarGame={(selectedMatch) =>navigate(`/similar-matches?matchId=${match.matchId}&posId=${matchPosId}`)} 
      />
    );
  };

  return (
    <div className="recent-matches-page"
    style={{
      backgroundImage: 'url("/matches_list_display.jpg")',
      backgroundSize: '100% 100%', // Forces the image to fit the entire screen
      backgroundPosition: 'top left', // Adjust as needed
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed', // Keeps background static
      minHeight: '100vh',
      minWidth: '100vw',
      overflowX: 'hidden', // Prevents horizontal scrolling
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
    }}>

  <button
    onClick={handleLogout}
    className="logout-text"
    style={{
      position: 'absolute',
      top: '6vh',
      right: '1.8vw',
      background: 'none', // No background
      border: 'none', // No border
      color: 'grey', // Softer red, adjust as needed
      fontSize: 'clamp(1rem, 1.3vw, 1.8rem)', // Slightly larger text
      fontWeight: 'bold', // Make it stand out
      cursor: 'pointer', // Show pointer on hover
      transition: 'color 0.3s, transform 0.2s',
    }}
    onMouseEnter={(e) => {
      e.target.style.color = '#e60000'; // Darker red on hover
      e.target.style.transform = 'scale(1.05)'; // Slight pop effect
    }}
    onMouseLeave={(e) => {
      e.target.style.color = 'grey'; // Revert color
      e.target.style.transform = 'scale(1)'; // Revert size
    }}
  >
    Back
  </button>

    <div className="overall" style={{
      minHeight: '65vh', // 80% - 15% = 65% of the viewport height
      maxHeight: '80vh',
      width: '90%',
      overflowY: 'auto', // Allows scrolling if content overflows
      marginTop: '-5vh', // Starts 15% down the screen
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

    <div className="left-container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '20px'
      }}>


        {/* Left-aligned Title */}
        <div>
          <RecentMatchTopSection />
        </div>
      </div>


      <MatchFilterBar filterState={filter} onFilterChange={setFilter} onSortChange={setSort} />

      <div className="matches-list" style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%', // Take full width
        maxWidth: '95%', // Ensure it does not get constrained
        margin: '0', // Remove auto margin (prevents centering)
        padding: '0 20px', // Add slight padding for spacing
        boxSizing: 'border-box'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ 
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '5px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              borderTop: '5px solid #ff6700',
              animation: 'spin 1s linear infinite',
              WebkitAnimation: 'spin 1s linear infinite'
            }}></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @-webkit-keyframes spin {
                  0% { -webkit-transform: rotate(0deg); }
                  100% { -webkit-transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : (
          filterMatches().map(renderMatch)
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
    
    <button
    onClick={() => {
      setCount(count + 5);
      fetchRecentMatches();
    }}
    disabled={count > 19}
    style={{
      padding: '10px',
      background: '#ff6700',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '14px',
    }}
  >
    Load More
    </button>
  </div>
  </div>
  </div>
  </div>
  );
}

