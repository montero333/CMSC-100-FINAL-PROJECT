// SignUp.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';

const SignUp = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [UserName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      UserName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      setError('Please fill in all fields without spaces.');
      return;
    }

     // Validate email format using a regular expression
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
        body: JSON.stringify({ firstName,lastName, UserName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful sign-in, navigate to the desired destination
        navigate(data.redirectTo);
      } else {
        // Handle sign-in error
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  return (
    <div
      className="imageOverlay bg-dark"
      style={{
          minHeight: '100vh',
          background: 'rgba(0, 0, 0, 0.5) url("https://drive.google.com/uc?export=view&id=1ItxClMa5mSR8Zt1Y3nm24taZbRZ1NHAj") no-repeat', // Fix: no-repeat
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
      }}
      >
    <Container className="mt-5" style={{ width: '500px', backgroundColor: '#f8f9fa', padding: '40px', borderRadius: '8px'}}>

      <h3 className="text-center mb-4">Create an Account</h3>
      <Form>
        <Form.Group controlId="formBasicFirstName">
          <Form.Label style={{ paddingTop: '10px'}}>First Name</Form.Label>
          <Form.Control type="text" onChange={(e)=>setFirstName(e.target.value)} placeholder="Enter first name" />
        </Form.Group>

        <Form.Group controlId="formBasicLastName">
          <Form.Label style={{ paddingTop: '10px'}}>Last Name</Form.Label>
          <Form.Control type="text" onChange={(e)=>setlastName(e.target.value)} placeholder="Enter last name" />
        </Form.Group>

        <Form.Group controlId="formBasicUsername">
          <Form.Label style={{ paddingTop: '10px'}}>Username</Form.Label>
          <Form.Control type="text" onChange={(e)=>setUserName(e.target.value)} placeholder="Enter username" />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label style={{ paddingTop: '10px'}}>Email address</Form.Label>
          <Form.Control type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label style={{ paddingTop: '10px'}}>Password</Form.Label>
          <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)}placeholder="Password" />
        </Form.Group>

        
        {error && <Alert variant="danger" className="error-alert">{error}</Alert>} 

        <Button  onClick={handleSignUp} variant="success" type="submit" className="w-100 mt-3 cstm-btn" style={{  marginTop: '10px', padding: '10px'}}>
          <i className="fas fa-user-plus mr-2"></i> Sign Up
        </Button>
      </Form>
      <p style={{ fontFamily: 'Lato, sans-serif', marginTop: '10px', textAlign: 'center' }}>
        Already have an account? <Link to="/signin" style={{ color: '#4CAF50', fontWeight: 'bold', textDecoration: 'none' }}>Sign in</Link>
      </p>
      <p style={{ fontFamily: 'Lato, sans-serif', marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#555' }}>
        By signing up, you agree to our{' '}
        <Link to="/privacy-policy" style={{ color: '#4CAF50'}}>
          Privacy Policy
        </Link>
      </p>
    </Container>
    </div>
  );
};

export default SignUp;
