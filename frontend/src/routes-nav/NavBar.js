import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./NavBar.css";

/** Navbar bar for site. Shows up on every page.
 *
 * When the user is logged in, it shows links to the main areas of the site.
 * When not, it shows links to Login and Signup forms.
 *
 * Rendered by App.
 */
const NavBar = ({ logout }) => {
  const { currentUser } = useContext(UserContext);
  console.debug("NavBar", "currentUser=", currentUser);

  function loggedInNav() {
    return (
      <ul className="navbar-nav ml-auto d-flex flex-row">
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
          <NavLink className="nav-link" to="/profile/:username">
            Profile
          </NavLink>
        </li>
        <li className="nav-item">
          <Link className="nav-link logout-link" to="/" onClick={logout}>
            Log out {currentUser.first_name || currentUser.username}
          </Link>
        </li>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="navbar-nav ml-auto d-flex flex-row">
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
        <span className="brand-text">Book Club</span>
      </Link>
      {currentUser ? loggedInNav() : loggedOutNav()}
    </nav>
  );
};

export default NavBar;
