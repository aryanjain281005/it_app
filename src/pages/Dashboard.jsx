import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
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
          services (title, image_url),
          profiles:user_id (full_name, location)
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
            case 'confirmed': return 'var(--md-sys-color-primary)';
            case 'completed': return 'green';
            case 'cancelled': return 'var(--md-sys-color-error)';
            default: return 'var(--md-sys-color-outline)';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'upcoming') {
            return booking.status === 'pending' || booking.status === 'confirmed';
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
                        <Card key={booking.id} variant="outlined" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--md-sys-color-surface-variant)' }}>
                                        {booking.services?.image_url ? (
                                            <img src={booking.services.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="flex-center" style={{ width: '100%', height: '100%' }}>🛠️</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="title-medium" style={{ fontWeight: 600 }}>{booking.services?.title}</h3>
                                        <p className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                            Booking ID: #{booking.id.slice(0, 8)}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(booking.status) }}></div>
                                            <span style={{ fontSize: '0.875rem', textTransform: 'capitalize', color: 'var(--md-sys-color-on-surface)' }}>{booking.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p className="title-large" style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>₹{booking.total_price}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    <Calendar size={18} />
                                    <span className="body-medium">{new Date(booking.booking_date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    <Clock size={18} />
                                    <span className="body-medium">{booking.booking_time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    <MapPin size={18} />
                                    <span className="body-medium">{booking.profiles?.location || 'Location not set'}</span>
                                </div>
                            </div>

                            {/* Actions for Provider */}
                            {user.user_metadata?.role === 'provider' && booking.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <Button size="sm" variant="filled" onClick={() => updateStatus(booking.id, 'confirmed')}>
                                        <CheckCircle size={16} style={{ marginRight: '4px' }} /> Accept
                                    </Button>
                                    <Button size="sm" variant="outlined" onClick={() => updateStatus(booking.id, 'cancelled')} style={{ color: 'var(--md-sys-color-error)', borderColor: 'var(--md-sys-color-error)' }}>
                                        <XCircle size={16} style={{ marginRight: '4px' }} /> Decline
                                    </Button>
                                </div>
                            )}

                            {/* Actions for User */}
                            {user.user_metadata?.role === 'user' && booking.status === 'pending' && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <Button size="sm" variant="text" onClick={() => updateStatus(booking.id, 'cancelled')} style={{ color: 'var(--md-sys-color-error)' }}>
                                        Cancel Booking
                                    </Button>
                                </div>
                            )}
                        </Card>
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
