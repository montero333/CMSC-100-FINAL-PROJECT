import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

const CartDisplay = ({ cart, setCart, handleCheckout, removeFromCart, isVisible }) => {
  const handleQuantityChange = (event, productId, change) => {
    event.stopPropagation();
    const updatedCart = cart.map(item => {
      if (item._id === productId) {
        const newDisplayedQuantity = Math.max(0, item.displayedQuantity + change);
        return { ...item, displayedQuantity: newDisplayedQuantity };
      }
      return item;
    });

    const filteredCart = updatedCart.filter(item => item.displayedQuantity > 0);
    setCart(filteredCart);
  };

  const handleDelete = (event, productId) => {
    event.stopPropagation();
    removeFromCart(productId);
  };

  return (
    <Card className={`cart-display ${isVisible ? 'visible' : ''}`}>
      <Card.Header>
        <div style={{ fontFamily: 'Montserrat' }}>
          <b>Shopping Cart</b> - Total Items: ({cart.length})
        </div>
      </Card.Header>
      <Card.Body>
        {cart.map((item, index) => (
          <Row
            key={item._id}
            className={`mb-2 pb-2 align-items-center ${index !== cart.length - 1 ? 'border-bottom' : ''}`}
            style={{ fontFamily: 'Lato', fontSize: '16px' }}
          >
            <Col md={4}>
              <b>{item.name}</b>
            </Col>
            <Col md={2}>Qty: {item.displayedQuantity}</Col>
            <Col md={2} className="d-flex justify-content-between align-items-center">
              <div>
                <Button variant="outline-gray" size="sm" onClick={(e) => handleQuantityChange(e, item._id, -1)}>
                  -
                </Button>
                <Button
                  variant="outline-gray"
                  size="sm"
                  className="mx-1"
                  onClick={(e) => handleQuantityChange(e, item._id, 1)}
                  disabled={item.displayedQuantity === item.quantity}
                >
                  +
                </Button>
              </div>
            </Col>
            <Col md={2} className="text-right">
              ₱{(item.price * item.displayedQuantity).toFixed(2)}
            </Col>
            <Col md={1} className="text-center">
              <Button variant="outline-danger" size="sm" onClick={(e) => handleDelete(e, item._id)}>
                Delete
              </Button>
            </Col>
          </Row>
        ))}
        {cart.length === 0 && (
          <p className="text-center" style={{ fontFamily: 'Montserrat', fontSize: '16px' }}>
            Your cart is empty.
          </p>
        )}
      </Card.Body>
      <Card.Footer>
        <div style={{ fontFamily: 'Montserrat' }}>Total: ₱{cart.reduce((total, item) => total + item.price * item.displayedQuantity, 0).toFixed(2)}</div>
        <Button style={{ backgroundColor: '#4CAF50', marginTop: '10px', border: 'none' }} variant="success" onClick={handleCheckout} disabled={cart.length === 0}>
          Checkout
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default CartDisplay;
