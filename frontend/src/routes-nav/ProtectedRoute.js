// Routes.js
import React, { useContext } from "react";
import { Route, Redirect} from "react-router-dom";
import UserContext from "../auth/UserContext";

/**
 * PrivateRoute Component
 * Routes private routes
 * 
 * Checks if there is logged in user and show protected routes
 * if no user logged in, redirect them to the login form. 
 * 
 */

const ProtectedRoute = ({ exact, path, children }) => {
  const { currentUser } = useContext(UserContext);

  if(!currentUser) {
    return <Redirect to="/login" />
  }
  return (
    <Route exact={exact} path={path}>
        {children}
    </Route>
  );
};

export default ProtectedRoute;
