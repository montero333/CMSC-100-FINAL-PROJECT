import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome-container">
            <img src="/src/assets/logo.png" alt="Logo" className="logo" />
            <h1 className="title">Alay-ay</h1>
            <h2 className="subtitle">LEAF ABI PRESENTS</h2>
            <h3 className="secondary-subtitle">Where Agriculture Meets Your Table</h3>
            <Link to="/Register" className="button">Get Started</Link>
            <Link to="/Register" className="sign-in-text">SIGN IN HERE</Link>
        </div>
    );
};

export default Welcome;
