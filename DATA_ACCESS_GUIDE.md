# 🔍 LocalSkillHub - Data Access & Verification Guide

## 📊 Where Your Data is Stored

All data is stored in **Supabase** (PostgreSQL database). Here's where everything lives:

---

## 🗄️ Database Tables

### 1. **`auth.users`** (Supabase Auth)
- **What it stores**: Email, encrypted password, authentication metadata
- **Where to access**: Supabase Dashboard → Authentication → Users
- **Contains**:
  - `id` - Unique user ID
  - `email` - User's email
  - `user_metadata` - Contains `full_name` and `role`
  - `created_at` - Signup timestamp

### 2. **`public.profiles`** (Your main user table)
- **What it stores**: User profiles (both clients and providers)
- **Where to access**: Supabase Dashboard → Table Editor → profiles
- **Contains**:
  ```
  id          | UUID (matches auth.users.id)
  email       | Email address
  full_name   | Display name
  role        | 'user' or 'provider'
  avatar_url  | Profile picture URL
  bio         | About text
  phone       | Contact number
  location    | City/area
  created_at  | Account creation date
  ```

### 3. **`public.services`** (Provider listings)
- **What it stores**: Services offered by providers
- **Where to access**: Supabase Dashboard → Table Editor → services
- **Contains**:
  ```
  id           | UUID
  provider_id  | Links to profiles.id
  title        | Service name
  description  | Details
  category     | Cleaning, Plumbing, etc.
  price        | Cost in ₹
  image_url    | Service photo
  created_at   | Listed date
  ```

### 4. **`public.bookings`** (User requests)
- **What it stores**: All booking transactions
- **Where to access**: Supabase Dashboard → Table Editor → bookings
- **Contains**:
  ```
  id           | UUID
  user_id      | Client who booked
  provider_id  | Provider being booked
  service_id   | Which service
  status       | pending/accepted/completed/cancelled
  booking_date | Scheduled date
  booking_time | Scheduled time
  total_price  | Final amount
  created_at   | Request time
  ```

### 5. **`public.reviews`** (Ratings & feedback)
- **What it stores**: User reviews after job completion
- **Where to access**: Supabase Dashboard → Table Editor → reviews

---

## 🔑 How to Access Your Data

### **Method 1: Supabase Dashboard** (Easiest)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **Table Editor** in sidebar
4. Select table:
   - `profiles` → See all users and providers
   - `services` → See all listings
   - `bookings` → See all transactions

#### To Filter Users vs Providers:
- In `profiles` table, click **Filter** button
- Add filter: `role` → `equals` → `provider` (or `user`)

### **Method 2: SQL Editor** (Advanced)

In Supabase Dashboard → SQL Editor, run:

```sql
-- See all providers
SELECT * FROM profiles WHERE role = 'provider';

-- See all users (clients)
SELECT * FROM profiles WHERE role = 'user';

-- See providers with their services
SELECT 
  p.full_name, 
  p.email, 
  p.location,
  COUNT(s.id) as total_services
FROM profiles p
LEFT JOIN services s ON s.provider_id = p.id
WHERE p.role = 'provider'
GROUP BY p.id;

-- See all bookings with details
SELECT 
  b.id,
  b.status,
  b.booking_date,
  client.full_name as client_name,
  provider.full_name as provider_name,
  s.title as service_name,
  b.total_price
FROM bookings b
JOIN profiles client ON b.user_id = client.id
JOIN profiles provider ON b.provider_id = provider.id
JOIN services s ON b.service_id = s.id
ORDER BY b.created_at DESC;
```

### **Method 3: In Your App** (I'm creating this now!)

I'll create an **Admin Dashboard** page that shows:
- Total users and providers
- Recent signups
- All bookings
- Statistics

---

## 🔐 How Roles Work

### During Signup:
1. User selects role: "I need a Service" (user) or "I provide Services" (provider)
2. Role stored in `auth.users.user_metadata.role`
3. Database trigger `handle_new_user()` copies role to `profiles.role`

### In the App:
```javascript
// Check user role
const isProvider = user.user_metadata?.role === 'provider';

// Or from profile
const isProvider = profile?.role === 'provider';
```

### Features by Role:

| Feature | User (Client) | Provider |
|---------|---------------|----------|
| Browse Services | ✅ | ✅ |
| Book Services | ✅ | ❌ |
| Create Services | ❌ | ✅ |
| Receive Bookings | ❌ | ✅ |
| Accept/Decline | ❌ | ✅ |
| Leave Reviews | ✅ | ❌ |

---

## 🔍 Testing the Workflow

### Test as Provider:
1. **Signup**: Choose "I provide Services"
2. **Create Service**: Go to Dashboard → New Service
3. **Wait for Bookings**: Check Dashboard → Upcoming
4. **Accept/Decline**: Click buttons on booking cards

### Test as User:
1. **Signup**: Choose "I need a Service"
2. **Browse**: Go to Search page
3. **Book**: Click service → Fill form → Book Now
4. **Track**: Check Dashboard → Upcoming

### Verify in Database:
- Check `profiles` table → See role column
- Check `services` table → See provider_id matches
- Check `bookings` table → See user_id, provider_id, status

---

## 🛠️ Current Issues & Fixes Needed

### ✅ Working:
- User/Provider role selection
- Profile creation via trigger
- Service creation by providers
- Booking display on Dashboard

### ⚠️ Needs Verification:
- Booking creation flow (need to check ServiceDetails page)
- Status update buttons (Accept/Decline)
- Provider_id in bookings table

Let me check these now and create the Admin Dashboard!

---

## 📱 Quick Verification Steps

1. **Open Supabase Dashboard**
2. **Table Editor → profiles**
3. You'll see columns: `id`, `email`, `full_name`, `role`
4. **Filter by role = 'provider'** to see providers
5. **Filter by role = 'user'** to see clients

---

## 🎯 Next: I'm Creating

1. **Admin Dashboard Page** - View all users/providers in the app
2. **Profile Page** - Users can edit their info
3. **Verification Fixes** - Ensure booking flow works perfectly
