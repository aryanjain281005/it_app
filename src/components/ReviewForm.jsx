import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from './ui/Button';

const ReviewForm = ({ serviceId, bookingId, onSuccess }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          service_id: serviceId,
          user_id: user.id,
          booking_id: bookingId,
          rating,
          comment: comment.trim()
        }])
        .select('*, profiles(full_name, avatar_url)')
        .single();

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.message.includes('duplicate')) {
        toast.error('You have already reviewed this service');
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoveredRating || rating);

      return (
        <motion.button
          key={i}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <Star
            size={32}
            fill={isFilled ? '#FF6B35' : 'none'}
            stroke={isFilled ? '#FF6B35' : '#ddd'}
            style={{ transition: 'all 0.2s ease' }}
          />
        </motion.button>
      );
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(214, 56, 100, 0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        marginBottom: '2rem'
      }}
    >
      <h3 style={{ 
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1.5rem'
      }}>
        Write a Review
      </h3>

      {/* Star Rating */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block',
          fontSize: '0.95rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '0.75rem'
        }}>
          Rate this service
        </label>
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {renderStars()}
        </div>
        {rating > 0 && (
          <span style={{ 
            fontSize: '0.875rem',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </span>
        )}
      </div>

      {/* Comment */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block',
          fontSize: '0.95rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '0.75rem'
        }}>
          Your review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this service..."
          required
          minLength={10}
          maxLength={500}
          rows={4}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '0.95rem',
            borderRadius: '12px',
            border: '2px solid rgba(214, 56, 100, 0.2)',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color 0.3s ease',
            background: 'rgba(255, 255, 255, 0.8)'
          }}
          onFocus={(e) => e.target.style.borderColor = '#D63864'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(214, 56, 100, 0.2)'}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          <span>Minimum 10 characters</span>
          <span>{comment.length}/500</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="filled"
        disabled={isSubmitting || rating === 0}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          fontWeight: '600',
          opacity: (isSubmitting || rating === 0) ? 0.6 : 1,
          cursor: (isSubmitting || rating === 0) ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>

      {bookingId && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          This review will be verified as you completed the booking
        </div>
      )}
    </motion.form>
  );
};

export default ReviewForm;
