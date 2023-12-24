import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import { Typography, Button, Container } from '@mui/material';
import "./Home.css"

/**
 * Homepage Component
 * Displays a welcome message with login and signup buttons
 * Routed at /
 * 
 * Routes ==> Home
 */

const Home = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <Container className="homeContainer">
      <Typography variant="h3" className="headline">
        Book Talk: Your Social Platform for Book Enthusiasts
      </Typography>
      <Typography variant="body1" className="description">
        Welcome to Book Talk, where book lovers unite to share their passion for reading.
      </Typography>
      {currentUser ? (
        <Typography variant="h4" className="welcomeMessage">
          Welcome, {currentUser.username}!
        </Typography>
      ) : (
        <div className="authButtons">
          <Button component={Link} to="/login" variant="contained" color="primary">
            Login
          </Button>
          <Button component={Link} to="/signup" variant="contained" color="secondary">
            Sign Up
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;