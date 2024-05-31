import React, { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import CartDisplay from './CartDisplay.jsx';
import './StoreHeader.css';

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
          <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse">
            <Nav className="navbar-nav">
              <Nav.Link as={Link} to="/store" className="nav-link">Store</Nav.Link>
              <Nav.Link as={Link} to="/store/profile" className="nav-link">Account</Nav.Link>
              <Button
                variant="outline-success"
                className="logout-link"
                onClick={handleCartClick}
              >
                Cart ({cart.length})
              </Button>
              <Nav.Link as="button" className="logout-link" onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <CartDisplay
        cart={cart}
        setCart={setCart}
        handleCheckout={handleCheckout}
        removeFromCart={removeFromCart}
        isVisible={isCartVisible}
        toggleCartVisibility={handleCartClick}
      />
      <Outlet />
    </>
  );
};

export default StoreHeader;
