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
const Home = ({ login }) => {
  const { currentUser } = useContext(UserContext);

  const LoginTestUser = async () => {
    await login({ username: 'TestUser', password: '123456789'})
  }

  return (
    <div className="Home">
      <div className="Home-Card">
        <div className="Home-Cover">
          <img src="https://media.istockphoto.com/id/453166187/photo/dirty-old-green-book-cover.jpg?s=612x612&w=0&k=20&c=CwPKZXsGQNHUhoH_-tL7yFZT87rW4iDkCJsoIGCZPMI=" alt="home-cover" />
          <img src="https://img.freepik.com/premium-photo/dark-purple-old-velvet-fabric-texture-used-as-background-empty-purple-fabric-background-soft-smooth-textile-material-there-is-space-textx9_661047-2260.jpg"  alt="home=cover-backside"/>
          
          <Typography variant="h3" className="book-headline">
            BOOK CHAT
          </Typography>
        </div>
        <div className="Home-Content">
          <Typography variant="h3" className="headline">
            Book CHAT
          </Typography>
          <Typography variant="body1" className="description">
            Welcome to Book Chat, where book lovers unite to share their passion for reading.
          </Typography>
          <Typography variant="body1" className="description">
            Book Talk is not just an app; it's your gateway to a vibrant community of book lovers. Immerse yourself in the world of literature, connect with like-minded readers, and elevate your reading experience.
            Write your opions and take aways on your favorites books and read others books reviews to open your understanding
          </Typography>
          <Typography variant="body1" className="description">
            Ground Rules: Be Kind
          </Typography>
        </div>
      </div>
      <Container className="homeContainer">
        {currentUser ? (
          <>
            <Typography variant="h4" className="welcomeMessage">
              Welcome, {currentUser.username}!
            </Typography>
            <Button component={Link} to="/books" href="#text-buttons" className="browse-button">
              Browse Books
            </Button>
          </>
        ) : (
          <div className="authButtons">
            <Typography variant="h4" className="welcomeMessage">
              Sign Up to look around book and write reviews
            </Typography>
           <div>
            <Button component={Link} to="/login"  href="#text-buttons"
            className="buttons">
                Login
            </Button>
            <Button component={Link} to="/signup" href="#text-buttons" className="buttons">
                Sign Up
              </Button>
            <Button onClick={LoginTestUser} className="buttons">
                Login As a TestUser
              </Button>
           </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;