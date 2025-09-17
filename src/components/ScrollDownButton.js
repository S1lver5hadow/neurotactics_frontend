import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const ScrollDownButton = ({ target }) => {
  const scrollToSection = () => {
    const section = document.querySelector(target);
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button className="scroll-button" onClick={scrollToSection}>
      <FaChevronDown className="scroll-icon" />
    </button>
  );
};

export default ScrollDownButton;
