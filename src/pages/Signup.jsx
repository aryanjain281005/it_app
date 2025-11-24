import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, Mail, Lock } from 'lucide-react';
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
        role: 'user' // 'user' or 'provider'
    });

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
                role: formData.role
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
        <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 5rem)', padding: '2rem' }}>
            <Card style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 700 }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join LocalSkillHub today</p>
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
                    {/* Role Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'user' })}
                            style={{
                                padding: '1rem',
                                border: `2px solid ${formData.role === 'user' ? 'var(--primary)' : 'transparent'}`,
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: formData.role === 'user' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.5)',
                                color: formData.role === 'user' ? 'var(--primary)' : 'var(--text-muted)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <User size={24} />
                            <span style={{ fontWeight: 600 }}>I need a Service</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'provider' })}
                            style={{
                                padding: '1rem',
                                border: `2px solid ${formData.role === 'provider' ? 'var(--primary)' : 'transparent'}`,
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: formData.role === 'provider' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.5)',
                                color: formData.role === 'provider' ? 'var(--primary)' : 'var(--text-muted)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <Briefcase size={24} />
                            <span style={{ fontWeight: 600 }}>I am a Provider</span>
                        </button>
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
                            Create Account
                        </Button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link>
                </p>
            </Card>
        </div>
    );
};

export default Signup;
