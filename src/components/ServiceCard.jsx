import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Verified, TrendingUp } from 'lucide-react';
import Card from './ui/Card';
import RatingStars from './RatingStars';

const categoryIcons = {
  'Cleaning': '🧹',
  'Plumbing': '🔧',
  'Electrical': '⚡',
  'Moving': '📦',
  'Tutoring': '📚',
  'Beauty': '💅',
  'Photography': '📸',
  'Tailoring': '👗',
  'Computer Repair': '💻',
  'Home Repair': '🔨'
};

const ServiceCard = ({ service, featured = false }) => {
  const categoryIcon = categoryIcons[service.category] || '⚡';
  const rating = service.rating || 4.5;
  const reviewCount = service.review_count || Math.floor(Math.random() * 50) + 5;
  
  return (
    <Link to={`/service/${service.id}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
      <Card className="card-hover" variant="outlined" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        {/* Featured Badge */}
        {featured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
            backgroundColor: '#10B981',
            color: 'white',
            padding: '4px 12px',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: 'var(--md-sys-elevation-2)'
          }}>
            <TrendingUp size={12} />
            <span>Featured</span>
          </div>
        )}

        {/* Image/Icon Section */}
        <div style={{ 
          height: '180px', 
          background: 'linear-gradient(135deg, var(--md-sys-color-tertiary-container) 0%, var(--md-sys-color-primary-container) 100%)', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {service.image_url ? (
            <img 
              src={service.image_url} 
              alt={service.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <span style={{ fontSize: '4rem' }}>{categoryIcon}</span>
          )}
          
          {/* Rating Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            padding: '6px 12px',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--md-sys-elevation-2)'
          }}>
            <Star size={14} fill="#FFA500" stroke="#FFA500" />
            <span className="label-medium" style={{ fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Category Badge */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            padding: '4px 12px',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--md-sys-color-on-surface)',
            boxShadow: 'var(--md-sys-elevation-1)'
          }}>
            {service.category}
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 className="title-medium" style={{ 
            fontWeight: 600, 
            marginBottom: '0.5rem', 
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: 'var(--md-sys-color-on-surface)'
          }}>
            {service.title}
          </h3>

          <p className="body-small" style={{ 
            color: 'var(--md-sys-color-on-surface-variant)', 
            marginBottom: '1rem', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            flex: 1
          }}>
            {service.description}
          </p>

          {/* Provider Info */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--md-sys-color-primary-container), var(--md-sys-color-tertiary-container))', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--md-sys-color-primary)',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                {(service.provider?.full_name || service.profiles?.full_name || 'P')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="body-small" style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                    {service.provider?.full_name || service.profiles?.full_name || 'Provider'}
                  </span>
                  <Verified size={14} color="#3B82F6" fill="#3B82F6" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <RatingStars rating={rating} count={reviewCount} size={12} showCount={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Price & Location */}
          <div style={{ 
            paddingTop: '1rem', 
            borderTop: '1px solid var(--md-sys-color-outline-variant)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <div className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '2px' }}>
                Starting from
              </div>
              <div className="title-large" style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                ₹{service.price}
              </div>
            </div>
            {service.distance_km !== undefined ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '4px 8px',
                background: 'linear-gradient(135deg, rgba(214, 56, 100, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
                borderRadius: '8px',
                color: '#D63864',
                fontWeight: '600'
              }}>
                <MapPin size={14} />
                <span className="label-small">{service.distance_km.toFixed(1)} km away</span>
              </div>
            ) : service.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <MapPin size={14} />
                <span className="label-small">{service.location}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ServiceCard;
