import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Alert, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const shades = ['#e7e7e7', '#f4f1ef', '#fff9e6', '#edf7ee'];
  const [dashboardTiles, setdashboardTiles] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts from the server
        const response = await axios.get('http://localhost:5000/api/dashboard-counts');
        const data = response.data;

        // Update the dashboardTiles with the fetched counts
        const newDashboardTiles = [
          {
            title: 'User Accounts',
            content: 'Total Users',
            stat: `${data.userCount+1}`,
          },
          {
            title: 'Product Listings',
            content: 'Total Products',
            stat: `${data.productCount || 0}`,
          },
          {
            title: 'Fulfillment',
            content: 'Orders to Fulfill',
            stat: `${data.pendingOrderCount || 0}`,
          },
        ];

        setdashboardTiles(newDashboardTiles);
        setCustomerCount(data.userCount + 1);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [customerCount]);

  return (
    <div className="admin-dashboard">
      <Navbar bg="light" expand="lg">
      <Button variant="secondary" onClick={() => navigate('/')}>
        Log Out
        </Button>
        <Container>
          <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/admin-users">User Account</Nav.Link>
              <Nav.Link href="/admin-product-list">Product Listing</Nav.Link>
              <Nav.Link href="/admin-order">Order Fulfillments</Nav.Link>
              <Nav.Link href="/admin-sales">Sales Report</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      
  
      <Container className="mt-4">
       
        <Row className="g-4">
          {dashboardTiles.map((block, index) => (
            <Col key={index} xs={12} sm={6} md={6} lg={3}>
              <Card className="h-100" style={{ backgroundColor: shades[index % shades.length], padding: '10px', color: '#4caf50', fontFamily: 'Montserrat', borderRadius: '20px', border: '3px solid white' }}>
                <Card.Body>
                  <h3><b>{block.title}</b></h3>
                  <Row>
                    <Col className="col-4 d-flex justify-content-center">
                      <Card.Text><h1>{block.stat}</h1></Card.Text>
                    </Col>
                    <Col className="col-8 d-flex justify-content-start align-items-center">
                      <Card.Text><h5>{block.content}</h5></Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
