import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import logoDarkMode from '../assets/logo_darkmode.png';
import userPlaceholder from '../assets/user_placeholder.png';

// Styling
import '../styles/Components.css';
import '../styles/design.css';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img
            src={logoDarkMode}
            alt="ELBI Tutors Logo"
            className="logo-image"
          />
        </div>

        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'nav-button active' : 'nav-button'}
          >
            Home
          </Link>
          <Link 
            to="/study" 
            className={isActive('/study') ? 'nav-button active' : 'nav-button'}
          >
            Study
          </Link>
          <Link 
            to="/about" 
            className={isActive('/about') ? 'nav-button active' : 'nav-button'}
          >
            About
          </Link>
        </div>

        {user && (
          <Link
            to={user?.role === 'tutor' ? '/tutor-profile' : '/profile'}
            className="navbar-user"
          >
            <span className="user-email">{user?.email || 'user@up.edu.ph'}</span>
            <div className="user-avatar">
              <img
                src={user?.picture || userPlaceholder}
                alt="User Avatar"
                className="avatar-image"
              />
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
