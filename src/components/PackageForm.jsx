import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import Button from './ui/Button';

const PackageForm = ({ serviceId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sessions: '',
    price: '',
    discount_percentage: '',
    validity_days: '90'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseInt(formData.sessions) < 1) {
      toast.error('Sessions must be at least 1');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('service_packages')
        .insert([{
          service_id: serviceId,
          name: formData.name,
          description: formData.description,
          sessions: parseInt(formData.sessions),
          price: parseFloat(formData.price),
          discount_percentage: parseInt(formData.discount_percentage) || 0,
          validity_days: parseInt(formData.validity_days)
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Package created successfully!');
      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error('Failed to create package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSavings = () => {
    const sessions = parseInt(formData.sessions) || 0;
    const price = parseFloat(formData.price) || 0;
    const discount = parseInt(formData.discount_percentage) || 0;
    
    if (sessions > 0 && price > 0 && discount > 0) {
      const originalTotal = price * sessions / (1 - discount / 100);
      const savings = originalTotal - price;
      return savings.toFixed(2);
    }
    return 0;
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
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={24} style={{ color: '#D63864' }} />
          <h3 style={{ 
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Create Service Package
          </h3>
        </div>
        {onCancel && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            <X size={24} />
          </motion.button>
        )}
      </div>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Package Name */}
        <div>
          <label style={{ 
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '0.5rem'
          }}>
            Package Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., 3-Session Bundle"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '0.95rem',
              borderRadius: '12px',
              border: '2px solid rgba(214, 56, 100, 0.2)',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              background: 'rgba(255, 255, 255, 0.8)'
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ 
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '0.5rem'
          }}>
            Description
          </label>
          <textarea
            placeholder="Describe what's included in this package..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '0.95rem',
              borderRadius: '12px',
              border: '2px solid rgba(214, 56, 100, 0.2)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease',
              background: 'rgba(255, 255, 255, 0.8)'
            }}
          />
        </div>

        {/* Sessions and Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Number of Sessions *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="3"
              value={formData.sessions}
              onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.95rem',
                borderRadius: '12px',
                border: '2px solid rgba(214, 56, 100, 0.2)',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Total Price (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="1350"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.95rem',
                borderRadius: '12px',
                border: '2px solid rgba(214, 56, 100, 0.2)',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
        </div>

        {/* Discount and Validity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="10"
              value={formData.discount_percentage}
              onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.95rem',
                borderRadius: '12px',
                border: '2px solid rgba(214, 56, 100, 0.2)',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Validity (days)
            </label>
            <input
              type="number"
              min="1"
              placeholder="90"
              value={formData.validity_days}
              onChange={(e) => setFormData({ ...formData, validity_days: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.95rem',
                borderRadius: '12px',
                border: '2px solid rgba(214, 56, 100, 0.2)',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
        </div>

        {/* Savings Display */}
        {calculateSavings() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#059669',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}
          >
            💰 Customers save ₹{calculateSavings()} with this package!
          </motion.div>
        )}

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="filled"
            disabled={isSubmitting}
            style={{ flex: 1 }}
          >
            {isSubmitting ? 'Creating...' : 'Create Package'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default PackageForm;
