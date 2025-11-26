-- ================================================
-- SKILLSCOUT - ADVANCED FEATURES DATABASE UPGRADE
-- ================================================
-- This script adds:
-- 1. Rating & Review System (Enhanced)
-- 2. Dynamic Pricing & Packages
-- 3. Advanced Booking System
-- 4. Radius-Based Search Support
-- ================================================

-- ============================================
-- 1. ENHANCE REVIEWS TABLE
-- ============================================

-- Add verified column and helpful votes to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response TEXT,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;

-- Create index for faster review queries
CREATE INDEX IF NOT EXISTS idx_reviews_service_rating ON reviews(service_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified) WHERE verified = true;

-- Function to automatically verify reviews from completed bookings
CREATE OR REPLACE FUNCTION verify_review_from_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Only verify if the booking is completed and user has actually used the service
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE id = NEW.booking_id 
    AND status = 'completed' 
    AND user_id = NEW.user_id
  ) THEN
    NEW.verified := TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to verify reviews
DROP TRIGGER IF EXISTS trigger_verify_review ON reviews;
CREATE TRIGGER trigger_verify_review
  BEFORE INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION verify_review_from_booking();

-- ============================================
-- 2. PRICING TYPES & PACKAGES
-- ============================================

-- Create pricing types enum
DO $$ BEGIN
  CREATE TYPE pricing_type AS ENUM ('hourly', 'fixed', 'per_project', 'package');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add pricing columns to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS pricing_type pricing_type DEFAULT 'fixed',
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS min_hours INTEGER,
ADD COLUMN IF NOT EXISTS seasonal_multiplier DECIMAL(3,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS rush_charge_percentage INTEGER DEFAULT 0;

-- Create service packages table
CREATE TABLE IF NOT EXISTS service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sessions INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  validity_days INTEGER DEFAULT 90,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_service ON service_packages(service_id) WHERE is_active = true;

-- ============================================
-- 3. ADVANCED BOOKING SYSTEM
-- ============================================

-- Create booking status enum (enhanced)
DO $$ BEGIN
  CREATE TYPE booking_status_new AS ENUM (
    'pending', 'confirmed', 'in_progress', 'completed', 
    'cancelled', 'rescheduled', 'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create recurrence pattern enum
DO $$ BEGIN
  CREATE TYPE recurrence_pattern AS ENUM (
    'none', 'daily', 'weekly', 'biweekly', 'monthly'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add advanced booking columns
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS end_time TIME,
ADD COLUMN IF NOT EXISTS time_slot VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recurrence_pattern recurrence_pattern DEFAULT 'none',
ADD COLUMN IF NOT EXISTS recurrence_end_date DATE,
ADD COLUMN IF NOT EXISTS parent_booking_id UUID REFERENCES bookings(id),
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS rescheduled_from TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES service_packages(id),
ADD COLUMN IF NOT EXISTS sessions_remaining INTEGER;

-- Create time slots table for provider availability
CREATE TABLE IF NOT EXISTS provider_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_bookings INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_time_slots_provider ON provider_time_slots(provider_id, day_of_week);

-- Create blocked dates table for provider unavailability
CREATE TABLE IF NOT EXISTS provider_blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_provider ON provider_blocked_dates(provider_id, blocked_date);

-- Create cancellation policies table
CREATE TABLE IF NOT EXISTS cancellation_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  hours_before INTEGER NOT NULL,
  refund_percentage INTEGER NOT NULL CHECK (refund_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. LOCATION & RADIUS-BASED SEARCH
-- ============================================

-- Add location columns to services table (if not exist)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS service_radius_km INTEGER DEFAULT 10;

-- Add location columns to profiles table (if not exist)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

-- Create spatial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_location ON services(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude);

-- Function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL, 
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  r DECIMAL := 6371; -- Earth radius in km
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- 5. PROVIDER REPUTATION & STATISTICS
-- ============================================

-- Create provider statistics view
CREATE OR REPLACE VIEW provider_statistics AS
SELECT 
  p.id AS provider_id,
  p.full_name,
  COUNT(DISTINCT s.id) AS total_services,
  COUNT(DISTINCT b.id) AS total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) AS completed_bookings,
  COALESCE(AVG(r.rating), 0) AS average_rating,
  COUNT(DISTINCT r.id) AS total_reviews,
  COUNT(DISTINCT CASE WHEN r.verified = true THEN r.id END) AS verified_reviews,
  COALESCE(SUM(b.total_price), 0) AS total_earnings
FROM profiles p
LEFT JOIN services s ON s.user_id = p.id
LEFT JOIN bookings b ON b.service_id = s.id
LEFT JOIN reviews r ON r.service_id = s.id
WHERE p.role = 'provider'
GROUP BY p.id, p.full_name;

-- ============================================
-- 6. RLS POLICIES FOR NEW TABLES
-- ============================================

-- Service Packages Policies
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON service_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Providers can manage their service packages"
  ON service_packages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM services 
      WHERE services.id = service_packages.service_id 
      AND services.user_id = auth.uid()
    )
  );

-- Provider Time Slots Policies
ALTER TABLE provider_time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view time slots"
  ON provider_time_slots FOR SELECT
  USING (is_available = true);

CREATE POLICY "Providers can manage their time slots"
  ON provider_time_slots FOR ALL
  USING (provider_id = auth.uid());

-- Provider Blocked Dates Policies
ALTER TABLE provider_blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage their blocked dates"
  ON provider_blocked_dates FOR ALL
  USING (provider_id = auth.uid());

-- Cancellation Policies Policies
ALTER TABLE cancellation_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cancellation policies"
  ON cancellation_policies FOR SELECT
  USING (true);

CREATE POLICY "Service owners can manage cancellation policies"
  ON cancellation_policies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM services 
      WHERE services.id = cancellation_policies.service_id 
      AND services.user_id = auth.uid()
    )
  );

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to get services within radius
CREATE OR REPLACE FUNCTION get_services_within_radius(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km INTEGER DEFAULT 10,
  category_filter VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  service_id UUID,
  title VARCHAR,
  distance_km DECIMAL,
  average_rating DECIMAL,
  price DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    calculate_distance(user_lat, user_lon, s.latitude, s.longitude) AS distance_km,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    s.price
  FROM services s
  LEFT JOIN reviews r ON r.service_id = s.id
  WHERE s.latitude IS NOT NULL 
    AND s.longitude IS NOT NULL
    AND calculate_distance(user_lat, user_lon, s.latitude, s.longitude) <= radius_km
    AND (category_filter IS NULL OR s.category = category_filter)
  GROUP BY s.id, s.title, s.latitude, s.longitude, s.price
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to check provider availability
CREATE OR REPLACE FUNCTION check_provider_availability(
  p_provider_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  day_of_week INTEGER;
  is_available BOOLEAN;
BEGIN
  -- Get day of week (0=Sunday, 6=Saturday)
  day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Check if date is blocked
  IF EXISTS (
    SELECT 1 FROM provider_blocked_dates 
    WHERE provider_id = p_provider_id 
    AND blocked_date = p_date
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Check if time slot is available
  SELECT EXISTS (
    SELECT 1 FROM provider_time_slots
    WHERE provider_id = p_provider_id
    AND day_of_week = day_of_week
    AND start_time <= p_start_time
    AND end_time >= p_end_time
    AND is_available = true
  ) INTO is_available;
  
  -- Check for conflicting bookings
  IF is_available THEN
    SELECT NOT EXISTS (
      SELECT 1 FROM bookings
      WHERE service_id IN (SELECT id FROM services WHERE user_id = p_provider_id)
      AND date = p_date
      AND status NOT IN ('cancelled', 'refunded')
      AND (
        (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
      )
    ) INTO is_available;
  END IF;
  
  RETURN is_available;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate refund amount based on cancellation policy
CREATE OR REPLACE FUNCTION calculate_refund_amount(
  p_booking_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  booking_date DATE;
  booking_price DECIMAL;
  service_id UUID;
  hours_until_booking INTEGER;
  refund_percentage INTEGER := 0;
BEGIN
  -- Get booking details
  SELECT b.date, b.total_price, b.service_id
  INTO booking_date, booking_price, service_id
  FROM bookings b
  WHERE b.id = p_booking_id;
  
  -- Calculate hours until booking
  hours_until_booking := EXTRACT(EPOCH FROM (booking_date - CURRENT_DATE)) / 3600;
  
  -- Get applicable refund percentage
  SELECT cp.refund_percentage
  INTO refund_percentage
  FROM cancellation_policies cp
  WHERE cp.service_id = service_id
  AND cp.hours_before <= hours_until_booking
  ORDER BY cp.hours_before DESC
  LIMIT 1;
  
  -- Return refund amount
  RETURN (booking_price * refund_percentage / 100);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. TRIGGERS FOR AUTOMATED UPDATES
-- ============================================

-- Update service packages updated_at
CREATE OR REPLACE FUNCTION update_package_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_package_timestamp ON service_packages;
CREATE TRIGGER trigger_update_package_timestamp
  BEFORE UPDATE ON service_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_package_timestamp();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ SkillScout Advanced Features Database Upgrade Complete!';
  RAISE NOTICE '📦 Created Tables: service_packages, provider_time_slots, provider_blocked_dates, cancellation_policies';
  RAISE NOTICE '⭐ Enhanced: reviews table with verification';
  RAISE NOTICE '💰 Added: Dynamic pricing columns to services';
  RAISE NOTICE '📅 Enhanced: bookings table with advanced scheduling';
  RAISE NOTICE '📍 Added: Location columns and distance calculation';
  RAISE NOTICE '🔧 Created: Helper functions for availability and refunds';
END $$;
