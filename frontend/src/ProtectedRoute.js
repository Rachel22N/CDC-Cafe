import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = JSON.parse(sessionStorage.getItem('isAuthenticated'));
  const userRole = sessionStorage.getItem('role');

  return (
    isAuthenticated && rest.roles.includes(userRole) ? <Component {...rest} /> : <Navigate to="/loginpage" />
  );
};

export default ProtectedRoute;
