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

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logoDarkMode} alt="ELBI Tutors Logo" className="logo-image" />
        </div>

        <div className="navbar-menu">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-button active' : 'nav-button'}>Home</Link>
          <Link to="/study" className={isActive('/study') ? 'nav-button active' : 'nav-button'}>Study</Link>
          <Link to="/about" className={isActive('/about') ? 'nav-button active' : 'nav-button'}>About</Link>
        </div>

        {user && (
          <div
            className="navbar-user-wrapper"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {/* ✅ CLICKING THIS GOES TO /profile */}
            <Link
              to="/profile"
              className="navbar-user"
            >
              <span className="user-email">
                {isAdminPage ? 'ADMIN' : user?.email}
              </span>

              <div className="user-avatar">
                <img
                  src={user?.picture || userPlaceholder}
                  alt="User Avatar"
                  className="avatar-image"
                />
              </div>
            </Link>

            {/* Dropdown */}
            <div className={`navbar-dropdown ${open ? 'open' : ''}`}>
              {(user?.role === 'admin' || user?.isLRCAdmin) && (
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
