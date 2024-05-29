// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext.jsx'; // Adjust path as needed

const ProtectedRoute = ({ children }) => {
  const { UserType } = useUser();

  if (UserType === 'Admin') {
    return <Navigate to="/error" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
