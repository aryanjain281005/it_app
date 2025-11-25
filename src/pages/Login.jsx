import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error } = await signIn(formData.email, formData.password);
            if (error) throw error;
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ 
            minHeight: 'calc(100vh - 5rem)', 
            padding: '2rem',
            background: 'linear-gradient(135deg, #FFF8F5 0%, #FFEEE6 100%)',
            position: 'relative'
        }}>
            {/* Decorative Pattern */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05 }}>
                <svg width="100%" height="100%">
                    <pattern id="login-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="2" fill="#E84545" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#login-pattern)" />
                </svg>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}
            >
                <Card className="glass" style={{ padding: '2.5rem', boxShadow: '0 20px 60px rgba(232, 69, 69, 0.15)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{ 
                                width: '60px', 
                                height: '60px', 
                                margin: '0 auto 1rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #E84545 0%, #FF6B35 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Sparkles size={28} color="white" />
                        </motion.div>
                        <h2 style={{ 
                            fontSize: '2rem', 
                            marginBottom: '0.5rem', 
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #E84545 0%, #FF6B35 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Welcome Back</h2>
                        <p style={{ color: '#666', fontSize: '0.95rem' }}>Log in to continue your journey</p>
                    </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Input
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            label="Password"
                            icon={Lock}
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            isLoading={loading}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            Log In
                        </Button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/signup" style={{ 
                        background: 'linear-gradient(135deg, #E84545 0%, #FF6B35 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 600,
                        textDecoration: 'none'
                    }}>Sign up</Link>
                </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
