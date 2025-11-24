import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, LayoutDashboard, User } from 'lucide-react';

const BottomNav = ({ userRole }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    ...(userRole === 'provider' ? [{ path: '/create-service', icon: Plus, label: 'Create' }] : []),
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--md-sys-color-surface)',
      borderTop: '1px solid var(--md-sys-color-outline-variant)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    }}>
      {navItems.map(({ path, icon: Icon, label }) => (
        <Link
          key={path}
          to={path}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive(path) ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
            flex: 1,
            padding: '8px',
            transition: 'color 0.2s ease',
          }}
        >
          <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
          <span className="label-small" style={{ 
            marginTop: '4px',
            fontWeight: isActive(path) ? 600 : 400 
          }}>
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
