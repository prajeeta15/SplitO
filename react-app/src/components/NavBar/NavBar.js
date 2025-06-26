import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; 


const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo">
          <span>Smartsplit</span>
        </NavLink>
      </div>
      <div className="navbar-right">
        <NavLink to="/login" className="nav-link">Log In</NavLink>
        <NavLink to="/sign-up" className="nav-link">Sign Up</NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
