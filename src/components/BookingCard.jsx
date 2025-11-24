import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const BookingCard = ({ booking, onAccept, onDecline, onCancel, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'cancelled': return 'badge-error';
      case 'completed': return 'badge-info';
      default: return 'badge-info';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card variant="outlined" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <h3 className="title-large" style={{ marginBottom: '0.5rem' }}>
            {booking.service?.title || 'Service'}
          </h3>
          <span className={`badge ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>
        <div className="body-large" style={{ fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>
          ₹{booking.service?.price || 0}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        {userRole === 'provider' && booking.user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            <User size={18} />
            <span className="body-medium">{booking.user.full_name || 'Customer'}</span>
          </div>
        )}
        
        {userRole === 'user' && booking.service?.provider && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            <User size={18} />
            <span className="body-medium">{booking.service.provider.full_name || 'Provider'}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
          <Calendar size={18} />
          <span className="body-medium">{new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {booking.booking_time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            <Clock size={18} />
            <span className="body-medium">{booking.booking_time}</span>
          </div>
        )}

        {booking.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            <MapPin size={18} />
            <span className="body-medium">{booking.location}</span>
          </div>
        )}
      </div>

      {booking.notes && (
        <p className="body-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: 'var(--md-sys-color-surface-variant)',
          borderRadius: 'var(--md-sys-shape-corner-small)'
        }}>
          <strong>Notes:</strong> {booking.notes}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {userRole === 'provider' && booking.status === 'pending' && (
          <>
            <Button variant="filled" size="sm" onClick={() => onAccept(booking.id)} style={{ flex: 1 }}>
              Accept
            </Button>
            <Button variant="outlined" size="sm" onClick={() => onDecline(booking.id)} style={{ flex: 1 }}>
              Decline
            </Button>
          </>
        )}

        {userRole === 'user' && booking.status === 'pending' && (
          <Button variant="outlined" size="sm" onClick={() => onCancel(booking.id)} style={{ flex: 1 }}>
            Cancel Request
          </Button>
        )}

        {booking.service && (
          <Link to={`/service/${booking.service.id}`} style={{ flex: 1 }}>
            <Button variant="text" size="sm" style={{ width: '100%' }}>
              View Service
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;
