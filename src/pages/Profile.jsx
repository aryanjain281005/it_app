import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar_url: '',
        role: 'user'
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    email: data.email || user.email,
                    phone: data.phone || '',
                    location: data.location || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || '',
                    role: data.role || 'user'
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    phone: profile.phone,
                    location: profile.location,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url
                })
                .eq('id', user.id);

            if (error) throw error;
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="flex-center" style={{ height: '50vh' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="headline-large" style={{ marginBottom: '0.5rem' }}>My Profile</h1>
                <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Manage your account information
                </p>
            </div>

            <Card>
                {/* Avatar Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--md-sys-color-primary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={64} style={{ color: 'var(--md-sys-color-on-primary-container)' }} />
                        )}
                    </div>
                    <h2 className="title-large">{profile.full_name || 'User'}</h2>
                    <span className={`badge ${profile.role === 'provider' ? 'badge-info' : 'badge-success'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                        {profile.role === 'provider' ? 'Service Provider' : 'Customer'}
                    </span>
                </div>

                {/* Edit/View Toggle */}
                {!editing ? (
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <User size={20} style={{ color: 'var(--md-sys-color-primary)' }} />
                                    <span className="title-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Full Name</span>
                                </div>
                                <p className="body-large">{profile.full_name || 'Not set'}</p>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <Mail size={20} style={{ color: 'var(--md-sys-color-primary)' }} />
                                    <span className="title-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Email</span>
                                </div>
                                <p className="body-large">{profile.email}</p>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <Phone size={20} style={{ color: 'var(--md-sys-color-primary)' }} />
                                    <span className="title-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Phone</span>
                                </div>
                                <p className="body-large">{profile.phone || 'Not set'}</p>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={20} style={{ color: 'var(--md-sys-color-primary)' }} />
                                    <span className="title-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Location</span>
                                </div>
                                <p className="body-large">{profile.location || 'Not set'}</p>
                            </div>

                            {profile.role === 'provider' && (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Briefcase size={20} style={{ color: 'var(--md-sys-color-primary)' }} />
                                        <span className="title-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Bio</span>
                                    </div>
                                    <p className="body-large">{profile.bio || 'Not set'}</p>
                                </div>
                            )}
                        </div>

                        <Button onClick={() => setEditing(true)} style={{ width: '100%' }}>
                            Edit Profile
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <Input
                                label="Full Name"
                                icon={User}
                                type="text"
                                name="full_name"
                                value={profile.full_name}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Email"
                                icon={Mail}
                                type="email"
                                value={profile.email}
                                disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />

                            <Input
                                label="Phone Number"
                                icon={Phone}
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                value={profile.phone}
                                onChange={handleChange}
                            />

                            <Input
                                label="Location"
                                icon={MapPin}
                                type="text"
                                name="location"
                                placeholder="City, State"
                                value={profile.location}
                                onChange={handleChange}
                            />

                            <Input
                                label="Avatar URL"
                                icon={Camera}
                                type="url"
                                name="avatar_url"
                                placeholder="https://example.com/avatar.jpg"
                                value={profile.avatar_url}
                                onChange={handleChange}
                            />

                            {profile.role === 'provider' && (
                                <div>
                                    <label className="title-small" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        placeholder="Tell customers about yourself and your services..."
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: 'var(--md-sys-shape-corner-small)',
                                            border: '1px solid var(--md-sys-color-outline)',
                                            backgroundColor: 'transparent',
                                            fontFamily: 'Roboto, sans-serif',
                                            fontSize: '1rem',
                                            color: 'var(--md-sys-color-on-surface)',
                                            resize: 'vertical',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => {
                                    setEditing(false);
                                    fetchProfile();
                                }}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={loading}
                                style={{ flex: 1 }}
                            >
                                <Save size={20} style={{ marginRight: '8px' }} />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default Profile;
