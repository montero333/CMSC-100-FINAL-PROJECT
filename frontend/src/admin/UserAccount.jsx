import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CSS/UserAccount.css';

const UserAccount = ({ onCustomerCountChange }) => {
  const [users, setUsers] = useState([]);
  const [customerCount, setCustomerCount] = useState(0); 
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        console.log('Fetched users:', response.data); // Debug log
        const customerUsers = response.data.filter(user => user.UserType === 'Customer'); // Filter users with UserType: Customer
        setUsers(customerUsers);
        setCustomerCount(customerUsers.length);
        console.log('Customer count:', customerUsers.length); // Debug log

        // Pass the customer count to the parent component
        onCustomerCountChange(customerUsers.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [onCustomerCountChange]);

  const handleCloseDetails = () => setShowDetails(false);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

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
    <>
      <Container className="mt-5 mb-5">
      <Button variant="secondary" onClick={() => navigate('/admin-dashboard')} className="back-button">
        Back to Dashboard
        </Button>
        
        <Row className="align-items-center">
          <Col xs={12} md={8}>
            <h4 className="mb-5">Customer Accounts ({customerCount})</h4>
          </Col>
          <Col xs={12} md={4}>
            {/* Search Bar with Search Icon */}
            <Form className="mb-3">
              <Form.Group className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Search by name, ID, email, or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-100"
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>

        {/* Display Results Text and Cards when there is a search term */}
        {searchTerm && (
          <div>
            <h5 className="mb-3">Results</h5>
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredUsers.map(user => (
                <Col key={user.userId}>
                  <Card className="h-100" style={{ fontFamily: 'Lato' }}>
                    <Card.Body>
                      <Card.Title>{`${user.firstName || ''} ${user.middleInitial ? user.middleInitial + ' ' : ''}${user.lastName || ''}`}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{`ID: ${user.userId || ''}`}</Card.Subtitle>
                      <Card.Text>{`Email: ${user.email || ''}`}</Card.Text>
                      <Card.Text>{`Username: ${user.UserName || ''}`}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <Button variant="success" onClick={() => handleViewDetails(user)} style={{ backgroundColor: '#4CAF50' }}>View Details</Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
            <hr className="my-4" style={{ margin: '10px 0px 180px 0px' }} />
          </div>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {users.map(user => (
            <Col key={user.userId}>
             <Card className="user-card h-100" style={{ fontFamily: 'Montserrat' }}>
              <Card.Body>
                <Card.Title className="user-card-title">{`${user.firstName} ${user.middleInitial ? user.middleInitial + ' ' : ''}${user.lastName}`}</Card.Title>
                <Card.Subtitle className="user-card-subtitle mb-2 text-muted">{`${user.UserType} | ${user.userId}`}</Card.Subtitle>
                {/* <Card.Text className="user-card-text">{`Email: ${user.email}`}</Card.Text>
                <Card.Text className="user-card-text">{`Username: ${user.UserName}`}</Card.Text> */}
              </Card.Body>
              <Card.Footer className="user-card-footer">
                <Button variant="success" onClick={() => handleViewDetails(user)} style={{ backgroundColor: '#4CAF50' }}>View Details</Button>
              </Card.Footer>
            </Card>
            </Col>
          ))}
        </Row>

        {/* Details Modal */}
        <Modal
          show={showDetails}
          onHide={handleCloseDetails}
          dialogClassName="user-modal"
          aria-labelledby="user-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="user-modal-title" className="user-modal-title">
              User Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <p>{`Name: ${selectedUser.firstName} ${selectedUser.middleInitial ? selectedUser.middleInitial + ' ' : ''}${selectedUser.lastName}`}</p>
                <p>{`ID: ${selectedUser.userId}`}</p>
                <p>{`Email: ${selectedUser.email}`}</p>
                <p>{`Username: ${selectedUser.UserName}`}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="user-modal-footer">
            <Button variant="secondary" onClick={handleCloseDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default UserAccount;

