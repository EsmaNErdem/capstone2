import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";

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
        <div className="Home">
            <h1>A Wrinkle in Page: Online Book Club</h1>
            <p>Join this social platform to find people like you who liove readint to talk about books</p>
            {currentUser ?
                <h2>Welcome, {currentUser.username}!</h2> :
                (
                    <p>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link> 
                    </p>
                )
            }
        </div>
    )
}

export default Home;