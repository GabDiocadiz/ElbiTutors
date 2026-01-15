import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import logoDarkMode from '../assets/logo_darkmode.png';
import userPlaceholder from '../assets/user_placeholder.png';

import '../styles/Components.css';
import '../styles/design.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname.startsWith('/admin')) {
      return true;
    }
    return location.pathname === path;
  };

  // Determine if the logged-in user has admin privileges
  const isUserAdmin = user?.role === 'admin' || user?.isLRCAdmin;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logoDarkMode} alt="ELBI Tutors Logo" className="logo-image" />
        </div>

        {/* 1. Only show navigation links if the user is NOT an admin */}
        {!isUserAdmin && (
          <div className="navbar-menu">
            <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-button active' : 'nav-button'}>Home</Link>
            <Link to="/study" className={isActive('/study') ? 'nav-button active' : 'nav-button'}>Study</Link>
            <Link to="/about" className={isActive('/about') ? 'nav-button active' : 'nav-button'}>About</Link>
          </div>
        )}

        {user && (
          <div
            className="navbar-user-wrapper"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {/* 2 & 3. If Admin: Render non-clickable DIV. If User: Render clickable LINK */}
            {isUserAdmin ? (
              <div className="navbar-user" style={{ cursor: 'default' }}>
                <span className="user-email">ADMIN</span>
                <div className="user-avatar">
                  <img
                    src={user?.picture || userPlaceholder}
                    alt="Admin Avatar"
                    className="avatar-image"
                  />
                </div>
              </div>
            ) : (
              <Link to="/profile" className="navbar-user">
                <span className="user-email">{user?.email}</span>
                <div className="user-avatar">
                  <img
                    src={user?.picture || userPlaceholder}
                    alt="User Avatar"
                    className="avatar-image"
                  />
                </div>
              </Link>
            )}

            {/* 4. Keep Logout Dropdown */}
            <div className={`navbar-dropdown ${open ? 'open' : ''}`}>
              {isUserAdmin && (
                <Link to="/admin/dashboard" className="dropdown-item">
                  🛠 Admin Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="dropdown-item logout"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}