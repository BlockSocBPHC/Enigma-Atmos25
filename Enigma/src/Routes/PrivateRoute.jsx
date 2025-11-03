// src/routes/PrivateRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

const PrivateRoute = ({ children, role }) => {
  const { user, token } = useContext(AuthContext);
  
  // 1. Not logged in → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If role is specified and user role doesn't match → forbid
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // 3. Otherwise, render the protected page
  return children;
};

export default PrivateRoute;
