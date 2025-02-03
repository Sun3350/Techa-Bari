import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedStaffRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Only allow access if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/you" />;
  }

  return children;
};

export default ProtectedStaffRoute;
