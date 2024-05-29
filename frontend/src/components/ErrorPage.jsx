// src/components/ErrorPage.jsx
import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const ErrorPage = () => {
  return (
    <Container className="mt-5" style={{ width: '500px', backgroundColor: '#f8f9fa', padding: '40px', borderRadius: '8px' }}>
      <Alert variant="danger">
        <h4 className="alert-heading">Access Denied</h4>
        <p>You do not have permission to access this page.</p>
      </Alert>
    </Container>
  );
};

export default ErrorPage;
