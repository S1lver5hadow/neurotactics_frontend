import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [username, setUsername] = useState('');
  const [tag, setTag] = useState('');
  const [region, setRegion] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && tag && region) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('tag', tag);
      sessionStorage.setItem('region', region);
      window.dispatchEvent(new Event('loginStatusChanged'));
      navigate('/recent-matches'); 
    }
  };

  return (
    <section 
      className="hero-section"
      style={{
        backgroundColor: '#000',
        backgroundImage: 'url("/home_background.jpg")',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        paddingBottom: '6%',
        paddingTop: '6%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <h1 style={{
          fontSize: '4vw',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}>
          <span style={{ color: '#FF5722' }}>Dominate</span> With 
          <span style={{ color: 'transparent', WebkitTextStroke: '2px #FF5722' }}> Neurotactics</span>
        </h1>
        <p style={{
          fontSize: '2vw',
          margin: '20px 0 40px',
          color: '#bbb'
        }}>
          Receive the most up-to-date insights and optimize your strategies like <strong>never</strong> before.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          width: '100%',
          marginBottom: '5%',
        }}>
          <input
            type="text"
            style={{
              width: '100%',
              maxWidth: '350px',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '2px solid #FF5722',
              backgroundColor: '#222',
              color: '#fff',
              fontSize: '1.5rem',
              textAlign: 'center'
            }}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            style={{
              width: '100%',
              maxWidth: '350px',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '2px solid #FF5722',
              backgroundColor: '#222',
              color: '#fff',
              fontSize: '1.5rem',
              textAlign: 'center'
            }}
            placeholder="Enter your tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <select
            style={{
              width: '100%',
              maxWidth: '375px',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '2px solid #FF5722',
              backgroundColor: '#222',
              color: '#fff',
              fontSize: '1.5rem',
              textAlign: 'center'
            }}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="" disabled>Select your region</option>
            <option value="na1">North America</option>
            <option value="euw1">Europe West</option>
            <option value="kr">Korea</option>
          </select>
          <button 
            style={{
              backgroundColor: '#FF5722',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              transition: '0.3s',
              boxShadow: '0px 6px 12px rgba(255, 87, 34, 0.4)'
            }}
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
