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
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {/* Leading: Logo/Menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        className="desktop-only"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'none',
                            color: 'var(--color-text-main)'
                        }}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link to="/" style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        fontFamily: 'Outfit, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            background: 'var(--gradient-primary)',
                            padding: '6px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles size={20} color="white" fill="white" />
                        </div>
                        <span className="text-gradient" style={{ letterSpacing: '-0.02em' }}>SkillSync</span>
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

