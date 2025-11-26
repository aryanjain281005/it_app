import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Loader, ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { pickImage, uploadImage } from '../lib/capacitorUtils';
import toast from 'react-hot-toast';

const CATEGORIES = [
    'Home Repair', 'Electrical', 'Plumbing', 'Cleaning',
    'Tutoring', 'Photography', 'Design', 'Beauty', 'Other'
];

// Cool default images for each category
const DEFAULT_IMAGES = {
    'Home Repair': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    'Electrical': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
    'Plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800',
    'Cleaning': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800',
    'Tutoring': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    'Photography': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800',
    'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    'Beauty': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'Other': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800'
};

const CreateService = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Home Repair',
        price: '',
        description: '',
        image_url: '',
        pricing_type: 'fixed',
        hourly_rate: '',
        min_hours: '',
        rush_charge_percentage: '0'
    });
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImagePick = async () => {
        try {
            setUploadingImage(true);
            const imageDataUrl = await pickImage();
            setSelectedImage(imageDataUrl);
            
            // Upload to Supabase Storage
            const imageUrl = await uploadImage(supabase, imageDataUrl, 'service-images');
            setFormData({ ...formData, image_url: imageUrl });
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error picking image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setFormData({ ...formData, image_url: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Use uploaded image or default category image
            const imageUrl = formData.image_url || DEFAULT_IMAGES[formData.category];

            const serviceData = {
                provider_id: user.id,
                title: formData.title,
                category: formData.category,
                price: parseFloat(formData.price),
                description: formData.description,
                image_url: imageUrl,
                pricing_type: formData.pricing_type,
                rush_charge_percentage: parseInt(formData.rush_charge_percentage) || 0
            };

            // Add hourly pricing fields if applicable
            if (formData.pricing_type === 'hourly') {
                serviceData.hourly_rate = parseFloat(formData.hourly_rate);
                serviceData.min_hours = parseInt(formData.min_hours) || 1;
            }

            const { error } = await supabase.from('services').insert([serviceData]);

            if (error) throw error;
            toast.success('Service created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Error creating service: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="card">
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>List a New Service</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Service Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Professional Home Cleaning"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Pricing Type */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Pricing Type</label>
                        <select
                            value={formData.pricing_type}
                            onChange={(e) => setFormData({ ...formData, pricing_type: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        >
                            <option value="fixed">Fixed Price</option>
                            <option value="hourly">Hourly Rate</option>
                            <option value="per_project">Per Project</option>
                        </select>
                    </div>

                    {/* Conditional Pricing Fields */}
                    {formData.pricing_type === 'hourly' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Hourly Rate (₹)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="500"
                                    value={formData.hourly_rate}
                                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Min Hours</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="2"
                                    value={formData.min_hours}
                                    onChange={(e) => setFormData({ ...formData, min_hours: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                {formData.pricing_type === 'per_project' ? 'Starting Price (₹)' : 'Price (₹)'}
                            </label>
                            <input
                                type="number"
                                required
                                placeholder="500"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                            />
                        </div>
                    )}

                    {/* Rush Charges */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Rush Charge (%)
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                                Optional - for urgent requests
                            </span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={formData.rush_charge_percentage}
                            onChange={(e) => setFormData({ ...formData, rush_charge_percentage: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        />
                        {parseInt(formData.rush_charge_percentage) > 0 && (
                            <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-primary)', marginTop: '0.5rem' }}>
                                Urgent requests will cost {parseInt(formData.rush_charge_percentage)}% more
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Describe what you offer..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Service Image (Optional)
                        </label>
                        <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '1rem' }}>
                            Upload your own image or we'll use a beautiful default image for your category
                        </p>

                        {selectedImage || formData.image_url ? (
                            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem' }}>
                                <img
                                    src={selectedImage || formData.image_url}
                                    alt="Service preview"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleImagePick}
                                disabled={uploadingImage}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    border: '2px dashed var(--md-sys-color-outline)',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--md-sys-color-surface-variant)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--md-sys-color-on-surface-variant)'
                                }}
                            >
                                {uploadingImage ? (
                                    <Loader className="animate-spin" size={32} />
                                ) : (
                                    <>
                                        <Upload size={32} />
                                        <span style={{ fontWeight: 500 }}>Click to upload image</span>
                                        <span style={{ fontSize: '0.875rem' }}>or use default category image</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Default Image Preview */}
                        {!selectedImage && !formData.image_url && (
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '0.5rem' }}>
                                    Default image for "{formData.category}":
                                </p>
                                <img
                                    src={DEFAULT_IMAGES[formData.category]}
                                    alt={`Default ${formData.category}`}
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-lg)',
                                        opacity: 0.7
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading || uploadingImage}>
                        {loading ? <Loader className="animate-spin" /> : 'Create Service'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateService;
