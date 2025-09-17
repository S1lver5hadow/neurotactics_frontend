import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import HomeSummerySection from '../components/HomeSummerySection';
import '../styles/styles.css';

const Login = () => {
  return (
    <div className="main-container">
      <HeroSection />
    </div>
  );
};

export default Login; 