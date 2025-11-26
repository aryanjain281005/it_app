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
            position: 'sticky',
            top: 0,
            zIndex: 50,
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {/* Leading: Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/" style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        color: 'var(--color-text-main)'
                    }}>
                        <div style={{
                            background: 'var(--md-sys-color-primary)',
                            padding: '8px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(232, 69, 69, 0.25)'
                        }}>
                            <Sparkles size={22} color="white" fill="white" />
                        </div>
                        <span style={{ 
                            background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>SkillScout</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex" style={{ alignItems: 'center', gap: '8px' }}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path}>
                            <Button variant="ghost" size="sm" style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>
                                {link.name}
                            </Button>
                        </Link>
                    ))}
                </div>

                {/* Trailing: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {user ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'var(--gradient-secondary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    boxShadow: 'var(--shadow-glow)'
                                }}>
                                    {user.email[0].toUpperCase()}
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleSignOut} style={{ minWidth: 'auto', padding: '8px', color: 'var(--color-text-muted)' }}>
                                    <LogOut size={20} />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to="/login">
                                <Button variant="ghost" style={{ color: 'var(--color-text-main)' }}>Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary" style={{ boxShadow: 'var(--shadow-glow)' }}>Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu (Drawer-like) */}
            {isMenuOpen && (
                <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '72px',
                    left: 0,
                    right: 0,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px 16px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 49
                }}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                color: 'var(--color-text-main)',
                                backgroundColor: window.location.pathname === link.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                                fontWeight: 500
                            }}>
                                <link.icon size={20} color="var(--color-info)" />
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

