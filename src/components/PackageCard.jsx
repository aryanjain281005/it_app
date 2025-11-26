import { motion } from 'framer-motion';
import { Package, Calendar, Percent, Check } from 'lucide-react';
import Button from './ui/Button';

const PackageCard = ({ package: pkg, onSelect, isSelected }) => {
  const calculatePerSessionPrice = () => {
    return (pkg.price / pkg.sessions).toFixed(2);
  };

  const formatValidityText = () => {
    if (pkg.validity_days >= 365) {
      return `${Math.floor(pkg.validity_days / 365)} year${pkg.validity_days >= 730 ? 's' : ''}`;
    } else if (pkg.validity_days >= 30) {
      return `${Math.floor(pkg.validity_days / 30)} month${pkg.validity_days >= 60 ? 's' : ''}`;
    } else {
      return `${pkg.validity_days} days`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(214, 56, 100, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '1.5rem',
        border: isSelected 
          ? '2px solid #D63864'
          : '1px solid rgba(214, 56, 100, 0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => onSelect && onSelect(pkg)}
    >
      {/* Discount Badge */}
      {pkg.discount_percentage > 0 && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '0.5rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          <Percent size={14} />
          {pkg.discount_percentage}% OFF
        </div>
      )}

      {/* Selected Badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
            color: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(214, 56, 100, 0.4)'
          }}
        >
          <Check size={20} />
        </motion.div>
      )}

      {/* Package Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(214, 56, 100, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <Package size={28} style={{ color: '#D63864' }} />
      </div>

      {/* Package Name */}
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '0.5rem'
      }}>
        {pkg.name}
      </h3>

      {/* Description */}
      {pkg.description && (
        <p style={{
          fontSize: '0.95rem',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          {pkg.description}
        </p>
      )}

      {/* Package Details */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {/* Sessions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(214, 56, 100, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Package size={16} style={{ color: '#D63864' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Sessions</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a' }}>
              {pkg.sessions} sessions
            </div>
          </div>
        </div>

        {/* Validity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(214, 56, 100, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={16} style={{ color: '#D63864' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Valid for</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a' }}>
              {formatValidityText()}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, rgba(214, 56, 100, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)',
        borderRadius: '12px',
        marginBottom: '1rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '0.875rem', color: '#666' }}>Total Price</span>
          <span style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ₹{pkg.price}
          </span>
        </div>
        <div style={{ 
          fontSize: '0.875rem', 
          color: '#666',
          textAlign: 'right'
        }}>
          ₹{calculatePerSessionPrice()} per session
        </div>
      </div>

      {/* Select Button */}
      {onSelect && (
        <Button
          variant={isSelected ? "filled" : "outline"}
          style={{ width: '100%' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pkg);
          }}
        >
          {isSelected ? 'Selected' : 'Select Package'}
        </Button>
      )}
    </motion.div>
  );
};

export default PackageCard;
