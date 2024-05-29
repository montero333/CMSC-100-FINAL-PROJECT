import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, DropdownButton, Dropdown, Pagination, Form, Carousel} from 'react-bootstrap';
import { Toast } from 'react-bootstrap';
import { useUser } from '../components/UserContext.jsx';
import StoreHeader from './StoreHeader.jsx';

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


    const handleCheckout = async () => {
      try {
        
        setShowCheckOut(true);
        const response = await axios.post('http://localhost:5000/api/checkout', { userId, cart });
  
        console.log(response.data.message);
        
        // Clear the local cart state or take any other necessary actions
        setCart([]);
        
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
        // Update the quantity of the product in the inventory
        const updatedInventory = inventory.map((product) => {
          if (product._id === productId) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        });
        setInventory(updatedInventory);
    
        // Add the product to the cart
        setCart([...cart, { ...productToAdd, displayedQuantity: 1 }]);
      }
    };
    
  
    const removeFromCart = (productId) => {
      const updatedCart = cart.filter(item => item._id !== productId);
      setCart(updatedCart);
    };
  
    const itemCount = cart.length;
  
    const totalPrice = cart.reduce((total, item) => total + item.price * item.displayedQuantity, 0);
  
    const totalPages = Math.ceil(inventory.length / displayedProducts);
  
    const listProducts = () => {
      let filteredInventory = [...inventory];
  
      // Filter by type
      if (selectedType !== 'all') {
        filteredInventory = filteredInventory.filter(product => product.type === selectedType);
      }
      
      filteredInventory = filteredInventory.filter(product => product.quantity > 0);
  
      // Sort the filtered inventory
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
      setStartIndex(0); // Reset startIndex when changing sort option
    };
  
    const handleTypeChange = (type) => {
      setSelectedType(type);
      setStartIndex(0); // Reset startIndex when changing type
    };

    //use to change heading title based on specified criteria
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
      <StoreHeader cart={cart} setCart={setCart} handleCheckout={handleCheckout} removeFromCart = {removeFromCart} />

      
      <Container>
        <Row className="mt-4">
          {/* Options Sidebar - col-3 */}
          <Col md={3}>
            {/* Shopping Cart Section */}
          
            <Card>
              <Card.Body>
                <div className="mb-4">
                  <h6>Sort By</h6>
                  <DropdownButton id="dropdown-basic-button" title="Sort Options" variant="outline-secondary">
                    <Dropdown.Item onClick={() => changeSortOption('name')}>Name</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeSortOption('type')}>Type</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeSortOption('price')}>Price</Dropdown.Item>
                    <Dropdown.Item onClick={() => changeSortOption('quantity')}>Quantity</Dropdown.Item>
                  </DropdownButton>
                </div>
  
                {/* Radio buttons for filtering by type */}
                <div className="mb-4">
                <h6>Filter By Type</h6>
                <Form.Check
                    type="radio"
                    label="All"
                    name="typeFilter"
                    id="all"
                    checked={selectedType === 'all'}
                    onChange={() => handleTypeChange('all')}
                    custom
                />
                <Form.Check
                    type="radio"
                    label="Crops"
                    name="typeFilter"
                    id="Crop"
                    checked={selectedType === 'Crop'}
                    onChange={() => handleTypeChange('Crop')}
                    custom
                />
                <Form.Check
                    type="radio"
                    label="Poultry"
                    name="typeFilter"
                    id="Poultry"
                    checked={selectedType === 'Poultry'}
                    onChange={() => handleTypeChange('Poultry')}
                    custom
                />
                </div>
                
                {/* Navigation buttons and page indicator */}
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>Navigation</h6>
                    <Button
                      variant="secondary"
                      className="mr-2"
                      onClick={showPreviousProducts}
                      disabled={startIndex === 0}
                      style={{ backgroundColor: '#e8e9eb', border: 'none', color: '#757575' }}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={showMoreProducts}
                      disabled={startIndex + displayedProducts >= inventory.length}
                      style={{ backgroundColor: '#e8e9eb', marginLeft: '10px', border: 'none', color: '#757575' }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
  
                {/* Page Indicator */}
                <div className="mt-3">
                <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                    key={index}
                    className={`pagination-item ${index === startIndex / displayedProducts ? 'active' : ''}`}
                    onClick={() => setStartIndex(index * displayedProducts)}
                    >
                    {index + 1}
                    </Pagination.Item>
                ))}
                </Pagination>
                </div>
              </Card.Body>
            </Card>
            <div className="mt-4" style={{padding: '30px', borderRadius: '10px', color: '#757575', border: '1px solid #cccdc6'}}>
            <Row>
                    <Col md={12}>
                    <div className='mb-3'>
                        <span style={{fontFamily: 'Montserrat', fontWeight: 'bold'}}>Shopping Cart ({itemCount} items)</span>
                    </div>
                    <div className="mt-2">
                        <span>Total Price:  <span style={{border: '1px solid #4CAF50', margin: '5px', padding: '10px', borderRadius: '10px', fontWeight: 'bold'}}>₱{totalPrice.toFixed(2)}</span></span>
                    </div>
                    </Col>
            </Row>
            </div>
            
          </Col>
  
          {/* Product Container - col-8 */}
          <Col md={9}>
          <h2 className="mb-4 mt-3" style={{marginLeft: '20px', color: '#4CAF50', fontWeight: 'bold'}}>{getTypeHeading()}</h2>
            <Row>
              {listProducts().map(product => (
                <Col key={product._id} md={3} className="mb-4">
                  <Card>
                  <Card.Img
                    variant="top"
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                  <Card.Body>
                    <Card.Title style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>{product.name}</Card.Title>
                    <Card.Text style={{ fontFamily: 'Lato', color: '#4e4d4d' }}>{product.description}</Card.Text>
                    <Card.Text style={{ color: '#8D6E63', fontWeight: 'bold' }}>₱ {product.price}</Card.Text>
                    <Card.Text style={{ color: '#4e4d4d: '}}>Stock: {product.quantity}</Card.Text>

                    <Button
                      variant="success"
                      onClick={() => addToCart(product._id)}
                      style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
                    >
                      Add to Cart
                    </Button>
                    <Toast
                    onClose={() => setShowAddtoCart(false)}
                    show={showAddtoCart}
                    delay={3000}
                    autohide
                    style={{
                        position: 'fixed',
                        padding: '10px',
                        bottom: 40,
                        left: 80,
                        zIndex: 1,
                        borderRadius: '20px',
                        backgroundColor: '#4CAF50',
                        border: 'none',
                        boxShadow: 'none', 
                    }}
                    >
                    <Toast.Body style={{ fontFamily: 'Montserrat', color: 'white' }}>
                        <strong className="mr-auto" style={{ fontWeight: 'bold' }}>
                        SUCCESS: &nbsp;
                        </strong>
                        Added to Cart!
                    </Toast.Body>
                    </Toast>

                    <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    style={{
                        position: 'fixed',
                        padding: '10px',
                        bottom: 40,
                        left: 80,
                        zIndex: 1,
                        borderRadius: '20px',
                        backgroundColor: '#FFC107',
                        border: 'none',
                        boxShadow: 'none', 

                    }}
                    >
                    <Toast.Body style={{ fontFamily: 'Montserrat', color: 'black' }}>
                        <strong className="mr-auto" style={{ fontWeight: 'bold' }}>
                        ERROR: &nbsp;
                        </strong>
                        This item is already in your cart!
                    </Toast.Body>
                    </Toast>
                    <Toast
                    onClose={() => setShowCheckOut(false)}
                    show={showCheckOut}
                    delay={5000}
                    autohide
                    style={{
                      position: 'fixed',
                      padding: '10px',
                      bottom: 40,
                      left: 80,
                      zIndex: 1,
                      borderRadius: '20px',
                      backgroundColor: '#4CAF50',
                      border: 'none',
                      boxShadow: 'none',  

                    }}
                    >
                    <Toast.Body style={{ fontFamily: 'Montserrat', color: 'white' }}>
                        <strong className="mr-auto" style={{ fontWeight: 'bold' }}>
                        SUCCESS: &nbsp;
                        </strong>
                        Cart items successfully checked out!
                    </Toast.Body>
                    </Toast>
                  </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

      
    </Container>
    <div className="m-4"></div>
    </>
  );
};

export default Store;
