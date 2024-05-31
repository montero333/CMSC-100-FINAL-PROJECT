import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CSS/UserAccount.css';

const UserAccount = ({ onCustomerCountChange }) => {
  // state variables
  const [users, setUsers] = useState([]); // all users fetched 
  const [customerCount, setCustomerCount] = useState(0); // count of customer users
  const [selectedUserDetails, setSelectedUserDetails] = useState(null); // details of selected user
  const [showUserDetails, setShowUserDetails] = useState(false); // flags to show user details
  const [searchTerm, setSearchTerm] = useState(''); //search term used for filtering
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users'); // fetch users from API
        const customerUsers = response.data.filter(user => user.UserType === 'Customer'); //filter customer user
        setUsers(customerUsers); //set all customer user
        setCustomerCount(customerUsers.length); //set count
        onCustomerCountChange(customerUsers.length); //update count in parent component
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [onCustomerCountChange]);

  // hanldes view details
  const handleViewDetails = (user) => {
    setSelectedUserDetails(user);
    setShowUserDetails(true);
  };

  //handle close button in details
  const handleCloseDetails = () => {
    setShowUserDetails(false);
  };

  // filters users based on search
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.middleInitial ? user.middleInitial + ' ' : ''}${user.lastName || ''}`;
    const userIdString = user.userId ? user.userId.toString() : '';
    const email = user.email || '';
    const userName = user.UserName || '';

    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userIdString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="user-account">
      <Navbar bg="dark" variant="dark" className="navbar-custom-user-account mb-4">
        <Container>
          <Button variant="secondary" onClick={() => navigate('/admin-dashboard')} className="back-button-user-account">
            Back to Dashboard
          </Button>
          <Navbar.Brand className="custom-acc-style-user-account">User Accounts</Navbar.Brand>
        </Container>
      </Navbar>
      
      <Container className="mt-5 mb-5 user-account-container">
        <Row className="align-items-center">
          <Col xs={12} md={8}>
            <h4 className="mb-5 user-account-header">Customer Accounts ({customerCount})</h4>
          </Col>
          <Col xs={12} md={4}>
            <Form className="mb-3">
              <Form.Group className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Search by name, ID, email, or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-100 search-bar-user-account"
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        
        {searchTerm && (
          <div>
            <h5 className="mb-3 results-header-user-account">Results</h5>
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredUsers.map(user => (
                <Col key={user.userId}>
                  <Card className="h-100 user-card-user-account" style={{ fontFamily: 'Lato' }}>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="custom-title-user-account">{`Name: ${user.firstName || ''} ${user.middleInitial ? user.middleInitial + ' ' : ''}${user.lastName || ''}`}</Card.Title>
                        <Card.Title className="custom-title-user-account">{`ID: ${user.userId || ''}`}</Card.Title>
                        <Card.Text className="custom-text-user-account">{`Email: ${user.email || ''}`}</Card.Text>
                        <Card.Text className="custom-text-user-account">{`Username: ${user.UserName || ''}`}</Card.Text>
                      </div>
                      <Button variant="success" onClick={() => handleViewDetails(user)} className="view-details-button-user-account">View Details</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <hr className="my-4 results-divider-user-account" style={{ margin: '10px 0px 180px 0px' }} />
          </div>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {users.map(user => (
            <Col key={user.userId}>
              <Card className="user-card-user-account h-100" style={{ fontFamily: 'Montserrat' }}>
                <div className="card-header-user-account">
                  <Card.Title className="user-card-title-user-account">{`${user.firstName} ${user.middleInitial ? user.middleInitial + ' ' : ''}${user.lastName}`}</Card.Title>
                  <Card.Subtitle className="user-card-subtitle-user-account mb-2 text-muted">{`${user.UserType} | ${user.userId}`}</Card.Subtitle>
                </div>
                <Card.Body className="d-flex flex-column align-items-center justify-content-between" style={{ padding: '10px' }}>
                  <div className="card-text-container-user-account" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                    {/* Your limited text content here */}
                  </div>
                  <Button variant="success" onClick={() => handleViewDetails(user)} className="view-details-button-user-account">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Details in Green Background */}
        {showUserDetails && selectedUserDetails && (
          <div className="user-details-green-user-account">
            <Button variant="light" className="close-button-user-account" onClick={handleCloseDetails}>Close</Button>
            <h5 style={{ fontSize: '24px', fontWeight: 'bold' }}>User Details</h5>
            <p>{`Name: ${selectedUserDetails.firstName} ${selectedUserDetails.middleInitial ? selectedUserDetails.middleInitial + ' ' : ''}${selectedUserDetails.lastName}`}</p>
            <p>{`ID: ${selectedUserDetails.userId}`}</p>
            <p>{`Email: ${selectedUserDetails.email}`}</p>
            <p>{`Username: ${selectedUserDetails.UserName}`}</p>
          </div>
        )}
      </Container>
    </div>
  );
}

export default UserAccount;
