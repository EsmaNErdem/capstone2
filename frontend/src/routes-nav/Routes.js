// Routes.js
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../homepage/Home";
import LoginForm from "../auth/LoginForm";
import SignUpFormForm from "../auth/SignUpForm";
import ProfileForm from "../profile/ProfileForm";

/** App routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <ProtectedRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */
const Routes = ({ login, signup }) => {
  return (
    <Switch>

      <Route exact path="/">
        <Home />
      </Route>
      
      <ProtectedRoute exact path="/profile">
        <ProfileForm />
      </ProtectedRoute>
      
      <Route exact path="/login">
        <LoginForm login={login} />
      </Route>

      <Route exact path="/signup">
        <SignUpFormForm signup={signup} />
      </Route>
      
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
