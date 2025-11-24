import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Search, Home, PlusSquare, LayoutDashboard, Sparkles } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Search', path: '/search', icon: Search },
        ...(user ? [
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ...(user.user_metadata?.role === 'provider' ? [{ name: 'List Service', path: '/create-service', icon: PlusSquare }] : [])
        ] : [])
    ];

    return (
        <nav style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            color: 'var(--md-sys-color-on-surface)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: 'var(--md-sys-elevation-2)',
            height: '64px', // Material 3 Top App Bar height
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {/* Leading: Logo/Menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        className="desktop-only"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ 
                            padding: '8px', 
                            borderRadius: 'var(--md-sys-shape-corner-full)', 
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'none',
                            color: 'var(--md-sys-color-on-surface)'
                        }}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link to="/" style={{ 
                        fontSize: '20px', 
                        fontWeight: 600, 
                        fontFamily: 'Roboto, sans-serif', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        textDecoration: 'none'
                    }}>
                        <Sparkles size={24} color="var(--md-sys-color-primary)" fill="var(--md-sys-color-primary)" />
                        <span className="gradient-text" style={{ fontWeight: 700 }}>LocalSkillHub</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex" style={{ alignItems: 'center', gap: '8px' }}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path}>
                            <Button variant="text" size="sm" style={{ fontWeight: 500 }}>
                                {link.name}
                            </Button>
                        </Link>
                    ))}
                </div>

                {/* Trailing: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--md-sys-color-primary-container)',
                                    color: 'var(--md-sys-color-on-primary-container)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 500
                                }}>
                                    {user.email[0].toUpperCase()}
                                </div>
                                <Button variant="text" size="sm" onClick={handleSignOut} style={{ minWidth: 'auto', padding: '0 12px' }}>
                                    <LogOut size={20} />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to="/login">
                                <Button variant="text">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="filled">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu (Drawer-like) */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '64px',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--md-sys-color-surface)',
                    borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                    padding: '8px 16px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxShadow: 'var(--md-sys-elevation-3)',
                    zIndex: 49
                }}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                color: 'var(--md-sys-color-on-surface-variant)',
                                backgroundColor: window.location.pathname === link.path ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                                fontWeight: 500
                            }}>
                                <link.icon size={20} />
                                {link.name}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

