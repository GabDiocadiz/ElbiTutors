import logoLightMode from '../assets/logo_lightmode.png';
// Styling
import '../styles/Components.css';

export default function SimpleNavBar() {
  return (
    <nav className="simple-navbar">
      <div className="simple-navbar-container">
        <div className="simple-navbar-logo">
          <img
            src={logoLightMode}
            alt="ELBI Tutors Logo"
            className="simple-logo-image"
          />
        </div>
      </div>
    </nav>
  );
}
