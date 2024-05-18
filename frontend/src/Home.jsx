// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to our Application</h1>
      <p>This is the home page.</p>
      <Link to="/signin">
        <button style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>Start Shopping</button>
      </Link>
    </div>
  );
};

export default Home;
