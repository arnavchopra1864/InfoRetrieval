// src/components/Header.js
import React from 'react';
import logo from './logo.png'; // Adjust the path as necessary
import { Link } from 'react-router-dom';

const Header = () => (
    <header style={headerStyle}>
    <img src={logo} alt="Logo" style={{ height: '50px' }} />
    <nav>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/login" style={linkStyle}>Login</Link>
    </nav>
  </header>
);

// Example button style
const buttonStyle = {
  backgroundColor: '#444', // Button background color
  color: 'white', // Button text color
  border: 'none',
  padding: '10px 20px',
  margin: '0 10px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#333',
    color: 'white',
  };

const linkStyle = {
    ...buttonStyle,
    textDecoration: 'none', // Add this to mimic button appearance
  };

export default Header;
