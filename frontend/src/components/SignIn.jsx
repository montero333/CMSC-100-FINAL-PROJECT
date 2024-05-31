import React, { useState, useEffect } from 'react';
import { Container, Form, Alert } from 'react-bootstrap'; // Import Alert component
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext.jsx'; // Adjust path as needed
import './Login.css';

const SignIn = () => {
  const { setUserId } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showContainer, setShowContainer] = useState(false);

  useEffect(() => {
    // Show container after 5 seconds
    const timeout = setTimeout(() => {
      setShowContainer(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();

    // Check for empty email or password
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.'); // Set error message
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserId(data.userId);
        navigate(data.redirectTo);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  return (
    <div className="login-signin-container">
      <video autoPlay loop muted className="login-background-video">
        <source src="assets/background/login_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={`login-logo-container ${showContainer ? 'fade-out' : ''}`}>
        <img src="assets/elements/main_logo.png" alt="Main Logo" className="login-main-logo" />
      </div>
      <Container className="login-white-container" style={{ opacity: showContainer ? 1 : 0 }}>
        <button className="left-arrow-button" onClick={() => navigate('/')}> X
        <div className="left-arrow-icon"></div>
        </button>

        <div className="green-rectangle">  
          <div className="sign-in-text">SIGN IN</div>
          <div className="subtitle">Always Welcome Here</div>
          <div className="form-rectangle">  
          <Form onSubmit={handleSignIn}>
            <Form.Group controlId="formBasicEmail">
              <div className="sign-in-text-form">EMAIL</div>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="custom-input"
              />
            </Form.Group>
            <div className="sign-in-text-form">PASSWORD</div>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="custom-input"
              />
            </Form.Group>
            {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

            <button variant="success" type="submit" className="button-submit">  LOGIN  </button>
            
          </Form>
          </div>
        </div>
        <img src="assets/elements/run.gif" alt="Running" className="run-gif" />
      </Container>
    </div>
  );
};

export default SignIn;
