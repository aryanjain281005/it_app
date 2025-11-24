import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Star, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ServiceDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchServiceDetails();
    }, [id]);

    const fetchServiceDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select(`
          *,
          profiles (full_name, avatar_url, location, bio)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setService(data);
        } catch (error) {
            console.error('Error fetching service:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        try {
            const { error } = await supabase.from('bookings').insert([
                {
                    user_id: user.id,
                    provider_id: service.provider_id,
                    service_id: service.id,
                    booking_date: bookingDate,
                    booking_time: bookingTime,
                    total_price: service.price,
                    status: 'pending'
                }
            ]);

            if (error) throw error;
            alert('Booking request sent successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('Error booking service: ' + error.message);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '50vh' }}><div className="animate-spin" style={{ width: '48px', height: '48px', border: '4px solid var(--md-sys-color-surface-variant)', borderTopColor: 'var(--md-sys-color-primary)', borderRadius: '50%' }}></div></div>;
    if (!service) return <div className="container" style={{ padding: '2rem' }}>Service not found</div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '1rem' }}>
            <Button variant="text" onClick={() => navigate(-1)} style={{ marginBottom: '1rem', paddingLeft: 0 }}>
                <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Back
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Left Column: Service Info */}
                <div>
                    <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'var(--md-sys-elevation-1)' }}>
                        {service.image_url ? (
                            <img src={service.image_url} alt={service.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ height: '240px', backgroundColor: 'var(--md-sys-color-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🛠️</div>
                        )}
                    </div>

                    <h1 className="headline-medium" style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--md-sys-color-on-surface)' }}>{service.title}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star fill="#fbbf24" color="#fbbf24" size={18} />
                            <span style={{ fontWeight: 500, color: 'var(--md-sys-color-on-surface)' }}>4.8 (120 reviews)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={18} />
                            <span>{service.profiles?.location || 'Mumbai, India'}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 className="title-medium" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>About this Service</h3>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{service.description}</p>
                    </div>

                    {/* Provider Bio */}
                    <Card variant="filled" style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-on-primary-container)', flexShrink: 0 }}>
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="title-medium" style={{ fontWeight: 600 }}>Provided by {service.profiles?.full_name}</h3>
                            <p className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '4px' }}>Verified Professional • Member since 2023</p>
                            <p className="body-medium">{service.profiles?.bio || "I am a dedicated professional committed to delivering high-quality service."}</p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Booking Card */}
                <div>
                    <Card variant="elevated" style={{ position: 'sticky', top: '80px' }}>
                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                            <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Total Price</p>
                            <h2 className="headline-medium" style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>₹{service.price}</h2>
                        </div>

                        <form onSubmit={handleBooking}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label-large" style={{ display: 'block', marginBottom: '4px' }}>Select Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--md-sys-color-on-surface-variant)' }} />
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 40px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--md-sys-color-outline)',
                                            outline: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label-large" style={{ display: 'block', marginBottom: '4px' }}>Select Time</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--md-sys-color-on-surface-variant)' }} />
                                    <select
                                        required
                                        value={bookingTime}
                                        onChange={(e) => setBookingTime(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 40px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--md-sys-color-outline)',
                                            outline: 'none',
                                            appearance: 'none',
                                            backgroundColor: 'transparent',
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        <option value="">Choose a time slot</option>
                                        <option value="09:00">09:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="14:00">02:00 PM</option>
                                        <option value="16:00">04:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '12px' }}>
                                <ShieldCheck size={24} color="var(--md-sys-color-primary)" />
                                <div>
                                    <p className="title-small" style={{ color: 'var(--md-sys-color-on-secondary-container)' }}>Satisfaction Guarantee</p>
                                    <p className="body-small" style={{ color: 'var(--md-sys-color-on-secondary-container)' }}>Verified provider with secure payment protection.</p>
                                </div>
                            </div>

                            <Button type="submit" variant="filled" size="lg" isLoading={bookingLoading} style={{ width: '100%' }}>
                                Book Now
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;
