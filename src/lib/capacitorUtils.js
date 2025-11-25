import { PushNotifications } from '@capacitor/push-notifications';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import toast from 'react-hot-toast';

// Push Notifications Setup
export const initPushNotifications = async () => {
    if (!Capacitor.isNativePlatform()) {
        console.log('Push notifications only work on native platforms');
        return;
    }

    try {
        // Request permission
        const permResult = await PushNotifications.requestPermissions();
        
        if (permResult.receive === 'granted') {
            // Register with Apple / Google to receive push via APNS/FCM
            await PushNotifications.register();
        } else {
            console.log('Push notification permission denied');
        }

        // On successful registration
        await PushNotifications.addListener('registration', (token) => {
            console.log('Push registration success, token:', token.value);
            // Send token to your backend server
            sendTokenToServer(token.value);
        });

        // On registration error
        await PushNotifications.addListener('registrationError', (error) => {
            console.error('Error on registration:', error);
        });

        // Show notification when app is in foreground
        await PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received:', notification);
            toast.success(notification.title || 'New notification');
        });

        // Handle notification tap
        await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push action performed:', notification);
            // Navigate to relevant screen based on notification data
            handleNotificationTap(notification.notification.data);
        });

    } catch (error) {
        console.error('Error initializing push notifications:', error);
    }
};

const sendTokenToServer = async (token) => {
    // TODO: Send FCM/APNS token to your backend
    console.log('Sending token to server:', token);
};

const handleNotificationTap = (data) => {
    // TODO: Navigate based on notification type
    if (data.type === 'booking') {
        window.location.href = `/dashboard`;
    } else if (data.type === 'message') {
        window.location.href = `/messages`;
    }
};

// Geolocation Functions
export const getCurrentLocation = async () => {
    try {
        const coordinates = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
        });

        return {
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
            accuracy: coordinates.coords.accuracy,
        };
    } catch (error) {
        console.error('Error getting location:', error);
        toast.error('Unable to get your location');
        throw error;
    }
};

export const watchLocation = async (callback) => {
    try {
        const watchId = await Geolocation.watchPosition(
            {
                enableHighAccuracy: true,
                timeout: 10000,
            },
            (position, err) => {
                if (err) {
                    console.error('Error watching location:', err);
                    return;
                }
                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            }
        );

        return watchId;
    } catch (error) {
        console.error('Error watching location:', error);
        throw error;
    }
};

export const clearLocationWatch = async (watchId) => {
    await Geolocation.clearWatch({ id: watchId });
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in km
};

// Camera Functions
export const takePicture = async () => {
    try {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
        });

        return image.dataUrl;
    } catch (error) {
        console.error('Error taking picture:', error);
        toast.error('Unable to take picture');
        throw error;
    }
};

export const pickImage = async () => {
    try {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Photos,
        });

        return image.dataUrl;
    } catch (error) {
        console.error('Error picking image:', error);
        toast.error('Unable to pick image');
        throw error;
    }
};

// Upload image to Supabase Storage
export const uploadImage = async (supabase, dataUrl, bucket = 'service-images') => {
    try {
        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Generate unique filename
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filename, blob, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filename);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
        throw error;
    }
};

// Haptic Feedback (for Android/iOS)
export const vibrate = (duration = 200) => {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
};

export const vibratePattern = (pattern = [200, 100, 200]) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

// Check if running on native platform
export const isNative = () => {
    return Capacitor.isNativePlatform();
};

// Get platform info
export const getPlatform = () => {
    return Capacitor.getPlatform(); // 'web', 'ios', or 'android'
};
