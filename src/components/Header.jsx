import React from 'react';
import '../styles/Header.css';
import logo from '../assets/logo.png';

function Header() {
    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo-section">
                    <img src={logo} alt="SmartFinder Logo" className="header-logo" />
                    <div className="title-group">
                        <h1 className="app-title">SmartFinder</h1>
                        <p className="app-tagline">Lost &amp; Found Management System</p>
                    </div>
                </div>
                <nav className="header-nav">
                    <a href="#dashboard" className="nav-link">Dashboard</a>
                    <a href="#dashboard" className="nav-link">Reports</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;