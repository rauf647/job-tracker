import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LayoutDashboard, User, LogOut, Plus, Menu, X } from 'lucide-react';

const Navbar = ({ onAddJob }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          <Briefcase size={28} className="brand-icon" />
          <span>JobTracker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/profile"
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <User size={18} />
            <span>Profile</span>
          </Link>
        </div>

        <div className="nav-actions">
          {onAddJob && (
            <button onClick={onAddJob} className="btn btn-primary btn-sm">
              <Plus size={18} />
              <span className="hide-mobile">Add Job</span>
            </button>
          )}
          <div className="nav-user">
            <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span>
            <div className="user-avatar" title={user?.name}>
              {user?.name?.charAt(0)}
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Logout" style={{ color: 'var(--text-muted)' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <Link
            to="/dashboard"
            className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/profile"
            className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          {onAddJob && (
            <button
              onClick={() => { onAddJob(); setMobileMenuOpen(false); }}
              className="btn btn-primary btn-block"
            >
              <Plus size={20} />
              <span>Add New Job</span>
            </button>
          )}
          <button onClick={handleLogout} className="btn btn-danger btn-block">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
