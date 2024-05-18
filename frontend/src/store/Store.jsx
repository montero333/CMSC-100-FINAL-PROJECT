import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Toast, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import { useUser } from '../components/UserContext';
import CartDisplay from './CartDisplay';
import StoreHeader from './StoreHeader'; // Import StoreHeader

const Store = () => {
  const { userId } = useUser();
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState(8);
  const [startIndex, setStartIndex] = useState(0);
  const [sortOption, setSortOption] = useState('name');
  const [selectedType, setSelectedType] = useState('all'); 
  const [showToast, setShowToast] = useState(false);
  const [showAddtoCart, setShowAddtoCart] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  useEffect(() => {
    if (showCheckOut) {
      const timer = setTimeout(() => {
        setShowCheckOut(false);
      }, 3000);
      return () => clearTimeout(timer);  // Cleanup the timer
    }
  }, [showCheckOut]);
  

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/checkout', { userId, cart });
      console.log(response.data.message);
      setCart([]);
      setShowCheckOut(true);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (productId) => {
    const productToAdd = inventory.find((product) => product._id === productId);
    const isProductInCart = cart.some((item) => item._id === productId);
    if (isProductInCart) {
      setShowToast(true);
    } else {
      setShowAddtoCart(true);
      setCart([...cart, { ...productToAdd, displayedQuantity: 1 }]);
      console.log(cart);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
  };

  const itemCount = cart.length;
  const totalPrice = cart.reduce((total, item) => total + item.price * item.displayedQuantity, 0);

  const listProducts = () => {
    let filteredInventory = [...inventory];
    if (selectedType !== 'all') {
      filteredInventory = filteredInventory.filter(product => product.type === selectedType);
    }
    filteredInventory = filteredInventory.filter(product => product.quantity > 0);

    const sortedInventory = filteredInventory.sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'type') return a.type.localeCompare(b.type);
      if (sortOption === 'price') return a.price - b.price;
      if (sortOption === 'quantity') return a.quantity - b.quantity;
      return 0;
    });

    return sortedInventory.slice(startIndex, startIndex + displayedProducts);
  };

  const showMoreProducts = () => {
    setStartIndex(prev => prev + displayedProducts);
  };

  const showPreviousProducts = () => {
    setStartIndex(prev => Math.max(0, prev - displayedProducts));
  };

  const changeSortOption = (option) => {
    setSortOption(option);
    setStartIndex(0);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setStartIndex(0);
  };

  const getTypeHeading = () => {
    switch (selectedType) {
      case 'all':
        return 'All Products';
      case 'Crop':
        return 'Crops';
      case 'Poultry':
        return 'Poultry';
      default:
        return 'All Products';
    }
  };

  return (
    <>
      <StoreHeader cart={cart} setCart={setCart} handleCheckout={handleCheckout} removeFromCart={removeFromCart} />
      <Container className="mt-5">
        <h1 className="text-center mb-4">{getTypeHeading()}</h1>
        <Row>
          <Col md={3}>
            <h4>Filter by Type</h4>
            <Button onClick={() => handleTypeChange('all')} variant="outline-primary" className="mb-2">All</Button>
            <Button onClick={() => handleTypeChange('Crop')} variant="outline-primary" className="mb-2">Crops</Button>
            <Button onClick={() => handleTypeChange('Poultry')} variant="outline-primary" className="mb-2">Poultry</Button>
          </Col>
          <Col md={9}>
            <Row>
              {listProducts().map(product => (
                <Col md={4} key={product._id} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={product.image} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>Price: ${product.price}</Card.Text>
                      <Card.Text>Quantity: {product.quantity}</Card.Text>
                      <Button variant="success" onClick={() => addToCart(product._id)}>Add to Cart</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-center">
              {startIndex > 0 && <Button onClick={showPreviousProducts} className="mr-2">Previous</Button>}
              {startIndex + displayedProducts < inventory.length && <Button onClick={showMoreProducts}>Next</Button>}
            </div>
          </Col>
        </Row>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body>Product is already in the cart!</Toast.Body>
        </Toast>
        <Toast onClose={() => setShowAddtoCart(false)} show={showAddtoCart} delay={3000} autohide>
          <Toast.Body>Product added to cart!</Toast.Body>
        </Toast>
        {showCheckOut && <Alert variant="success">Checkout successful!</Alert>}
        <div className="mt-4">
          <CartDisplay
            cart={cart}
            setCart={setCart}
            handleCheckout={handleCheckout}
            removeFromCart={removeFromCart}
            isVisible={true}
          />
        </div>
      </Container>
    </>
  );
};

export default Store;
