import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            DevConnect
          </Link>
          {user ? (
            <div className="navbar-menu">
              <Link to="/projects">Projects</Link>
              <Link to="/profile">Profile</Link>
              <span className="navbar-user">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

