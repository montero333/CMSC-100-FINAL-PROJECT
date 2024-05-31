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
  const [dashboardTiles, setDashboardTiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard-counts');
        const data = response.data;

        const newDashboardTiles = [
          {
            title: 'User Accounts',
            content: 'Total Users',
            stat: `${data.userCount + 1}`,
            image: userAccountsImage,
          },
          {
            title: 'Product Listings',
            content: 'Total Products',
            stat: `${data.productCount || 0}`,
            image: productListingsImage,
          },
          {
            title: 'Fulfillment',
            content: 'Orders to Fulfill',
            stat: `${data.pendingOrderCount || 0}`,
            image: fulfillmentImage,
          },
        ];

        setDashboardTiles(newDashboardTiles);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <Navbar className="navbar-custom">
        <Container fluid className="navbar-container">
          <Navbar.Brand href="#" className="navbar-brand-custom">Admin Dashboard</Navbar.Brand>
          <Button variant="secondary" onClick={() => navigate('/')} className="logout-button">Logout</Button>
        </Container>
      </Navbar>

      <Container className="main-content">
        <div className="grey-box">
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

          <Row className="mt-4">
            {dashboardTiles.map((block, index) => (
              <Col key={index} xs={12} md={4} className="mb-4">
                <Card className="dashboard-tile">
                  <Card.Body className="tile-body">
                    <div className="tile-text">
                      <h3 className="card-title"><b>{block.title}</b></h3>
                      <Card.Text>
                        <h1>{block.stat}</h1>
                        <h5>{block.content}</h5>
                      </Card.Text>
                    </div>
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
