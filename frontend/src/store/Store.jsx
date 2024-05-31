import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, DropdownButton, Dropdown, Pagination, Form, Carousel} from 'react-bootstrap';
import { Toast } from 'react-bootstrap';
import { useUser } from '../components/UserContext.jsx';
import StoreHeader from './StoreHeader.jsx';
import './Store.css'; // Import the CSS file
import FilterByType from './FilterByType.jsx';
import PaginationComponent from './Pagination.jsx';


const Store = () => {
    const { userId } = useUser();
    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState(9);
    const [startIndex, setStartIndex] = useState(0);
    const [sortOption, setSortOption] = useState('name');
    const [selectedType, setSelectedType] = useState('all'); 
    const [showToast, setShowToast] = useState(false);
    const [showAddtoCart, setShowAddtoCart] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filteredProducts, setFilteredProducts] = useState([]);


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
  
    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
      setStartIndex(0); 
    };

    const toggleSortOrder = () => {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

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
  
    const listProducts = () => {
      let filteredInventory = [...inventory];
    
      // Filter by search query
      if (searchQuery.trim() !== '') {
        filteredInventory = filteredInventory.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    
      // Filter by type
      if (selectedType !== 'all') {
        filteredInventory = filteredInventory.filter(product => product.type === selectedType);
      }
    
      filteredInventory = filteredInventory.filter(product => product.quantity > 0);
    
      // Sort the filtered inventory
      const sortedInventory = filteredInventory.sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortOption === 'name') return factor * a.name.localeCompare(b.name);
        if (sortOption === 'type') return factor * a.type.localeCompare(b.type);
        if (sortOption === 'price') return factor * (a.price - b.price);
        if (sortOption === 'quantity') return factor * (a.quantity - b.quantity);
        return 0;
      });
      return sortedInventory.slice(startIndex, startIndex + displayedProducts);
    };
    
  
  
    const changeSortOption = (option) => {
      if (sortOption === option) {
        toggleSortOrder(); // If the same option is clicked again, toggle the sorting order
      } else {
        setSortOption(option);
        setSortOrder('asc'); // Reset sorting order when changing sort option
      }
      setStartIndex(0); // Reset startIndex when changing sort option
    };

      const [isCartOpen, setIsCartOpen] = useState(false);

    //use to change heading title based on specified criteria
    const getTypeHeading = () => {
        switch (selectedType) {
          case 'all':
            return 'ALL PRODUCTS';
          case 'Crop':
            return 'CROPS';
          case 'Poultry':
            return 'POULTRY';
          default:
            return 'ALL';
        }
      };

      const handleTypeChange = (type) => {
        setSelectedType(type);
        setStartIndex(0); // Reset startIndex when changing type
      };
      
      return (
        <>
            <StoreHeader cart={cart} setCart={setCart} handleCheckout={handleCheckout} removeFromCart={removeFromCart} />
            <div className="background-container"></div> {/* Background container */}
            <Container>
                <Row className="mt-4">
                    {/* Options Sidebar - col-3 */}
                    <Col md={3}>
                        {/* Search Bar Section */}
                        <Form.Group controlId="searchBar">
                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="searchBar"
                            />
                        </Form.Group>
                        {/* Sort By Section */}
                        <div className="sort-buttons">
                            <Button
                                variant="outline-secondary"
                                onClick={() => changeSortOption('name')}
                                className={`sort-button ${sortOption === 'name' ? 'active' : ''}`}
                            >
                                Name {sortOption === 'name' && sortOrder === 'asc' ? '↑' : '↓'}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => changeSortOption('type')}
                                className={`sort-button ${sortOption === 'type' ? 'active' : ''}`}
                            >
                                Type {sortOption === 'type' && sortOrder === 'asc' ? '↑' : '↓'}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => changeSortOption('price')}
                                className={`sort-button ${sortOption === 'price' ? 'active' : ''}`}
                            >
                                Price {sortOption === 'price' && sortOrder === 'asc' ? '↑' : '↓'}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => changeSortOption('quantity')}
                                className={`sort-button ${sortOption === 'quantity' ? 'active' : ''}`}
                            >
                                Quantity {sortOption === 'quantity' && sortOrder === 'asc' ? '↑' : '↓'}
                            </Button>
                        </div>
                        <div className="mb-4">
                            {/* Filter By Type Section */}
                            <FilterByType selectedType={selectedType} handleTypeChange={handleTypeChange} />
                        </div>
                        <PaginationComponent
                        startIndex={startIndex}
                        displayedProducts={displayedProducts}
                        totalPages={Math.ceil(displayedProducts/8)}
                        setStartIndex={setStartIndex}
                        />
                    </Col>
                    {/* Product Container - col-9 */}
                    <Col md={9}>
                    <h2 className="type-heading">{getTypeHeading()}</h2>
                        <div className="product-container">
                            {listProducts().map(product => (
                                <Card key={product._id} className="product-card">
                                    <Card.Img
                                        className="product-image"
                                        variant="top"
                                        src={product.imageUrl}
                                        alt={product.name}
                                    />
                                    <Card.Body className="product-details">
                                        <Card.Title className="product-name">{product.name}</Card.Title>
                                        <Card.Text className="product-description">{product.description}</Card.Text>
                                        <Card.Text className="product-price">₱ {product.price}</Card.Text>
                                        <Card.Text className="product-stock">Stock: {product.quantity}</Card.Text>
                                        <Button
                                            className="add-to-cart-button"
                                            onClick={() => addToCart(product._id)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Sticky shopping cart summary */}
            <div className="cart-summary-sticky-popup">
                <div className="cart-summary-popup-content">
                    <div className="mt-4" style={{ padding: '3px', color: '#757575' }}>
                        <Row>
                            <Col md={12}>
                                <div className='mb-3'>
                                    <span style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>Shopping Cart ({itemCount} items)</span>
                                </div>
                                <div className="mt-2">
                                    <span>Total Price: <span style={{ padding: '10px', borderRadius: '10px', fontWeight: 'bold' }}>₱{totalPrice.toFixed(2)}</span></span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Store;
