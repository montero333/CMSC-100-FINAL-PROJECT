import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './CSS/Home.css';
import products from './products';
import { useCart } from './CartContext';

const Home = () => {
  const [quantities, setQuantities] = useState({});
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [cartMessage, setCartMessage] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const initialQuantities = products.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleAddToCart = (productId, productName) => {
    const userId = userEmail;
    if (!userId) {
      console.error('No user logged in');
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      const quantity = quantities[productId];
      addToCart(product, quantity);
      setCartMessage(`Product "${productName}" added to cart`);
      fetch('http://localhost:3001/manage-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userId,
          products: [{ productID: productId, productName: productName, quantity: quantity }]
        }),
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error adding item to cart:', error));
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setCartMessage(`Failed to add product "${productName}" to cart`);
    }
  };
  

  return (
    <div className="home-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="navbar-brand" onClick={() => navigate("/home")}>Home</button>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate("/manage-cart")}>
                  Manage Shopping Cart
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate("/manage-orders")}>
                  Manage Orders
                </button>
              </li>
            </ul>
            <span className="navbar-text">Logged in as: {userEmail}</span>
            <button className="btn btn-outline-danger ms-3" onClick={() => { localStorage.removeItem('userEmail'); setUserEmail(''); navigate('/login'); }}>Logout</button>
          </div>
        </div>
      </nav>
      <h1>Products</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="item-card">
            <h2>{product.name}</h2>
            <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px' }} />
            <p>Price: ${product.price}</p>

            <p>Description: {product.description}</p>
            <p>Type: {product.type}</p>

            <div className="quantity-control">
              <label>Quantity:</label>
              <input
                type="number"
                value={quantities[product.id]}
                min="1"
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
              />
            </div>

            <button onClick={() => handleAddToCart(product.id, product.name)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {cartMessage && <p>{cartMessage}</p>}
    </div>
  );
};

export default Home;
