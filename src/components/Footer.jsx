import React from 'react';
import '../styles/Footer.css';

function Footer() {
    const currentYear = "2026";

    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-bottom">
                    <p>&copy; {currentYear} SmartFinder. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
