import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AdminHome from './Admin/AdminView';
import ManageAccount from './Admin/ManageAccount';
import ProductListing from './Admin/ProductListing';
import ManageCart from './ManageCart';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      <div style={{ marginTop: '-3.5rem' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/manage-accounts" element={<ManageAccount />} />
            <Route path="/product-listing" element={<ProductListing />} />
            <Route path="/manage-cart" element={<ManageCart />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;
