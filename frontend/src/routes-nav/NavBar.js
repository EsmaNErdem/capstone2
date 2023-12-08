import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./NavBar.css";

/** Navbar bar for site. Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. When not,
 * shows link to Login and Signup forms.
 *
 * Rendered by App.
 */

const NavBar = ({ logout }) => {
  const { currentUser } = useContext(UserContext);
  console.debug("NavBar", "currentUser=", currentUser);

  function loggedInNav() {
    return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/reviews">
                Reviews
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/books">
              Books
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/explore">
              Explore
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/profile">
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={logout}>
              Log out {currentUser.first_name || currentUser.username}
            </Link>
          </li>
        </ul>
    );
  }

  function loggedOutNav() {
    return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/signup">
              Sign Up
            </NavLink>
          </li>
        </ul>
    );
  }

  return (
      <nav className="Navbar navbar navbar-expand-md">
        <Link className="navbar-brand" to="/">
          Book Club
        </Link>
        {currentUser ? loggedInNav() : loggedOutNav()}
      </nav>
  );
}

export default NavBar;
