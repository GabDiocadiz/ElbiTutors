import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/design.css';
import logoDarkMode from '../assets/logo_darkmode.png';
import userPlaceholder from '../assets/user_placeholder.png';

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
            to="/booking" 
            className={isActive('/booking') ? 'nav-button active' : 'nav-button'}
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
      </div>
    </nav>
  );
}
