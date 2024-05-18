// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn.jsx'; // Adjusted import path
import { UserProvider } from './components/UserContext.jsx'; // Adjust path as needed
import Home from './Home.jsx';
import SignUp from './components/SignUp.jsx';
import Store from './store/Store.jsx';
import AccountProfile from './store/AccountProfile.jsx';


const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path='/signup' element = {<SignUp />} />
          <Route path = '/store' element = {<Store />} />
          <Route path = "/store/profile" element = {<AccountProfile />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
