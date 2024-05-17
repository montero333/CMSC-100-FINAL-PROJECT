import React from 'react';
import { useCart } from './CartContext';
import './CSS/Cart.css';

const ManageCart = () => {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  return (
    <div className="shopping-cart">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <span className="item-info">
                  {item.name} - ${item.price} x {item.quantity}
                </span>
                <button className="delete-btn" onClick={() => handleRemoveFromCart(item.productId)}>Delete</button>
              </div>
            ))}
            <div className="total-price">
              <span>Total Price: ${totalPrice.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageCart;
