import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const BookingCalendar = ({ providerId, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedDates();
  }, [providerId, currentDate]);

  const fetchBlockedDates = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('provider_blocked_dates')
        .select('blocked_date')
        .eq('provider_id', providerId)
        .gte('blocked_date', startOfMonth.toISOString().split('T')[0])
        .lte('blocked_date', endOfMonth.toISOString().split('T')[0]);

      if (error) throw error;
      setBlockedDates(data.map(d => d.blocked_date));
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateBlocked = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.includes(dateStr);
  };

  const isDatePast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    if (!date || isDatePast(date) || isDateBlocked(date)) return;
    onDateSelect(date);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

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
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={previousMonth}
          style={{
            background: 'linear-gradient(135deg, rgba(214, 56, 100, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#D63864'
          }}
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1.25rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            <CalendarIcon size={20} />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          style={{
            background: 'linear-gradient(135deg, rgba(214, 56, 100, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#D63864'
          }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Day Names */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '0.5rem',
        marginBottom: '0.75rem'
      }}>
        {dayNames.map(day => (
          <div key={day} style={{ 
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#666',
            padding: '0.5rem 0'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '0.5rem'
      }}>
        <AnimatePresence mode="wait">
          {days.map((date, index) => {
            const isPast = isDatePast(date);
            const isBlocked = isDateBlocked(date);
            const isSelected = isDateSelected(date);
            const isDisabled = !date || isPast || isBlocked;

            return (
              <motion.button
                key={date ? date.toISOString() : `empty-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                style={{
                  aspectRatio: '1',
                  border: 'none',
                  borderRadius: '12px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)'
                    : isDisabled
                    ? 'transparent'
                    : 'linear-gradient(135deg, rgba(214, 56, 100, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)',
                  color: isSelected ? 'white' : isDisabled ? '#ccc' : '#333',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '0.95rem',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  textDecoration: isBlocked ? 'line-through' : 'none',
                  opacity: isDisabled ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {date ? date.getDate() : ''}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '1.5rem',
        fontSize: '0.875rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)'
          }} />
          <span style={{ color: '#666' }}>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%',
            background: '#e5e7eb'
          }} />
          <span style={{ color: '#666' }}>Unavailable</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCalendar;
