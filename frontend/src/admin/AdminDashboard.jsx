import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminDashboard.css';
import { FaUser, FaBox, FaFileInvoice, FaChartBar } from 'react-icons/fa';

import userAccountsImage from '../assets/user_accounts_image.jpg';
import productListingsImage from '../assets/product_listings_image.jpg';
import fulfillmentImage from '../assets/fulfillment_image.jpg';

const AdminDashboard = () => {
  // used to store dashboard tiles data
  const [dashboardTiles, setDashboardTiles] = useState([]);
  // manages navigation between routes
  const navigate = useNavigate();

  // fetches dashboard data 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from backend API
        const response = await axios.get('http://localhost:5000/api/dashboard-counts');
        const data = response.data;

        // Define new dashboard tiles based on fetched data
        const newDashboardTiles = [
          {
            title: 'User Accounts',
            content: 'Total Users',
            stat: `${data.userCount + 1}`, // Increment user count by 1
            image: userAccountsImage,
          },
          {
            title: 'Product Listings',
            content: 'Total Products',
            stat: `${data.productCount || 0}`, // Default to 0 if undefined
            image: productListingsImage,
          },
          {
            title: 'Fulfillment',
            content: 'Orders to Fulfill',
            stat: `${data.pendingOrderCount || 0}`, // Default to 0 if is undefined
            image: fulfillmentImage,
          },
        ];

        // Update state with new dashboard tiles
        setDashboardTiles(newDashboardTiles);
      } catch (error) {
        // Log any errors that occur during data fetching
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []); // Runs only once after initial render

  //start of styling for the admin dashboard that is implemented with css
  return (
    <div className="admin-dashboard">
      {/* Navbar component with a custom styling */}
      <Navbar className="navbar-custom">
        <Container fluid className="navbar-container">
          <Navbar.Brand href="#" className="navbar-brand-custom">Admin Dashboard</Navbar.Brand>
          {/* Logout button that navigates to the home route */}
          <Button variant="secondary" onClick={() => navigate('/')} className="logout-button">Logout</Button>
        </Container>
      </Navbar>
      
      <Container className="main-content">
        <div className="grey-box">
          {/* Navigation buttons for different admin sections */}
          <div className="nav-buttons">
            <Button className="custom-button" onClick={() => navigate('/admin-users')}>
              <div className="button-content">
                <span className="button-text">User Account</span>
                <FaUser className="button-icon" />
              </div>
            </Button>
            <Button className="custom-button" onClick={() => navigate('/admin-product-list')}>
              <div className="button-content">
                <span className="button-text">Product Listing</span>
                <FaBox className="button-icon" />
              </div>
            </Button>
            <Button className="custom-button" onClick={() => navigate('/admin-order')}>
              <div className="button-content">
                <span className="button-text">Order Fulfillment</span>
                <FaFileInvoice className="button-icon" />
              </div>
            </Button>
            <Button className="custom-button" onClick={() => navigate('/admin-sales')}>
              <div className="button-content">
                <span className="button-text">Sales Report</span>
                <FaChartBar className="button-icon" />
              </div>
            </Button>
          </div>

          {/* Render dashboard tiles */}
          <Row className="mt-4">
            {dashboardTiles.map((block, index) => (
              <Col key={index} xs={12} md={4} className="mb-4">
                {/* Each dashboard tile is a Card component */}
                <Card className="dashboard-tile">
                  <Card.Body className="tile-body">
                    <div className="tile-text">
                      {/* Title and stat (number) of the dashboard tile */}
                      <h3 className="card-title"><b>{block.title}</b></h3>
                      <Card.Text>
                        <h1>{block.stat}</h1>
                        <h5>{block.content}</h5>
                      </Card.Text>
                    </div>
                    {/* Background image for the dashboard tile */}
                    <div className="tile-image" style={{ backgroundImage: `url(${block.image})` }}></div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
