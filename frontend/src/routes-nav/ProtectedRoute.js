// Routes.js
import React, { useContext } from "react";
import {Routes, Route, Navigate } from "react-router-dom";
import UserContext from "../auth/UserContext";

/**
 * PrivateRoute Component
 * Routes private routes
 * 
 * Checks if there is logged in user and show protected routes
 * if no user logged in, redirect them to the login form. 
 * 
 */
const ProtectedRoute = ({ element, path }) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return
  }

  return <Route element={element} path={path} />;
};

export default ProtectedRoute;