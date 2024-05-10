import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('customer'); // Default userType set to 'customer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate userType
      if (userType !== 'customer' && userType !== 'admin') {
        alert('Invalid user type');
        return;
      }

      const response = await fetch('/register', { // Changed route to /register
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          middleName,
          lastName,
          userType,
          email,
          password,
        }),
      });
      if (response.ok) {
        alert('User created successfully');
        // Optionally, redirect the user to another page after successful signup
      } else {
        const data = await response.json();
        alert(data.error || 'Signup failed'); // Changed to handle error message from server
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Middle Name:</label>
          <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="input-group">
          <label>User Type:</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <Link to="/">Back to Login</Link></p>
    </div>
  );
}

export default Signup;
