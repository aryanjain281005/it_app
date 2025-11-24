import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Star, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ReviewBooking = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [booking, setBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchBooking();
        checkExistingReview();
    }, [bookingId]);

    const fetchBooking = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    service:services!service_id (
                        id,
                        title,
                        provider:profiles!provider_id (id, full_name, avatar_url)
                    )
                `)
                .eq('id', bookingId)
                .single();

            if (error) throw error;
            setBooking(data);
        } catch (error) {
            console.error('Error fetching booking:', error);
        }
    };

    const checkExistingReview = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('booking_id', bookingId)
                .eq('reviewer_id', user.id)
                .single();

            if (data) {
                setSubmitted(true);
                setRating(data.rating);
                setComment(data.comment || '');
            }
        } catch (error) {
            // No review found, that's okay
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .insert({
                    booking_id: bookingId,
                    reviewer_id: user.id,
                    provider_id: booking.provider_id,
                    rating: rating,
                    comment: comment
                });

            if (error) throw error;
            setSubmitted(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!booking) {
        return <div className="flex-center" style={{ height: '50vh' }}>Loading...</div>;
    }

    if (submitted) {
        return (
            <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 5rem)', padding: '2rem' }}>
                <Card style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                    <CheckCircle size={64} style={{ color: 'var(--md-sys-color-primary)', margin: '0 auto 1rem' }} />
                    <h2 className="headline-medium" style={{ marginBottom: '0.5rem' }}>Thank You!</h2>
                    <p className="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '1.5rem' }}>
                        Your review has been submitted successfully.
                    </p>
                    <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
            <Card>
                <h1 className="headline-medium" style={{ marginBottom: '0.5rem' }}>Rate Your Experience</h1>
                <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '1.5rem' }}>
                    How was your experience with {booking.service?.provider?.full_name}?
                </p>

                <div style={{ 
                    padding: '1rem', 
                    backgroundColor: 'var(--md-sys-color-surface-variant)', 
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    marginBottom: '2rem'
                }}>
                    <p className="title-medium" style={{ marginBottom: '0.25rem' }}>{booking.service?.title}</p>
                    <p className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Star Rating */}
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <p className="title-medium" style={{ marginBottom: '1rem' }}>Your Rating</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Star
                                        size={48}
                                        fill={star <= (hoveredRating || rating) ? '#FFB800' : 'none'}
                                        stroke={star <= (hoveredRating || rating) ? '#FFB800' : 'var(--md-sys-color-outline)'}
                                        style={{ transition: 'all 0.2s' }}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="body-medium" style={{ marginTop: '0.5rem', color: 'var(--md-sys-color-primary)' }}>
                                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="title-small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Your Review (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            rows={5}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                border: '1px solid var(--md-sys-color-outline)',
                                backgroundColor: 'transparent',
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: '1rem',
                                color: 'var(--md-sys-color-on-surface)',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate('/dashboard')}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            disabled={rating === 0}
                            style={{ flex: 1 }}
                        >
                            Submit Review
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ReviewBooking;
