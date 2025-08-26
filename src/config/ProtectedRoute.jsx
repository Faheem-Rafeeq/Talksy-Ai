// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

// Simple protected route that checks auth directly
const ProtectedRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;