import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import './NavBar.css';
import userImg from '../assets/user.png';
import { Modal } from '../context/Modal';
import CreateExpense from './CreateExpenseModal/CreateExpense'; // adjust if your path differs

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showSplitExpense, setShowSplitExpense] = useState(false);

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

      <div className="navbar-buttons">
        <button onClick={() => setShowCreateExpense(true)} className="nav-button">
          Create Expense
        </button>
        <button onClick={() => setShowSplitExpense(true)} className="nav-button">
          Split Expense
        </button>
      </div>

      {/* Expense Modal */}
      {showCreateExpense && (
        <Modal onClose={() => setShowCreateExpense(false)}>
          <CreateExpense
            setShowModal={setShowCreateExpense}
            expense={null}
            setHasSubmitted={() => {}}
          />
        </Modal>
      )}

      {/* For now, we use the same modal as a placeholder for Split */}
      {showSplitExpense && (
        <Modal onClose={() => setShowSplitExpense(false)}>
          <CreateExpense
            setShowModal={setShowSplitExpense}
            expense={null}
            setHasSubmitted={() => {}}
          />
        </Modal>
      )}

      {!user ? (
        <div className="navbar-right">
          <NavLink to="/login" className="nav-link">Log In</NavLink>
          <NavLink to="/sign-up">
            <button className="nav-button">Sign Up</button>
          </NavLink>
        </div>
      ) : (
        <div className="navbar-user">
          <button className="user-menu-button" onClick={toggleMenu}>
            <img src={userImg} alt="user" className="user-img" />
            <span>{user.firstName || 'User'}</span>
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
