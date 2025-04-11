import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  // Redirect to home if user is not an admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;