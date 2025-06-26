import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import './NavBar.css';
import userImg from '../assets/user.png';

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector(state => state.session.user);

  const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = () => setShowMenu(false);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  return (
    <nav className="navbar">
      <NavLink to={user ? '/dashboard' : '/'} className="navbar-logo">
        <img
          src="https://s3.amazonaws.com/itunes-images/app-assets/458023433/80793600/458023433-80793600-circularArtwork-300.jpg"
          alt="logo"
          className="navbar-logo-img"
        />
        <span>SplitO</span>
      </NavLink>

      {!user ? (
        <div className="navbar-right">
          <NavLink to="/login" className="nav-link">
            Log In
          </NavLink>
          <NavLink to="/sign-up">
            <button className="nav-button">Sign Up</button>
          </NavLink>
        </div>
      ) : (
        <div className="navbar-user">
          <button className="user-menu-button" onClick={toggleMenu}>
            <img src={userImg} alt="user" className="user-img" />
            <span>{user.firstName}</span>
            <i className="fa-solid fa-caret-down" />
          </button>
          {showMenu && (
            <ul className="dropdown-menu">
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li>Username: {user.username}</li>
              <li>Email: {user.email}</li>
              <li><LogoutButton /></li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
