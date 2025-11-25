-- ============================================
-- LocalSkillHub Database Setup Script
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text,
  full_name text,
  role text CHECK (role IN ('user', 'provider')),
  avatar_url text,
  bio text,
  phone text,
  location text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id uuid REFERENCES public.profiles(id) NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  price numeric NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Services are viewable by everyone." ON services;
CREATE POLICY "Services are viewable by everyone."
  ON services FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Providers can insert their own services." ON services;
CREATE POLICY "Providers can insert their own services."
  ON services FOR INSERT
  WITH CHECK ( auth.uid() = provider_id );

DROP POLICY IF EXISTS "Providers can update their own services." ON services;
CREATE POLICY "Providers can update their own services."
  ON services FOR UPDATE
  USING ( auth.uid() = provider_id );

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  provider_id uuid REFERENCES public.profiles(id) NOT NULL,
  service_id uuid REFERENCES public.services(id) NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')) DEFAULT 'pending',
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bookings." ON bookings;
CREATE POLICY "Users can view their own bookings."
  ON bookings FOR SELECT
  USING ( auth.uid() = user_id OR auth.uid() = provider_id );

DROP POLICY IF EXISTS "Users can create bookings." ON bookings;
CREATE POLICY "Users can create bookings."
  ON bookings FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Providers can update booking status." ON bookings;
CREATE POLICY "Providers can update booking status."
  ON bookings FOR UPDATE
  USING ( auth.uid() = provider_id );

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) NOT NULL,
  reviewer_id uuid REFERENCES public.profiles(id) NOT NULL,
  provider_id uuid REFERENCES public.profiles(id) NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are viewable by everyone." ON reviews;
CREATE POLICY "Reviews are viewable by everyone."
  ON reviews FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can create reviews for their bookings." ON reviews;
CREATE POLICY "Users can create reviews for their bookings."
  ON reviews FOR INSERT
  WITH CHECK ( auth.uid() = reviewer_id );

-- ============================================
-- MESSAGES TABLE (CHAT SYSTEM)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) NOT NULL,
  message text NOT NULL,
  message_type text CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
  attachment_url text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages they are part of." ON messages;
CREATE POLICY "Users can view messages they are part of."
  ON messages FOR SELECT
  USING ( auth.uid() = sender_id OR auth.uid() = receiver_id );

DROP POLICY IF EXISTS "Users can send messages." ON messages;
CREATE POLICY "Users can send messages."
  ON messages FOR INSERT
  WITH CHECK ( auth.uid() = sender_id );

DROP POLICY IF EXISTS "Users can mark messages as read." ON messages;
CREATE POLICY "Users can mark messages as read."
  ON messages FOR UPDATE
  USING ( auth.uid() = receiver_id );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications." ON notifications;
CREATE POLICY "Users can view their own notifications."
  ON notifications FOR SELECT
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can update their own notifications." ON notifications;
CREATE POLICY "Users can update their own notifications."
  ON notifications FOR UPDATE
  USING ( auth.uid() = user_id );

-- ============================================
-- OTP VERIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) NOT NULL UNIQUE,
  otp_code text NOT NULL,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  provider_id uuid REFERENCES public.profiles(id) NOT NULL,
  verified boolean DEFAULT false,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view OTPs for their bookings." ON otp_verifications;
CREATE POLICY "Users can view OTPs for their bookings."
  ON otp_verifications FOR SELECT
  USING ( auth.uid() = user_id OR auth.uid() = provider_id );

DROP POLICY IF EXISTS "Providers can create OTPs." ON otp_verifications;
CREATE POLICY "Providers can create OTPs."
  ON otp_verifications FOR INSERT
  WITH CHECK ( auth.uid() = provider_id );

DROP POLICY IF EXISTS "Users can update OTPs (verify)." ON otp_verifications;
CREATE POLICY "Users can update OTPs (verify)."
  ON otp_verifications FOR UPDATE
  USING ( auth.uid() = user_id OR auth.uid() = provider_id );

-- ============================================
-- TRIGGER: CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- ENABLE REALTIME FOR MESSAGES
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================
-- STORAGE BUCKET FOR SERVICE IMAGES
-- ============================================
-- Run this in Storage section of Supabase Dashboard
-- Create bucket named: service-images
-- Make it public with policy: allow all authenticated users to upload

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Database setup complete! All tables, policies, and triggers created successfully.' AS status;
