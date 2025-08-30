import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import authContext from '../contexts/authContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(authContext);
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

