import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle, Plus, TrendingUp, BarChart } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BookingCard from '../components/BookingCard';
import ProviderAnalytics from '../components/ProviderAnalytics';
import { Link } from 'react-router-dom';
import { announceToScreenReader } from '../lib/accessibility';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, history, analytics

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const isProvider = user.user_metadata?.role === 'provider';
            const column = isProvider ? 'provider_id' : 'user_id';

            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          service:services!service_id (
            id,
            title,
            price,
            image_url,
            provider:profiles!provider_id (full_name, avatar_url)
          ),
          user:profiles!user_id (full_name, avatar_url)
        `)
                .eq(column, user.id)
                .order('booking_date', { ascending: false });

            if (error) throw error;
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (bookingId, newStatus) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId);

            if (error) throw error;
            
            const statusMessages = {
                accepted: 'Booking accepted successfully!',
                completed: 'Booking marked as completed!',
                cancelled: 'Booking cancelled'
            };
            
            toast.success(statusMessages[newStatus] || 'Booking updated');
            announceToScreenReader(statusMessages[newStatus] || 'Booking updated');
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update booking status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'var(--md-sys-color-primary)';
            case 'completed': return 'green';
            case 'cancelled': return 'var(--md-sys-color-error)';
            default: return 'var(--md-sys-color-outline)';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'upcoming') {
            return booking.status === 'pending' || booking.status === 'accepted';
        } else {
            return booking.status === 'completed' || booking.status === 'cancelled';
        }
    });

    if (loading) return (
        <div className="flex-center" style={{ height: '50vh' }}>
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '4px solid rgba(232, 69, 69, 0.2)', 
                    borderTopColor: '#D63864', 
                    borderRadius: '50%' 
                }}
            />
        </div>
    );

    return (
        <div className="container" style={{ padding: '1rem', paddingBottom: '5rem' }}>
            {/* Warm Gradient Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem 1.5rem',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                    <svg width="100%" height="100%">
                        <pattern id="dashboard-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="2" fill="white" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#dashboard-pattern)" />
                    </svg>
                </div>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <TrendingUp size={24} color="white" />
                            <h1 className="headline-medium" style={{ fontWeight: 700, color: 'white', margin: 0 }}>Dashboard</h1>
                        </div>
                        <p className="body-medium" style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>Welcome back, {user.user_metadata?.full_name}!</p>
                    </div>
                    {user.user_metadata?.role === 'provider' && (
                        <Link to="/create-service">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="filled" style={{ background: 'white', color: '#D63864' }}>
                                    <Plus size={20} style={{ marginRight: '8px' }} />
                                    New Service
                                </Button>
                            </motion.div>
                        </Link>
                    )}
                </div>
            </motion.div>

            {/* Glassmorphism Tabs */}
            <div className="glass" style={{ padding: '0.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('upcoming')}
                    aria-pressed={activeTab === 'upcoming'}
                    aria-label="Show upcoming bookings"
                    style={{
                        flex: 1,
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: activeTab === 'upcoming' ? 'linear-gradient(135deg, #D63864 0%, #F97316 100%)' : 'transparent',
                        color: activeTab === 'upcoming' ? 'white' : '#666',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: activeTab === 'upcoming' ? '0 4px 12px rgba(214, 56, 100, 0.3)' : 'none'
                    }}
                >
                    Upcoming
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('history')}
                    aria-pressed={activeTab === 'history'}
                    aria-label="Show booking history"
                    style={{
                        flex: 1,
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: activeTab === 'history' ? 'linear-gradient(135deg, #D63864 0%, #F97316 100%)' : 'transparent',
                        color: activeTab === 'history' ? 'white' : '#666',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: activeTab === 'history' ? '0 4px 12px rgba(214, 56, 100, 0.3)' : 'none'
                    }}
                >
                    History
                </motion.button>
                {user.user_metadata?.role === 'provider' && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('analytics')}
                        aria-pressed={activeTab === 'analytics'}
                        aria-label="Show analytics"
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === 'analytics' ? 'linear-gradient(135deg, #D63864 0%, #F97316 100%)' : 'transparent',
                            color: activeTab === 'analytics' ? 'white' : '#666',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: activeTab === 'analytics' ? '0 4px 12px rgba(214, 56, 100, 0.3)' : 'none'
                        }}
                    >
                        <BarChart size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                        Analytics
                    </motion.button>
                )}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'analytics' && user.user_metadata?.role === 'provider' ? (
                <ProviderAnalytics />
            ) : (
                <>
            {/* Animated Bookings List */}
            {filteredBookings.length > 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {filteredBookings.map((booking, index) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover-lift"
                        >
                            <BookingCard
                                booking={booking}
                                userRole={user.user_metadata?.role}
                                onAccept={(id) => updateStatus(id, 'accepted')}
                                onDecline={(id) => updateStatus(id, 'cancelled')}
                                onCancel={(id) => updateStatus(id, 'cancelled')}
                                onComplete={(id) => updateStatus(id, 'completed')}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass"
                    style={{ textAlign: 'center', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)' }}
                >
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        opacity: 0.2
                    }}>
                        <AlertCircle size={40} color="white" />
                    </div>
                    <p className="title-medium" style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                        No {activeTab} bookings found
                    </p>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {activeTab === 'upcoming' ? 'Start booking services to see them here' : 'Your booking history will appear here'}
                    </p>
                    {activeTab === 'upcoming' && (
                        <Link to="/search">
                            <Button variant="primary">Find Services</Button>
                        </Link>
                    )}
                </motion.div>
            )}
            </>
            )}
        </div>
    );
};

export default Dashboard;
