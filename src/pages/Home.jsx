import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, Star, ArrowRight, TrendingUp, Award, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RatingStars from '../components/RatingStars';
import { supabase } from '../lib/supabaseClient';

const Home = () => {
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'Cleaning', icon: '🧹', color: '#EADDFF', gradient: 'linear-gradient(135deg, #EADDFF 0%, #D0BCFF 100%)' },
        { name: 'Plumbing', icon: '🔧', color: '#D0BCFF', gradient: 'linear-gradient(135deg, #D0BCFF 0%, #B69DF8 100%)' },
        { name: 'Electrical', icon: '⚡', color: '#E8DEF8', gradient: 'linear-gradient(135deg, #E8DEF8 0%, #D0BCFF 100%)' },
        { name: 'Moving', icon: '📦', color: '#F2B8B5', gradient: 'linear-gradient(135deg, #F2B8B5 0%, #F9DEDC 100%)' },
        { name: 'Tutoring', icon: '📚', color: '#F9DEDC', gradient: 'linear-gradient(135deg, #F9DEDC 0%, #FFD8E4 100%)' },
        { name: 'Beauty', icon: '💅', color: '#FFD8E4', gradient: 'linear-gradient(135deg, #FFD8E4 0%, #FFC2D1 100%)' },
        { name: 'Photography', icon: '📸', color: '#D0E7FF', gradient: 'linear-gradient(135deg, #D0E7FF 0%, #B3D9FF 100%)' },
        { name: 'Tailoring', icon: '👗', color: '#FFE5B4', gradient: 'linear-gradient(135deg, #FFE5B4 0%, #FFD6A5 100%)' },
        { name: 'Computer Repair', icon: '💻', color: '#C7F9CC', gradient: 'linear-gradient(135deg, #C7F9CC 0%, #B3F5BC 100%)' },
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
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--md-sys-color-primary-container) 0%, var(--md-sys-color-secondary-container) 100%)',
                padding: '3rem 1rem',
                textAlign: 'center',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle, var(--md-sys-color-primary) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }} />
                
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="badge badge-info" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={14} />
                        <span>Trusted by 10,000+ Users</span>
                    </div>
                    
                    <h1 className="display-small" style={{ 
                        fontWeight: 700, 
                        marginBottom: '1rem', 
                        color: 'var(--md-sys-color-on-surface)',
                        lineHeight: 1.2
                    }}>
                        Your Local Skills,<br />
                        <span className="gradient-text">At Your Doorstep</span>
                    </h1>
                    
                    <p className="body-large" style={{ 
                        color: 'var(--md-sys-color-on-surface-variant)', 
                        maxWidth: '600px', 
                        margin: '0 auto 2rem' 
                    }}>
                        Connect with verified professionals for cleaning, repairs, tutoring, and more. Book in seconds, pay securely.
                    </p>
                    
                    <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/search">
                            <Button variant="filled" size="lg" style={{ 
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                boxShadow: 'var(--md-sys-elevation-3)'
                            }}>
                                <Search size={20} style={{ marginRight: '0.5rem' }} />
                                Find Services
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="outlined" size="lg" style={{ 
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                backgroundColor: 'white'
                            }}>
                                Become a Provider
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="headline-small" style={{ fontWeight: 600 }}>Popular Categories</h2>
                    <Link to="/search">
                        <Button variant="text" size="sm" style={{ display: 'flex', alignItems: 'center' }}>
                            View All <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                        </Button>
                    </Link>
                </div>

                {/* Mobile: Horizontal scroll */}
                <div className="mobile-only" style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    overflowX: 'auto', 
                    paddingBottom: '1rem',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    {categories.map((cat, index) => (
                        <Link key={cat.name} to={`/search?category=${cat.name}`} style={{ 
                            textDecoration: 'none',
                            scrollSnapAlign: 'start',
                            flex: '0 0 120px'
                        }}>
                            <Card
                                className="card-hover"
                                style={{
                                    background: cat.gradient,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '120px',
                                    textAlign: 'center',
                                    color: 'var(--md-sys-color-on-surface)',
                                    border: 'none',
                                    animation: `slideUp 0.4s ease-out ${index * 0.1}s forwards`,
                                    opacity: 0
                                }}
                            >
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{cat.icon}</span>
                                <span className="label-medium" style={{ fontWeight: 600 }}>{cat.name}</span>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Desktop: Grid */}
                <div className="desktop-only" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {categories.map((cat, index) => (
                        <Link key={cat.name} to={`/search?category=${cat.name}`} style={{ textDecoration: 'none' }}>
                            <Card
                                className="card-hover"
                                style={{
                                    background: cat.gradient,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '140px',
                                    textAlign: 'center',
                                    color: 'var(--md-sys-color-on-surface)',
                                    border: 'none',
                                    animation: `slideUp 0.4s ease-out ${index * 0.1}s forwards`,
                                    opacity: 0
                                }}
                            >
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{cat.icon}</span>
                                <span className="label-large" style={{ fontWeight: 600 }}>{cat.name}</span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Services */}
            {featuredServices.length > 0 && (
                <section className="container" style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="headline-small" style={{ fontWeight: 600 }}>Featured Services</h2>
                        <Link to="/search">
                            <Button variant="text" size="sm" style={{ display: 'flex', alignItems: 'center' }}>
                                View All <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                            </Button>
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: '280px' }} />
                            ))
                        ) : (
                            featuredServices.map((service) => (
                                <Link key={service.id} to={`/service/${service.id}`} style={{ textDecoration: 'none' }}>
                                    <Card className="card-hover" variant="outlined" style={{ padding: 0, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '150px',
                                            background: 'linear-gradient(135deg, var(--md-sys-color-tertiary-container) 0%, var(--md-sys-color-primary-container) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '3rem'
                                        }}>
                                            {categories.find(c => c.name === service.category)?.icon || '⚡'}
                                        </div>
                                        <div style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                <h3 className="title-medium" style={{ flex: 1 }}>{service.title}</h3>
                                                <span className="badge badge-info">{service.category}</span>
                                            </div>
                                            <p className="body-small" style={{ 
                                                color: 'var(--md-sys-color-on-surface-variant)', 
                                                marginBottom: '0.75rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {service.description}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div className="title-medium" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>
                                                    ₹{service.price}
                                                </div>
                                                <RatingStars rating={4.5} count={12} size={14} showCount={false} />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="container" style={{ marginBottom: '4rem' }}>
                <h2 className="headline-small" style={{ fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Why LocalSkillHub?</h2>
                <p className="body-medium" style={{ 
                    textAlign: 'center', 
                    color: 'var(--md-sys-color-on-surface-variant)', 
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    margin: '0 auto 2rem'
                }}>
                    India's fastest-growing platform connecting skilled workers with customers
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <Card className="card-hover" variant="outlined" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            background: 'linear-gradient(135deg, #EADDFF 0%, #D0BCFF 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <Shield size={32} color="var(--md-sys-color-primary)" />
                        </div>
                        <h3 className="title-large" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>100% Verified</h3>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Every provider is verified with ID proof & background checks
                        </p>
                    </Card>
                    
                    <Card className="card-hover" variant="outlined" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            background: 'linear-gradient(135deg, #FFD8E4 0%, #FFC2D1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <Clock size={32} color="var(--md-sys-color-tertiary)" />
                        </div>
                        <h3 className="title-large" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Instant Booking</h3>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Book now or schedule for later. Real-time confirmations
                        </p>
                    </Card>
                    
                    <Card className="card-hover" variant="outlined" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            background: 'linear-gradient(135deg, #C7F9CC 0%, #B3F5BC 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <TrendingUp size={32} color="#10B981" />
                        </div>
                        <h3 className="title-large" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Best Prices</h3>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            Transparent pricing with no hidden charges. Only 10% platform fee
                        </p>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-tertiary) 100%)',
                padding: '3rem 1rem',
                textAlign: 'center',
                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                margin: '0 1rem 4rem',
                color: 'white'
            }}>
                <div className="container">
                    <Award size={48} style={{ marginBottom: '1rem', opacity: 0.9 }} />
                    <h2 className="headline-medium" style={{ marginBottom: '1rem', color: 'white', fontWeight: 700 }}>
                        Join 10,000+ Satisfied Customers
                    </h2>
                    <p className="body-large" style={{ marginBottom: '2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Experience the easiest way to hire trusted local professionals. Start your first booking today!
                    </p>
                    <Link to="/search">
                        <Button 
                            variant="filled" 
                            size="lg" 
                            style={{ 
                                backgroundColor: 'white',
                                color: 'var(--md-sys-color-primary)',
                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                fontWeight: 600
                            }}
                        >
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
