import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import ServiceCard from '../components/ServiceCard';
import LocationSearch from '../components/LocationSearch';
import { Search as SearchIcon, Filter, Sparkles, MapPin } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Search = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [userLocation, setUserLocation] = useState(null);
    const [showLocationSearch, setShowLocationSearch] = useState(false);

    const categories = ['All', 'Cleaning', 'Plumbing', 'Electrical', 'Moving', 'Tutoring'];

    useEffect(() => {
        // Check for category in URL params
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get('category');
        if (categoryParam && categories.includes(categoryParam)) {
            setSelectedCategory(categoryParam);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [selectedCategory, userLocation]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            if (userLocation) {
                // Use location-based search
                const { data, error } = await supabase.rpc('get_services_within_radius', {
                    user_lat: userLocation.lat,
                    user_lon: userLocation.lon,
                    radius_km: userLocation.radius,
                    category_filter: selectedCategory === 'All' ? null : selectedCategory
                });

                if (error) throw error;

                // Fetch provider details for each service
                const servicesWithProfiles = await Promise.all(
                    (data || []).map(async (service) => {
                        const { data: serviceData, error: serviceError } = await supabase
                            .from('services')
                            .select(`
                                *,
                                profiles (full_name, avatar_url, location)
                            `)
                            .eq('id', service.service_id)
                            .single();

                        if (serviceError) throw serviceError;
                        return {
                            ...serviceData,
                            distance_km: service.distance_km,
                            average_rating: service.average_rating
                        };
                    })
                );

                setServices(servicesWithProfiles);
            } else {
                // Regular search without location
                let query = supabase
                    .from('services')
                    .select(`
                        *,
                        profiles (full_name, avatar_url, location)
                    `);

                if (selectedCategory !== 'All') {
                    query = query.eq('category', selectedCategory);
                }

                const { data, error } = await query;
                if (error) throw error;
                setServices(data || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationChange = (location) => {
        setUserLocation(location);
    };

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '1rem', paddingBottom: '5rem' }}>
            {/* Warm Gradient Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem 1.5rem',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                    <svg width="100%" height="100%">
                        <pattern id="search-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="2" fill="white" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#search-pattern)" />
                    </svg>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Sparkles size={20} color="white" />
                        <h1 className="headline-medium" style={{ fontWeight: 700, color: 'white', margin: 0 }}>Find Professionals</h1>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', margin: 0 }}>
                        {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                    </p>
                </div>
            </motion.div>

            {/* Location Search Toggle */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLocationSearch(!showLocationSearch)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    marginBottom: '1rem',
                    background: showLocationSearch 
                        ? 'linear-gradient(135deg, #D63864 0%, #FF6B35 100%)'
                        : 'linear-gradient(135deg, rgba(214, 56, 100, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: showLocationSearch ? 'white' : '#D63864',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                <MapPin size={20} />
                {showLocationSearch ? 'Hide Location Search' : 'Search by Location'}
            </motion.button>

            {/* Location Search Component */}
            {showLocationSearch && (
                <LocationSearch 
                    onLocationChange={handleLocationChange}
                    currentRadius={userLocation?.radius || 10}
                />
            )}

            <div style={{ marginBottom: '2rem' }}>
                {/* Glassmorphism Search Bar */}
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="glass"
                    style={{ marginBottom: '1.5rem', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}
                >
                    <Input
                        icon={SearchIcon}
                        label="Search services"
                        placeholder="e.g. Home Cleaning, Plumber, Electrician"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                </motion.div>

                {/* Animated Filter Chips */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                    {categories.map((category, index) => (
                        <motion.button
                            key={category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category)}
                            className={selectedCategory === category ? 'ripple' : ''}
                            style={{
                                padding: '0 16px',
                                height: '36px',
                                borderRadius: 'var(--radius-lg)',
                                border: 'none',
                                background: selectedCategory === category 
                                    ? 'linear-gradient(135deg, #D63864 0%, #F97316 100%)' 
                                    : 'white',
                                color: selectedCategory === category ? 'white' : '#666',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: selectedCategory === category 
                                    ? '0 4px 12px rgba(232, 69, 69, 0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.06)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {selectedCategory === category && <Filter size={14} />}
                            {category}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Animated Results Grid */}
            {loading ? (
                <div className="flex-center" style={{ padding: '4rem' }}>
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{ 
                            width: '48px', 
                            height: '48px', 
                            border: '4px solid rgba(232, 69, 69, 0.2)', 
                            borderTopColor: '#D63864', 
                            borderRadius: '50%' 
                        }}
                    />
                </div>
            ) : filteredServices.length > 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
                >
                    {filteredServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover-lift"
                        >
                            <ServiceCard service={service} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass"
                    style={{ textAlign: 'center', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)' }}
                >
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        opacity: 0.2
                    }}>
                        <SearchIcon size={40} color="white" />
                    </div>
                    <p className="body-large" style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                        No services found
                    </p>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        Try adjusting your filters or search term
                    </p>
                    <Button 
                        variant="primary" 
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    >
                        Clear All Filters
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default Search;
