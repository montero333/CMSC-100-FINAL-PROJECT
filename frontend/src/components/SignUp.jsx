import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      userName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      setError('Please fill in all fields without spaces.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, userName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(data.redirectTo);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during sign-up:', error.message);
    }
  };

  return (
    <div className="reg-signup-container">
      <video autoPlay loop muted className="reg-background-video">
        <source src="assets/background/reg_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <img src="assets/elements/signup_logo.png" alt="Logo" className="reg-logo-form" />
      <div className="reg-container">
        <a href="/" className="back-arrow">&#8592; Back</a>
        <h1 className="reg-title">REGISTER</h1>
        <form onSubmit={handleSignUp} className="reg-form">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="reg-button-submit">SUBMIT</button>
          {error && <div className="error-alert-reg">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
