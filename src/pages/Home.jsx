import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, Star, ArrowRight, TrendingUp, Award, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RatingStars from '../components/RatingStars';
import { supabase } from '../lib/supabaseClient';

const Home = () => {
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'Cleaning', icon: '🧹', color: '#FFF4E6', gradient: 'linear-gradient(135deg, #FFE8CC 0%, #FFD4A3 100%)' },
        { name: 'Plumbing', icon: '🔧', color: '#E8F5FF', gradient: 'linear-gradient(135deg, #D4EBFF 0%, #A3D5FF 100%)' },
        { name: 'Electrical', icon: '⚡', color: '#FFF9E6', gradient: 'linear-gradient(135deg, #FFF4CC 0%, #FFE699 100%)' },
        { name: 'Moving', icon: '📦', color: '#FFE8E8', gradient: 'linear-gradient(135deg, #FFD4D4 0%, #FFBABA 100%)' },
        { name: 'Tutoring', icon: '📚', color: '#F0E8FF', gradient: 'linear-gradient(135deg, #E6D4FF 0%, #D1B3FF 100%)' },
        { name: 'Beauty', icon: '💅', color: '#FFE8F5', gradient: 'linear-gradient(135deg, #FFD4EC 0%, #FFB8DD 100%)' },
        { name: 'Photography', icon: '📸', color: '#E8FFF0', gradient: 'linear-gradient(135deg, #D4FFE1 0%, #B3FFC8 100%)' },
        { name: 'Tailoring', icon: '👗', color: '#FFF0E8', gradient: 'linear-gradient(135deg, #FFE3D4 0%, #FFCCB3 100%)' },
        { name: 'Computer Repair', icon: '💻', color: '#E8F8FF', gradient: 'linear-gradient(135deg, #D4F0FF 0%, #A3DDFF 100%)' },
    ];

    useEffect(() => {
        fetchFeaturedServices();
    }, []);

    const fetchFeaturedServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*, provider:profiles!provider_id(full_name, avatar_url)')
                .order('created_at', { ascending: false })
                .limit(6);

            if (error) throw error;
            setFeaturedServices(data || []);
        } catch (error) {
            console.error('Error fetching featured services:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section with Warm Gradient */}
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    background: 'var(--gradient-hero)',
                    padding: '3rem 1rem 4rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative Pattern Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.08,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            background: 'rgba(255, 255, 255, 0.25)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            marginBottom: '1.5rem',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            <Sparkles size={16} color="#FFF" />
                            <span style={{ color: '#FFF', fontSize: '0.875rem', fontWeight: 600 }}>Blinkit in 11 minutes</span>
                        </div>
                        
                        <h1 style={{ 
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800, 
                            marginBottom: '1rem', 
                            color: '#FFFFFF',
                            lineHeight: 1.2,
                            textShadow: '0 2px 20px rgba(0,0,0,0.2)'
                        }}>
                            Your Local Skills,<br />
                            At Your Doorstep
                        </h1>
                        
                        <p style={{ 
                            color: 'rgba(255, 255, 255, 0.95)', 
                            maxWidth: '600px', 
                            margin: '0 auto 2rem',
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                        }}>
                            India's last minute app for services 🇮🇳
                        </p>
                        
                        {/* Search Bar */}
                        <Link to="/search" style={{ textDecoration: 'none' }}>
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    maxWidth: '550px',
                                    margin: '0 auto',
                                    background: '#FFFFFF',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Search size={24} color="#D63864" />
                                <span style={{ 
                                    flex: 1, 
                                    textAlign: 'left', 
                                    color: '#8B6B5C',
                                    fontSize: '1rem'
                                }}>
                                    Search for services...
                                </span>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* Categories Section */}
            <section className="container" style={{ padding: '2rem 1rem' }}>
                <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    marginBottom: '1.5rem',
                    color: 'var(--color-text-main)'
                }}>
                    Browse by Category
                </h2>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '1rem',
                    marginBottom: '3rem'
                }}>
                    {categories.map((category, index) => (
                        <Link key={category.name} to={`/search?category=${category.name}`} style={{ textDecoration: 'none' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="hover-lift"
                                style={{
                                    background: category.gradient,
                                    padding: '1.5rem 0.75rem',
                                    borderRadius: 'var(--radius-lg)',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{category.icon}</div>
                                <span style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600,
                                    color: 'var(--color-text-main)'
                                }}>
                                    {category.name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Services */}
            <section className="container" style={{ padding: '0 1rem 3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        Featured Services
                    </h2>
                    <Link to="/search">
                        <Button variant="text" size="sm">
                            View All <ArrowRight size={16} style={{ marginLeft: '0.25rem' }} />
                        </Button>
                    </Link>
                </div>
                
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton" style={{ height: '300px' }} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {featuredServices.map((service, index) => (
                            <Link key={service.id} to={`/service/${service.id}`} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    whileHover={{ y: -8 }}
                                    className="hover-lift ripple"
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        border: '1px solid var(--md-sys-color-outline-variant)',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{
                                        height: '180px',
                                        background: service.image_url 
                                            ? `url(${service.image_url}) center/cover` 
                                            : 'linear-gradient(135deg, #FFE8CC 0%, #FFD4A3 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '4rem'
                                    }}>
                                        {!service.image_url && '🛠️'}
                                    </div>
                                    <div style={{ padding: '1.25rem' }}>
                                        <h3 style={{ 
                                            fontSize: '1.125rem', 
                                            fontWeight: 700, 
                                            marginBottom: '0.5rem',
                                            color: 'var(--color-text-main)'
                                        }}>
                                            {service.title}
                                        </h3>
                                        <p style={{ 
                                            fontSize: '0.875rem', 
                                            color: 'var(--color-text-muted)',
                                            marginBottom: '0.75rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {service.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ 
                                                fontSize: '1.5rem', 
                                                fontWeight: 700, 
                                                color: 'var(--md-sys-color-primary)'
                                            }}>
                                                ₹{service.price}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Star size={16} fill="#FFB800" color="#FFB800" />
                                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Trust Section */}
            <section style={{
                background: 'linear-gradient(135deg, rgba(232, 69, 69, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)',
                padding: '3rem 1rem',
                marginTop: '2rem'
            }}>
                <div className="container">
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        textAlign: 'center'
                    }}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Shield size={48} color="#D63864" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verified Professionals</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>All providers are background-checked</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Clock size={48} color="#F97316" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Same-Day Service</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Book now, get service today</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Award size={48} color="#F7931E" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Satisfaction Guaranteed</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Not happy? We'll make it right</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
