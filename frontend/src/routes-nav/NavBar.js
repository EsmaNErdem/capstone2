import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import { Menu, MenuItem, Avatar } from '@mui/material';
import "./NavBar.css";

/** Navbar bar for site. Shows up on every page.
 *
 * When the user is logged in, it shows links to the main areas of the site.
 * When not, it shows links to Login and Signup forms.
 *
 * Rendered by App.
 */
const NavBar = ({ logOut }) => {
  const { currentUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          <NavLink className="nav-link" to="/chats">
            Chats
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <Avatar
            alt={currentUser.username}
            src={currentUser.img}
            className="avatar"
            onClick={handleMenuOpen}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <NavLink to={`/profile/${currentUser.username}`} className="dropdown-link">
                Profile
              </NavLink>
            </MenuItem>
            <MenuItem onClick={() => { logOut(); handleMenuClose(); }}>
              Log out {currentUser.first_name || currentUser.username}
            </MenuItem>
          </Menu>
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
        <span className="brand-text">Book Chat</span>
      </Link>
      {currentUser ? loggedInNav() : loggedOutNav()}
    </nav>
  );
};

export default NavBar;
