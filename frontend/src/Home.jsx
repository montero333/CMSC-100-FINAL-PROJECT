import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import mainLogo from '/assets/elements/main_logo.png'; 

const Home = () => {
  const aboutUsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (aboutUsRef.current) {
      observer.observe(aboutUsRef.current);
    }

    return () => {
      if (aboutUsRef.current) {
        observer.unobserve(aboutUsRef.current);
      }
    };
  }, []);

  return (
    <div>
      <header className="header">
        <div className="logo-container">
          <img src="assets/elements/icon_logo.png" alt="Icon Logo" className="icon-logo" />
          <img src={mainLogo} alt="Main Logo" className="logo" />
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/signin" className="nav-button">Sign In</Link></li>
            <li><Link to="/signup" className="nav-button">Sign Up</Link></li>
          </ul>
        </nav>

      </header>
      <div className="home-container">
      </div>
      <div ref={aboutUsRef} className={`about-us-container ${isVisible ? 'visible' : ''}`}>
        <h2>About Us</h2>
        <p>Alay-ay is a student-driven project which revolves around the idea of Farm-To-Table.</p>
        <p>This E-Commerce Website is used by the Department of Agriculture to facilitate transactions.</p>
      </div>
    </div>
  );
};

export default Home;
