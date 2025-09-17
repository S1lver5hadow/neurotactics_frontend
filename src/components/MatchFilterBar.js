import React, { useState } from 'react';
import { Filter, ArrowDownWideNarrow, CheckCircle, XCircle } from 'lucide-react';

export default function MatchFilterBar({ filterState, sortState, onFilterChange, onSortChange }) {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
      {/* Filter Dropdown */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setFilterDropdownOpen(!filterDropdownOpen)} style={buttonStyle}>
          <Filter size={16} /> Filter {filterState ? `(${filterState === 'win' ? 'Wins' : 'Losses'})` : ''}
        </button>

        {filterDropdownOpen && (
          <div style={dropdownStyle}>
            <DropdownOption onClick={() => { onFilterChange('win'); setFilterDropdownOpen(false); }} isActive={filterState === 'win'}>
              <CheckCircle size={14} style={{ marginRight: '8px' }} /> Wins
            </DropdownOption>
            <DropdownOption onClick={() => { onFilterChange('loss'); setFilterDropdownOpen(false); }} isActive={filterState === 'loss'}>
              <XCircle size={14} style={{ marginRight: '8px' }} /> Losses
            </DropdownOption>
            <DropdownOption onClick={() => { onFilterChange(null); setFilterDropdownOpen(false); }} isActive={false} isClear>
              Clear Filter
            </DropdownOption>
          </div>
        )}
      </div>

      {/* Sort Dropdown */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)} style={buttonStyle}>
          <ArrowDownWideNarrow size={16} /> Sort by {sortState === 'cs' ? 'CS' : 'KDA'}
        </button>

        {sortDropdownOpen && (
          <div style={dropdownStyle}>
            <DropdownOption onClick={() => { onSortChange('kda'); setSortDropdownOpen(false); }} isActive={sortState === 'kda'}>
              KDA
            </DropdownOption>
            <DropdownOption onClick={() => { onSortChange('cs'); setSortDropdownOpen(false); }} isActive={sortState === 'cs'}>
              CS
            </DropdownOption>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Dropdown Option Component */
const DropdownOption = ({ children, onClick, isActive, isClear }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '8px 16px',
      background: isActive ? '#ff6700' : 'transparent',
      color: isClear ? 'gray' : 'black',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'background 0.3s ease',
    }}
  >
    {children}
  </button>
);

/* 🔹 Button Styling */
const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 20px',
  background: 'none',
  border: '1px solid #ccc',
  color: 'white',
  cursor: 'pointer',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background 0.3s ease',
};

/* 🔹 Dropdown Menu Styling */
const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  background: 'white',
  borderRadius: '6px',
  padding: '5px 0',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  minWidth: '140px',
  zIndex: 100,
};
