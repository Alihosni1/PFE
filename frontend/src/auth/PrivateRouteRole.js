import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteRole = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload.role;

  if (role === 'admin') {
    return children;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRouteRole;