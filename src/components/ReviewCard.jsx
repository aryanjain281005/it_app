import { Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const ReviewCard = ({ review, onHelpfulClick }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleHelpful = async () => {
    if (hasVoted) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ helpful_count: helpfulCount + 1 })
        .eq('id', review.id);

      if (error) throw error;

      setHelpfulCount(prev => prev + 1);
      setHasVoted(true);
      toast.success('Thanks for your feedback!');
    } catch (error) {
      console.error('Error updating helpful count:', error);
      toast.error('Failed to register vote');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? '#FF6B35' : 'none'}
        stroke={i < rating ? '#FF6B35' : '#ddd'}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1rem',
        border: '1px solid rgba(214, 56, 100, 0.1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            {review.profiles?.full_name?.[0] || 'U'}
          </div>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <span style={{ 
                fontWeight: '600', 
                fontSize: '1rem',
                color: '#1a1a1a'
              }}>
                {review.profiles?.full_name || 'Anonymous'}
              </span>
              {review.verified && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  color: 'white'
                }}>
                  <CheckCircle size={12} />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {renderStars(review.rating)}
            </div>
          </div>
        </div>
        <span style={{ 
          fontSize: '0.875rem', 
          color: '#666',
          whiteSpace: 'nowrap'
        }}>
          {formatDate(review.created_at)}
        </span>
      </div>

      {/* Review Content */}
      <p style={{ 
        color: '#333', 
        lineHeight: '1.6',
        fontSize: '0.95rem',
        marginBottom: '1rem'
      }}>
        {review.comment}
      </p>

      {/* Provider Response */}
      {review.response && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(214, 56, 100, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)',
          borderLeft: '3px solid #D63864',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            fontWeight: '600', 
            fontSize: '0.875rem',
            color: '#D63864',
            marginBottom: '0.5rem'
          }}>
            Provider Response
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#555',
            lineHeight: '1.6'
          }}>
            {review.response}
          </p>
          <span style={{ 
            fontSize: '0.75rem', 
            color: '#999',
            marginTop: '0.5rem',
            display: 'block'
          }}>
            Responded {formatDate(review.responded_at)}
          </span>
        </div>
      )}

      {/* Helpful Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleHelpful}
        disabled={hasVoted}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: hasVoted 
            ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' 
            : 'linear-gradient(135deg, rgba(214, 56, 100, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: hasVoted ? '#666' : '#D63864',
          cursor: hasVoted ? 'default' : 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <ThumbsUp size={16} fill={hasVoted ? '#666' : 'none'} />
        <span>Helpful ({helpfulCount})</span>
      </motion.button>
    </motion.div>
  );
};

export default ReviewCard;
