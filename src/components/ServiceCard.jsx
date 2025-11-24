import React from 'react';
import { Link } from 'react-router-dom';
import { Star, User } from 'lucide-react';
import Card from './ui/Card';

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/service/${service.id}`} style={{ display: 'block', height: '100%' }}>
      <Card hover style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: '200px', backgroundColor: '#f1f5f9', position: 'relative' }}>
          {service.image_url ? (
            <img src={service.image_url} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>🛠️</div>
          )}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span>4.8</span>
          </div>
        </div>

        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>{service.title}</h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {service.description}
          </p>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={14} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>{service.profiles?.full_name || 'Provider'}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>₹{service.price}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ServiceCard;
