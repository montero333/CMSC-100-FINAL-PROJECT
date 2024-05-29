// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn.jsx'; 
import { UserProvider } from './components/UserContext.jsx';
import Home from './Home.jsx';
import SignUp from './components/SignUp.jsx';
import Store from './store/Store.jsx';
import AccountProfile from './store/AccountProfile.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import OrderFulfillment from './admin/OrderFulfillment.jsx';
import SalesReports from './admin/SalesReport.jsx';
import ProductListing from './admin/ProductList.jsx';
import UserAccount from './admin/UserAccount.jsx';


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

          
          <Route path= '/admin-dashboard' element = {<AdminDashboard />} />
          <Route path = '/admin-order' element = {<OrderFulfillment/>} />
          <Route path = '/admin-sales' element = {<SalesReports/>} />
          <Route path = '/admin-product-list' element = {<ProductListing/>} />
          <Route path = '/admin-users' element = {<UserAccount/>} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
