import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const TimeSlotPicker = ({ providerId, selectedDate, onTimeSelect, selectedTime }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (providerId && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [providerId, selectedDate]);

  const fetchAvailableTimeSlots = async () => {
    try {
      setLoading(true);
      const dayOfWeek = selectedDate.getDay();

      // Fetch provider's time slots for this day
      const { data: slots, error } = await supabase
        .from('provider_time_slots')
        .select('*')
        .eq('provider_id', providerId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true);

      if (error) throw error;

      // Generate time slots
      const generatedSlots = [];
      slots.forEach(slot => {
        const startTime = parseTime(slot.start_time);
        const endTime = parseTime(slot.end_time);
        
        // Generate 1-hour slots
        for (let hour = startTime; hour < endTime; hour++) {
          const slotStart = formatTime(hour);
          const slotEnd = formatTime(hour + 1);
          generatedSlots.push({
            start: slotStart,
            end: slotEnd,
            available: true
          });
        }
      });

      // Check for existing bookings
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('booking_date', dateStr)
        .in('status', ['pending', 'confirmed', 'in_progress']);

      if (bookingError) throw bookingError;

      // Mark booked slots as unavailable
      bookings.forEach(booking => {
        generatedSlots.forEach(slot => {
          if (booking.start_time === slot.start) {
            slot.available = false;
          }
        });
      });

      setTimeSlots(generatedSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const parseTime = (timeStr) => {
    const [hours] = timeStr.split(':');
    return parseInt(hours);
  };

  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00:00`;
  };

  const formatDisplayTime = (timeStr) => {
    const [hours] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  const handleTimeClick = (slot) => {
    if (!slot.available) return;
    onTimeSelect(slot);
  };

  if (!selectedDate) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.95rem'
      }}>
        <Clock size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
        Please select a date first
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading available times...</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
        borderRadius: '12px',
        color: '#dc2626'
      }}>
        <Clock size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
        <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>No availability</p>
        <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
          Provider has no available time slots on this day
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid rgba(214, 56, 100, 0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <Clock size={24} style={{ color: '#D63864' }} />
        <h3 style={{ 
          fontSize: '1.25rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Available Time Slots
        </h3>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '0.75rem'
      }}>
        {timeSlots.map((slot, index) => {
          const isSelected = selectedTime?.start === slot.start;
          const isAvailable = slot.available;

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              onClick={() => handleTimeClick(slot)}
              disabled={!isAvailable}
              style={{
                padding: '1rem',
                border: isSelected 
                  ? '2px solid #D63864'
                  : '2px solid transparent',
                borderRadius: '12px',
                background: isSelected
                  ? 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)'
                  : isAvailable
                  ? 'linear-gradient(135deg, rgba(214, 56, 100, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)'
                  : 'rgba(0,0,0,0.05)',
                color: isSelected ? 'white' : isAvailable ? '#333' : '#999',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                opacity: isAvailable ? 1 : 0.5,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isSelected && <CheckCircle size={16} />}
                <span>{formatDisplayTime(slot.start)}</span>
              </div>
              <span style={{ 
                fontSize: '0.75rem',
                opacity: 0.8,
                fontWeight: '400'
              }}>
                {isAvailable ? 'Available' : 'Booked'}
              </span>
            </motion.button>
          );
        })}
      </div>

      {selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#059669',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}
        >
          <CheckCircle size={20} />
          <span>
            Selected: {formatDisplayTime(selectedTime.start)} - {formatDisplayTime(selectedTime.end)}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TimeSlotPicker;
