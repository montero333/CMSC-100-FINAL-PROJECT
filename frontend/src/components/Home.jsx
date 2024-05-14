// Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './CSS/Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);

    // FETCHING PRODUCTS
    useEffect(() => {
        axios.get('http://localhost:3001/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);


    // ADD TO CART FUNCTION
    const handleAddToCart = (productName) => {
        // Add logic here to add the product to the cart
        console.log(`Product added to cart: ${productName}`);
    };

    return (
        <div className="home-container">
            <nav className="navbar navbar-lower navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">Home</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/manage-cart">Manage Shopping Cart</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/manage-orders">Manage Orders</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <h1>Products</h1>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.productName} className="item-card">
                        <h2>{product.productName}</h2>
                        <p>Description: {product.productDescription}</p>
                        <p>Type: {product.productType}</p>
                        <p>Quantity: {product.productQuantity}</p>
                        <p>Price: {product.productPrice}</p>
                        <button onClick={() => handleAddToCart(product.productName)}>Add to Cart</button>
                    </div>
                ))}
            </div>
            <Link to='/login' className="btn btn-light my-5">Logout</Link>
        </div>
    );
}

export default Home;
