import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './logoblack.png';

const Header = () => {
    const location = useLocation();

    const headerStyle = {
        // position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        backgroundColor: 'transparent',
        color: 'white',
        zIndex: '1000',
        height: '7vh'
    };

    const linkStyle = {
        backgroundColor: 'transparent', // Button background color
        color: 'black', // Button text color
        border: 'none',
        padding: '10px 20px',
        margin: '0 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none', // Add this to mimic button appearance
        transition: 'opacity 0.3s', // Add transition effect for opacity change
        fontSize: '1.75rem'
    };

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const activeLinkStyle = {
        textDecoration: 'underline', // Underline for active link
    };

    const hoverStyle = {
        opacity: 0.8, // Reduce opacity on hover
    };

    return (
        <header style={headerStyle}>
            <img src={logo} alt="Logo" style={{ height: '7.5em' }} />
            <nav>
                {/* <Link to="/" style={{ ...linkStyle, ...(isActive("/") ? activeLinkStyle : {}) }} className="nav-link">Home</Link> */}
                <Link to="/query" style={{ ...linkStyle, ...(isActive("/query") ? activeLinkStyle : {}) }} className="nav-link">Query</Link>
                <Link to="/chat" style={{ ...linkStyle, ...(isActive("/chat") ? activeLinkStyle : {}) }} className="nav-link">Chat</Link>
                <Link to="/login" style={{ ...linkStyle, ...(isActive("/login") ? activeLinkStyle : {}) }} className="nav-link">Account</Link>
            </nav>
        </header>
    );
};

export default Header;
