import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, Star, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
    const categories = [
        { name: 'Cleaning', icon: '🧹', color: '#EADDFF' },
        { name: 'Plumbing', icon: '🔧', color: '#D0BCFF' },
        { name: 'Electrical', icon: '⚡', color: '#E8DEF8' },
        { name: 'Moving', icon: '📦', color: '#F2B8B5' },
        { name: 'Tutoring', icon: '📚', color: '#F9DEDC' },
        { name: 'Beauty', icon: '💅', color: '#FFD8E4' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{
                backgroundColor: 'var(--md-sys-color-surface)',
                padding: '4rem 1rem',
                textAlign: 'center',
                borderRadius: '0 0 2rem 2rem',
                marginBottom: '2rem'
            }}>
                <div className="container">
                    <h1 className="display-medium" style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--md-sys-color-on-surface)' }}>
                        Expert Local Services,<br />
                        <span style={{ color: 'var(--md-sys-color-primary)' }}>On Demand</span>
                    </h1>
                    <p className="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        Find trusted professionals for all your home and personal needs. Book instantly with confidence.
                    </p>
                    <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/search">
                            <Button variant="filled" size="lg" style={{ borderRadius: 'var(--md-sys-shape-corner-full)' }}>
                                <Search size={20} style={{ marginRight: '0.5rem' }} />
                                Find a Pro
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="outlined" size="lg" style={{ borderRadius: 'var(--md-sys-shape-corner-full)' }}>
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
                        <Button variant="text" size="sm">View All <ArrowRight size={16} style={{ marginLeft: '4px' }} /></Button>
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {categories.map((cat) => (
                        <Link key={cat.name} to={`/search?category=${cat.name}`} style={{ textDecoration: 'none' }}>
                            <Card
                                variant="filled"
                                hover
                                style={{
                                    backgroundColor: cat.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '140px',
                                    textAlign: 'center',
                                    color: 'var(--md-sys-color-on-surface)'
                                }}
                            >
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{cat.icon}</span>
                                <span className="label-large">{cat.name}</span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="container" style={{ marginBottom: '4rem' }}>
                <h2 className="headline-small" style={{ fontWeight: 600, marginBottom: '2rem', textAlign: 'center' }}>Why Choose Us</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <Card variant="outlined" style={{ padding: '2rem' }}>
                        <Shield size={32} color="var(--md-sys-color-primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="title-large" style={{ marginBottom: '0.5rem' }}>Verified Pros</h3>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Every provider is vetted and background checked for your safety.</p>
                    </Card>
                    <Card variant="outlined" style={{ padding: '2rem' }}>
                        <Clock size={32} color="var(--md-sys-color-primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="title-large" style={{ marginBottom: '0.5rem' }}>Instant Booking</h3>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Book services in seconds with our easy-to-use scheduling system.</p>
                    </Card>
                    <Card variant="outlined" style={{ padding: '2rem' }}>
                        <Star size={32} color="var(--md-sys-color-primary)" style={{ marginBottom: '1rem' }} />
                        <h3 className="title-large" style={{ marginBottom: '0.5rem' }}>Top Rated</h3>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Hire professionals with proven track records and high customer ratings.</p>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Home;
