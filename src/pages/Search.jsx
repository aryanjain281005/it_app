import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ServiceCard from '../components/ServiceCard';
import { Search as SearchIcon, Filter } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Search = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

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
    }, [selectedCategory]);

    const fetchServices = async () => {
        setLoading(true);
        try {
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
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="headline-medium" style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--md-sys-color-on-surface)' }}>Find Professionals</h1>

                {/* Search Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Input
                        icon={SearchIcon}
                        label="Search services"
                        placeholder="e.g. Home Cleaning"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                </div>

                {/* Filter Chips */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '0 16px',
                                height: '32px',
                                borderRadius: '8px',
                                border: selectedCategory === category ? 'none' : '1px solid var(--md-sys-color-outline)',
                                backgroundColor: selectedCategory === category ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                                color: selectedCategory === category ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {selectedCategory === category && <Filter size={14} style={{ marginRight: '6px' }} />}
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="flex-center" style={{ padding: '4rem' }}>
                    <div className="animate-spin" style={{ width: '48px', height: '48px', border: '4px solid var(--md-sys-color-surface-variant)', borderTopColor: 'var(--md-sys-color-primary)', borderRadius: '50%' }}></div>
                </div>
            ) : filteredServices.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredServices.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    <p className="body-large">No services found matching your criteria.</p>
                    <Button variant="text" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} style={{ marginTop: '1rem' }}>
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Search;
