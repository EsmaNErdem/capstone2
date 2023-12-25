import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../auth/UserContext";

/**
 * ProtectedRoute Component
 * Routes private routes
 * 
 * Checks if there is a logged-in user and shows protected routes.
 * If no user is logged in, redirect them to the login form. 
 * 
 */
const ProtectedRoute = () => {
  const { currentUser } = useContext(UserContext);

  return (
    currentUser ? <Outlet/> : <Navigate to='/login'/>
  );
};

export default ProtectedRoute;
