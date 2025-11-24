import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count = 0, size = 16, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            fill="#FFA500"
            stroke="#FFA500"
            strokeWidth={1.5}
          />
        ))}
        {hasHalfStar && (
          <div style={{ position: 'relative', width: size, height: size }}>
            <Star size={size} fill="none" stroke="#FFA500" strokeWidth={1.5} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
              <Star size={size} fill="#FFA500" stroke="#FFA500" strokeWidth={1.5} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            fill="none"
            stroke="#D1D5DB"
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showCount && (
        <span className="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {rating.toFixed(1)} {count > 0 && `(${count})`}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
