import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

// Mock Data
const MOCK_USER = { id: 'user-123', email: 'demo@example.com' };
const MOCK_PROFILE = {
    id: 'user-123',
    full_name: 'Demo User',
    role: 'user',
    location: 'Mumbai',
    avatar_url: null
};

const MOCK_SERVICES = [
    {
        id: '1',
        title: 'Professional Home Cleaning',
        description: 'Deep cleaning for 2BHK apartments. Includes floor scrubbing, dusting, and bathroom cleaning.',
        price: 499,
        category: 'Cleaning',
        image_url: 'https://images.unsplash.com/photo-1581578731117-104f2a412727?q=80&w=1000&auto=format&fit=crop',
        provider_id: 'prov-1',
        profiles: { full_name: 'Rajesh Cleaners', location: 'Andheri West' }
    },
    {
        id: '2',
        title: 'Expert Electrician',
        description: 'Fixing wiring, fan installation, and switchboard repairs. Certified professional.',
        price: 299,
        category: 'Electrical',
        image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
        provider_id: 'prov-2',
        profiles: { full_name: 'Amit Electric', location: 'Bandra' }
    },
    {
        id: '3',
        title: 'Math Tutor - Class 10',
        description: 'Experienced math tutor for CBSE/ICSE boards. 1-hour session.',
        price: 800,
        category: 'Tutoring',
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
        provider_id: 'prov-3',
        profiles: { full_name: 'Priya Sharma', location: 'Online' }
    }
];

const MOCK_BOOKINGS = [
    {
        id: 'b-1',
        status: 'completed',
        booking_date: '2023-11-20',
        booking_time: '14:00',
        total_price: 499,
        services: { title: 'Professional Home Cleaning' },
        profiles_provider: { full_name: 'Rajesh Cleaners' }
    }
];

// Mock Client Implementation
const createMockBuilder = (data) => {
    const builder = {
        data,
        error: null,
        // Promise interface
        then: (resolve) => resolve({ data, error: null }),
        // Chainable methods
        eq: (col, val) => {
            if (col === 'id') return createMockBuilder(Array.isArray(data) ? data.find(d => d.id === val) : data);
            if (col === 'category') return createMockBuilder(data.filter(d => d.category === val));
            return createMockBuilder(data);
        },
        order: () => createMockBuilder(data),
        single: () => createMockBuilder(Array.isArray(data) ? data[0] : data),
        select: () => builder // Handle nested select if needed
    };
    return builder;
};

const mockClient = {
    auth: {
        getSession: async () => ({ data: { session: { user: MOCK_USER } } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithPassword: async () => ({ data: { user: MOCK_USER }, error: null }),
        signUp: async () => ({ data: { user: MOCK_USER }, error: null }),
        signOut: async () => { },
    },
    from: (table) => {
        let initialData = [];
        if (table === 'services') initialData = MOCK_SERVICES;
        if (table === 'bookings') initialData = MOCK_BOOKINGS;
        if (table === 'profiles') initialData = MOCK_PROFILE;

        return {
            select: () => createMockBuilder(initialData),
            insert: async () => ({ error: null }),
            update: async () => ({ eq: () => ({}) })
        };
    }
};

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here') {
    client = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('Supabase credentials missing. Using Mock Data.');
    client = mockClient;
}

export const supabase = client;
