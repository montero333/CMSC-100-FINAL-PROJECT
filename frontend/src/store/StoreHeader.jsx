import React, { useState } from 'react';
import { Navbar, Container, Dropdown, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import CartDisplay from './CartDisplay.jsx';

const StoreHeader = ({ cart, setCart, handleCheckout, removeFromCart }) => {
  const [isCartVisible, setCartVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    navigate('/signin');
  };

  const handleCartClick = () => {
    setCartVisible(!isCartVisible);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="sticky-top custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/store">Store</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {/* Shopping Cart Button */}
            <Button
              variant="outline-success"
              className="position-relative"
              style={{ marginRight: '40px' }}
              onClick={handleCartClick}
            >
              Cart ({cart.length})
            </Button>
            {/* Render CartDisplay component */}
            {isCartVisible && (
              <CartDisplay cart={cart} setCart={setCart} handleCheckout={handleCheckout} removeFromCart={removeFromCart} isVisible={isCartVisible} />
            )}

            {/* Account Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="default" id="account-dropdown" className="custom-dropdown-toggle">
                Account
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/store/profile" className="custom-dropdown-item">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="custom-dropdown-item">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default StoreHeader;
