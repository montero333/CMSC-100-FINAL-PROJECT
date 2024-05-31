import React from 'react';
import { Button, Card } from 'react-bootstrap';
import './CartDisplay.css'; // Import CSS file for CartDisplay

const CartDisplay = ({ cart, setCart, handleCheckout, removeFromCart, isVisible, toggleCartVisibility }) => {
  const handleQuantityChange = (event, productId, change) => {
    event.stopPropagation();
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        const newDisplayedQuantity = Math.max(0, item.displayedQuantity + change);
        return { ...item, displayedQuantity: newDisplayedQuantity };
      }
      return item;
    });

    // Remove items with quantity 0 or less from the cart
    const filteredCart = updatedCart.filter((item) => item.displayedQuantity > 0);
    setCart(filteredCart);
  };

  const handleDelete = (event, productId) => {
    event.stopPropagation();
    // Filter out the item with the specified productId
    removeFromCart(productId);
  };

  return (
    <div className={`overlay ${isVisible ? 'visible' : ''}`}>
      <div className="popup">
        <Button className="close-button" onClick={toggleCartVisibility}>X</Button>
        <Card className="cart-display">
          <Card.Header className="text-center">
            <div style={{ fontFamily: 'Montserrat' }}>
              <b>Shopping Cart</b>
            </div>
            <div className="subtitle">
              Total Items: ({cart.length})
            </div>
          </Card.Header>
          <Card.Body>
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-details">
                    <span className="item-name"><b>{item.name}</b></span>
                    <span className="item-quantity"> Qty: {item.displayedQuantity}</span>
                  </div>
                  <div className="item-actions">
                    <Button
                      variant="outline-gray"
                      size="sm"
                      onClick={(e) => handleQuantityChange(e, item._id, -1)}
                    >
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
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => handleDelete(e, item._id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="item-price">₱{(item.price * item.displayedQuantity).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <p className="empty-cart-message" style={{ fontFamily: 'Montserrat', fontSize: '16px' }}>
                Your cart is empty.
              </p>
            )}
          </Card.Body>
          {cart.length > 0 && (
            <Card.Footer className="text-center">
              <div style={{ fontFamily: 'Montserrat' }}>
                Total: ₱{cart.reduce((total, item) => total + item.price * item.displayedQuantity, 0).toFixed(2)}
              </div>
              <Button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Checkout
              </Button>
            </Card.Footer>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CartDisplay;
