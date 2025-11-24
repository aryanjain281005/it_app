import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BookingCard from '../components/BookingCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, history

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
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
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

    if (loading) return <div className="flex-center" style={{ height: '50vh' }}><div className="animate-spin" style={{ width: '48px', height: '48px', border: '4px solid var(--md-sys-color-surface-variant)', borderTopColor: 'var(--md-sys-color-primary)', borderRadius: '50%' }}></div></div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="headline-medium" style={{ fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>Dashboard</h1>
                    <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Welcome back, {user.user_metadata?.full_name}</p>
                </div>
                {user.user_metadata?.role === 'provider' && (
                    <Link to="/create-service">
                        <Button variant="filled">
                            <Plus size={20} style={{ marginRight: '8px' }} />
                            New Service
                        </Button>
                    </Link>
                )}
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)', marginBottom: '2rem', display: 'flex', gap: '2rem' }}>
                <button
                    onClick={() => setActiveTab('upcoming')}
                    style={{
                        padding: '0 0 12px',
                        borderBottom: activeTab === 'upcoming' ? '2px solid var(--md-sys-color-primary)' : 'none',
                        color: activeTab === 'upcoming' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
                        fontWeight: 500,
                        background: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Upcoming Bookings
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '0 0 12px',
                        borderBottom: activeTab === 'history' ? '2px solid var(--md-sys-color-primary)' : 'none',
                        color: activeTab === 'history' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
                        fontWeight: 500,
                        background: 'none',
                        cursor: 'pointer'
                    }}
                >
                    History
                </button>
            </div>

            {/* Bookings List */}
            {filteredBookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredBookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            userRole={user.user_metadata?.role}
                            onAccept={(id) => updateStatus(id, 'accepted')}
                            onDecline={(id) => updateStatus(id, 'cancelled')}
                            onCancel={(id) => updateStatus(id, 'cancelled')}
                            onComplete={(id) => updateStatus(id, 'completed')}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p className="title-medium">No {activeTab} bookings found.</p>
                    {activeTab === 'upcoming' && (
                        <Link to="/search">
                            <Button variant="text" style={{ marginTop: '1rem' }}>Find Services</Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
