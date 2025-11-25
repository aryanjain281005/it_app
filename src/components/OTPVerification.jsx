import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, X, Shield } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import toast from 'react-hot-toast';

const OTPVerification = ({ booking, onClose, onVerified }) => {
    const { user } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [generatedOTP, setGeneratedOTP] = useState(null);
    const isProvider = user.id === booking.provider_id;

    useEffect(() => {
        if (isProvider) {
            generateAndSendOTP();
        } else {
            fetchOTP();
        }
    }, []);

    const generateAndSendOTP = async () => {
        try {
            // Generate 6-digit OTP
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

            // Check if OTP already exists for this booking
            const { data: existing } = await supabase
                .from('otp_verifications')
                .select('*')
                .eq('booking_id', booking.id)
                .single();

            if (existing) {
                // Update existing OTP
                const { error } = await supabase
                    .from('otp_verifications')
                    .update({
                        otp_code: otpCode,
                        expires_at: expiresAt.toISOString(),
                        verified: false,
                    })
                    .eq('booking_id', booking.id);

                if (error) throw error;
            } else {
                // Create new OTP
                const { error } = await supabase
                    .from('otp_verifications')
                    .insert([
                        {
                            booking_id: booking.id,
                            otp_code: otpCode,
                            user_id: booking.user_id,
                            provider_id: booking.provider_id,
                            expires_at: expiresAt.toISOString(),
                        },
                    ]);

                if (error) throw error;
            }

            setGeneratedOTP(otpCode);
            
            // Send notification to user
            await supabase.from('notifications').insert([
                {
                    user_id: booking.user_id,
                    title: 'Service Completion OTP',
                    body: `Your OTP for service completion is: ${otpCode}`,
                    type: 'otp',
                    data: { booking_id: booking.id, otp: otpCode },
                },
            ]);

            toast.success('OTP sent to customer!');
        } catch (error) {
            console.error('Error generating OTP:', error);
            toast.error('Failed to generate OTP');
        }
    };

    const fetchOTP = async () => {
        try {
            const { data, error } = await supabase
                .from('otp_verifications')
                .select('*')
                .eq('booking_id', booking.id)
                .single();

            if (error) throw error;
            if (data) {
                setGeneratedOTP(data.otp_code);
            }
        } catch (error) {
            console.error('Error fetching OTP:', error);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) return;
        if (value && !/^\d$/.test(value)) return; // Only allow digits

        const newOTP = [...otp];
        newOTP[index] = value;
        setOtp(newOTP);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const verifyOTP = async () => {
        const enteredOTP = otp.join('');
        if (enteredOTP.length !== 6) {
            toast.error('Please enter complete OTP');
            return;
        }

        setLoading(true);
        try {
            // Fetch and verify OTP
            const { data: otpData, error: fetchError } = await supabase
                .from('otp_verifications')
                .select('*')
                .eq('booking_id', booking.id)
                .single();

            if (fetchError) throw fetchError;

            if (!otpData) {
                toast.error('OTP not found');
                return;
            }

            // Check if OTP is expired
            if (new Date(otpData.expires_at) < new Date()) {
                toast.error('OTP has expired');
                return;
            }

            // Check if OTP matches
            if (otpData.otp_code !== enteredOTP) {
                toast.error('Invalid OTP');
                return;
            }

            // Mark OTP as verified
            const { error: updateError } = await supabase
                .from('otp_verifications')
                .update({ verified: true })
                .eq('booking_id', booking.id);

            if (updateError) throw updateError;

            // Update booking status to completed
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({ status: 'completed' })
                .eq('id', booking.id);

            if (bookingError) throw bookingError;

            toast.success('Service completed successfully!');
            onVerified();
            onClose();
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
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
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <Card style={{ padding: '2rem', position: 'relative' }}>
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
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                }}
                            >
                                <Shield size={30} color="white" />
                            </div>
                            <h2 className="title-large" style={{ marginBottom: '0.5rem' }}>
                                {isProvider ? 'OTP Generated' : 'Enter OTP'}
                            </h2>
                            <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                {isProvider
                                    ? 'Share this OTP with the customer to complete the service'
                                    : 'Enter the OTP provided by the service provider'}
                            </p>
                        </div>

                        {isProvider && generatedOTP ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '2rem 1rem',
                                    background: 'var(--md-sys-color-surface-variant)',
                                    borderRadius: 'var(--radius-lg)',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '2.5rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.5rem',
                                        color: 'var(--md-sys-color-primary)',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {generatedOTP}
                                </div>
                                <p className="body-small" style={{ marginTop: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    Valid for 10 minutes
                                </p>
                            </div>
                        ) : (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOTPChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            style={{
                                                width: '50px',
                                                height: '60px',
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                textAlign: 'center',
                                                border: '2px solid var(--md-sys-color-outline)',
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--md-sys-color-surface)',
                                                color: 'var(--md-sys-color-on-surface)',
                                                fontFamily: 'monospace',
                                            }}
                                            disabled={loading}
                                        />
                                    ))}
                                </div>
                                <Button
                                    variant="filled"
                                    fullWidth
                                    onClick={verifyOTP}
                                    disabled={loading || otp.join('').length !== 6}
                                    style={{ height: '48px' }}
                                >
                                    {loading ? 'Verifying...' : 'Verify & Complete Service'}
                                </Button>
                            </div>
                        )}

                        {isProvider && (
                            <div style={{ textAlign: 'center' }}>
                                <Button variant="text" onClick={generateAndSendOTP} size="sm">
                                    Regenerate OTP
                                </Button>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OTPVerification;
