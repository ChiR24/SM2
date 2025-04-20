import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// NavbarProps interface with onLogout function to properly handle logout
// This ensures that the authentication state is updated in the parent component
interface NavbarProps {
  isAuthenticated: boolean;
  username?: string;
  onLogout: () => void; // Function to handle logout in the parent component
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, username, onLogout }) => {
  const navigate = useNavigate();

  // Handle logout by calling the onLogout function from props
  // This ensures that the authentication state is properly updated
  // in the parent component before redirecting
  const handleLogout = () => {
    // Call the onLogout function from props to update auth state
    onLogout();

    // Redirect to home page after logout
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">SM2 Flashcards</Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/flashcards">My Flashcards</Link>
            </li>
            <li>
              <Link to="/review">Review</Link>
            </li>
            <li className="navbar-user">
              <span>Welcome, {username}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
