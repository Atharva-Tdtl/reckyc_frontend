import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null; // Or a spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If user doesn't have permission, redirect to their home base
    const homePaths = {
      'Customer': '/app/status',
      'Maker': '/ops/cases',
      'Checker': '/ops/cases',
      'Field Agent': '/ops/field',
      'Operations Manager': '/ops/cases',
      'CXO': '/cxo/dashboard',
      'Compliance Officer': '/cxo/dashboard'
    };
    return <Navigate to={homePaths[role] || '/'} replace />;
  }

  return children;
}
