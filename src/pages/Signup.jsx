import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, Mail, Lock, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Signup = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: 'user' // 'user' or 'provider'
    });

    // Test account autofill
    const fillTestUser = () => {
        setFormData({
            fullName: 'Test User',
            email: 'test@user.com',
            password: 'testuser123',
            phone: '9876543210',
            role: 'user'
        });
    };

    const fillTestProvider = () => {
        setFormData({
            fullName: 'Test Provider',
            email: 'test@provider.com',
            password: 'testprovider123',
            phone: '9876543211',
            role: 'provider'
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error } = await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                role: formData.role,
                phone: formData.phone
            });
            if (error) throw error;
            navigate('/dashboard'); // Redirect to dashboard after signup
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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05 }}>
                <svg width="100%" height="100%">
                    <pattern id="signup-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="2" fill="#D63864" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#signup-pattern)" />
                </svg>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '450px', position: 'relative', zIndex: 1 }}
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
                                background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
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
                            background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Create Account</h2>
                        <p style={{ color: '#666', fontSize: '0.95rem' }}>Join SkillScout today</p>
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

                <form onSubmit={handleSubmit} noValidate>
                    {/* Animated Role Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFormData({ ...formData, role: 'user' })}
                            style={{
                                padding: '1rem',
                                border: `2px solid ${formData.role === 'user' ? '#D63864' : 'transparent'}`,
                                borderRadius: 'var(--radius-lg)',
                                background: formData.role === 'user' 
                                    ? 'linear-gradient(135deg, rgba(232, 69, 69, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)'
                                    : 'rgba(255,255,255,0.5)',
                                color: formData.role === 'user' ? '#D63864' : '#999',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                boxShadow: formData.role === 'user' ? '0 4px 12px rgba(232, 69, 69, 0.2)' : 'none'
                            }}
                        >
                            <User size={24} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>I need a Service</span>
                        </motion.button>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFormData({ ...formData, role: 'provider' })}
                            style={{
                                padding: '1rem',
                                border: `2px solid ${formData.role === 'provider' ? '#D63864' : 'transparent'}`,
                                borderRadius: 'var(--radius-lg)',
                                background: formData.role === 'provider' 
                                    ? 'linear-gradient(135deg, rgba(232, 69, 69, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)'
                                    : 'rgba(255,255,255,0.5)',
                                color: formData.role === 'provider' ? '#D63864' : '#999',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                boxShadow: formData.role === 'provider' ? '0 4px 12px rgba(232, 69, 69, 0.2)' : 'none'
                            }}
                        >
                            <Briefcase size={24} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>I am a Provider</span>
                        </motion.button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Input
                            label="Full Name"
                            type="text"
                            name="fullName"
                            required
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                        />

                        <Input
                            label="Email Address"
                            icon={Mail}
                            type="text"
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

                        <Input
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            required
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        {/* Test Account Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={fillTestUser}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: '#3B82F6',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.2)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.1)'}
                            >
                                🧪 Test User
                            </button>
                            <button
                                type="button"
                                onClick={fillTestProvider}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: '#10B981',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.2)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.1)'}
                            >
                                🧪 Test Provider
                            </button>
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            Create Account
                        </Button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ 
                        background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 600,
                        textDecoration: 'none'
                    }}>Log in</Link>
                </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Signup;
