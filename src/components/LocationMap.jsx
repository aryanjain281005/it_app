import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, X, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { getCurrentLocation, calculateDistance } from '../lib/capacitorUtils';
import toast from 'react-hot-toast';

const LocationMap = ({ booking, onClose }) => {
    const { user } = useAuth();
    const [userLocation, setUserLocation] = useState(null);
    const [providerLocation, setProviderLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [loading, setLoading] = useState(true);
    const isProvider = user.id === booking.provider_id;

    useEffect(() => {
        fetchLocation();
        // Update location every 30 seconds
        const interval = setInterval(fetchLocation, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchLocation = async () => {
        try {
            const location = await getCurrentLocation();
            
            if (isProvider) {
                setProviderLocation(location);
                // If we have user's location, calculate distance
                if (booking.user_location) {
                    const userLoc = JSON.parse(booking.user_location);
                    const dist = calculateDistance(
                        location.latitude,
                        location.longitude,
                        userLoc.latitude,
                        userLoc.longitude
                    );
                    setDistance(dist);
                }
            } else {
                setUserLocation(location);
                // If we have provider's location, calculate distance
                if (booking.provider_location) {
                    const providerLoc = JSON.parse(booking.provider_location);
                    const dist = calculateDistance(
                        location.latitude,
                        location.longitude,
                        providerLoc.latitude,
                        providerLoc.longitude
                    );
                    setDistance(dist);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching location:', error);
            toast.error('Failed to get location');
            setLoading(false);
        }
    };

    const openInMaps = () => {
        const targetLat = isProvider ? 
            (booking.user_location ? JSON.parse(booking.user_location).latitude : null) :
            (booking.provider_location ? JSON.parse(booking.provider_location).latitude : null);
        
        const targetLng = isProvider ?
            (booking.user_location ? JSON.parse(booking.user_location).longitude : null) :
            (booking.provider_location ? JSON.parse(booking.provider_location).longitude : null);

        if (targetLat && targetLng) {
            // Open in default maps app
            const url = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;
            window.open(url, '_blank');
        } else {
            toast.error('Location not available');
        }
    };

    const getMapUrl = () => {
        if (!userLocation && !providerLocation) return '';
        
        const markers = [];
        if (userLocation) {
            markers.push(`color:blue|label:U|${userLocation.latitude},${userLocation.longitude}`);
        }
        if (providerLocation) {
            markers.push(`color:red|label:P|${providerLocation.latitude},${providerLocation.longitude}`);
        }
        
        const center = userLocation || providerLocation;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${center.latitude},${center.longitude}&zoom=14&size=600x400&markers=${markers.join('&markers=')}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}
            >
                <Card style={{ padding: '1.5rem', position: 'relative' }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--md-sys-color-on-surface-variant)',
                            zIndex: 10,
                        }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <MapPin size={24} color="var(--md-sys-color-primary)" />
                            <h2 className="title-large">Location Tracking</h2>
                        </div>
                        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                            {isProvider ? 'Customer location and distance' : 'Provider location and distance'}
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{ display: 'inline-block' }}
                            >
                                <Navigation size={40} color="var(--md-sys-color-primary)" />
                            </motion.div>
                            <p className="body-medium" style={{ marginTop: '1rem' }}>Getting location...</p>
                        </div>
                    ) : (
                        <>
                            {/* Distance Card */}
                            {distance !== null && (
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                                        padding: '1.5rem',
                                        borderRadius: 'var(--radius-lg)',
                                        marginBottom: '1.5rem',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                        {distance.toFixed(2)} km
                                    </div>
                                    <div className="body-medium">
                                        Approximate distance
                                    </div>
                                </div>
                            )}

                            {/* Simple Map Visualization */}
                            <div
                                style={{
                                    background: 'var(--md-sys-color-surface-variant)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '2rem',
                                    marginBottom: '1.5rem',
                                    minHeight: '300px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '2rem',
                                }}
                            >
                                {userLocation && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                background: '#3B82F6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 0.5rem',
                                            }}
                                        >
                                            <MapPin size={30} color="white" />
                                        </div>
                                        <div className="title-medium">Customer Location</div>
                                        <div className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
                                            {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                                        </div>
                                    </div>
                                )}

                                {userLocation && providerLocation && (
                                    <div style={{ height: '2px', width: '100%', background: 'var(--md-sys-color-outline)', position: 'relative' }}>
                                        <div style={{ 
                                            position: 'absolute', 
                                            top: '50%', 
                                            left: '50%', 
                                            transform: 'translate(-50%, -50%)',
                                            background: 'var(--md-sys-color-surface-variant)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontWeight: 600,
                                            color: 'var(--md-sys-color-primary)',
                                        }}>
                                            {distance?.toFixed(2)} km
                                        </div>
                                    </div>
                                )}

                                {providerLocation && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                                background: '#EF4444',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 0.5rem',
                                            }}
                                        >
                                            <MapPin size={30} color="white" />
                                        </div>
                                        <div className="title-medium">Provider Location</div>
                                        <div className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '0.25rem' }}>
                                            {providerLocation.latitude.toFixed(6)}, {providerLocation.longitude.toFixed(6)}
                                        </div>
                                    </div>
                                )}

                                {!userLocation && !providerLocation && (
                                    <div style={{ textAlign: 'center' }}>
                                        <AlertCircle size={40} color="var(--md-sys-color-error)" />
                                        <p className="body-medium" style={{ marginTop: '1rem' }}>
                                            Location not available
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button
                                    variant="filled"
                                    fullWidth
                                    onClick={openInMaps}
                                    style={{ height: '48px' }}
                                >
                                    <Navigation size={20} style={{ marginRight: '0.5rem' }} />
                                    Open in Maps
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={fetchLocation}
                                    style={{ height: '48px' }}
                                >
                                    <Navigation size={20} />
                                </Button>
                            </div>

                            <p className="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', marginTop: '1rem' }}>
                                Location updates every 30 seconds
                            </p>
                        </>
                    )}
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default LocationMap;
