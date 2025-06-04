import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  // Only redirect if there's no token in localStorage
  if (!localStorage.getItem('token')) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && user) {
    // Check if user has required roles
    const hasRequiredRole = requiredRoles.some(requiredRole => {
      // Check both formats: with and without ROLE_ prefix
      const cleanRequiredRole = requiredRole.replace('ROLE_', '');
      return user.roles.some(userRole => {
        const cleanUserRole = userRole.replace('ROLE_', '');
        return cleanUserRole === cleanRequiredRole || userRole === requiredRole;
      });
    });

    if (!hasRequiredRole) {
      // Redirect to dashboard if user doesn't have required role
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 