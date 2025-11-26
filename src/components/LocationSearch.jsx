import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Loader } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import toast from 'react-hot-toast';

const LocationSearch = ({ onLocationChange, currentRadius = 10 }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(currentRadius);
  const [manualLocation, setManualLocation] = useState('');

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Check if we're in a web environment
      const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';
      
      if (isWeb && navigator.geolocation) {
        // Use web geolocation API
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              radius: radius
            };
            setLocation(loc);
            onLocationChange(loc);
            toast.success('Location detected!');
            setLoading(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            toast.error('Failed to get location. Please enable location services.');
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        // Use Capacitor geolocation for native apps
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });
        
        const loc = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          radius: radius
        };
        setLocation(loc);
        onLocationChange(loc);
        toast.success('Location detected!');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Failed to get location. Please check permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (location) {
      const updatedLocation = { ...location, radius: newRadius };
      setLocation(updatedLocation);
      onLocationChange(updatedLocation);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setManualLocation('');
    onLocationChange(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(214, 56, 100, 0.1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '1.5rem'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <MapPin size={20} style={{ color: '#D63864' }} />
        <h3 style={{ 
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#1a1a1a'
        }}>
          Location & Distance
        </h3>
      </div>

      {/* Get Current Location Button */}
      {!location && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={getCurrentLocation}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: loading 
              ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
              : 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Detecting Location...
            </>
          ) : (
            <>
              <Navigation size={20} />
              Use My Current Location
            </>
          )}
        </motion.button>
      )}

      {/* Location Display */}
      {location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
            borderRadius: '12px',
            marginBottom: '1rem'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ 
                fontSize: '0.875rem',
                color: '#059669',
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                📍 Location Detected
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearLocation}
              style={{
                background: 'none',
                border: 'none',
                color: '#059669',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Radius Slider */}
      <div>
        <label style={{ 
          display: 'block',
          fontSize: '0.95rem',
          fontWeight: '600',
          color: '#333',
          marginBottom: '0.75rem'
        }}>
          Search Radius: <span style={{ 
            color: '#D63864',
            fontSize: '1.1rem'
          }}>{radius} km</span>
        </label>
        
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              outline: 'none',
              background: `linear-gradient(to right, #D63864 0%, #FF6B35 ${(radius/50)*100}%, #e5e7eb ${(radius/50)*100}%, #e5e7eb 100%)`,
              WebkitAppearance: 'none',
              appearance: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Distance Markers */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#999'
        }}>
          <span>1 km</span>
          <span>25 km</span>
          <span>50 km</span>
        </div>
      </div>

      {/* Info Text */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(214, 56, 100, 0.05)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#666'
      }}>
        💡 Services within {radius}km of your location will be shown, sorted by distance
      </div>
    </motion.div>
  );
};

export default LocationSearch;
