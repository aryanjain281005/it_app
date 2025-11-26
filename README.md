# 🎯 SkillScout

> **Connect with Local Service Providers in Your Area**

SkillScout is a modern, mobile-first platform that bridges the gap between local service providers and customers. Find verified professionals for everything from home repairs to personal training, all within your neighborhood.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Capacitor](https://img.shields.io/badge/Capacitor-7.4.4-119EFF?logo=capacitor)

---

## ✨ Features

### 🌟 **Core Features**
- **🔐 Dual Role Authentication** - Separate experiences for users and service providers
- **📱 Mobile-First Design** - Native Android app with Capacitor
- **🎨 Material Design 3** - Modern, beautiful, accessible UI
- **💬 Real-time Chat** - Instant messaging between users and providers
- **📍 Location Services** - Find services near you with geolocation
- **🔔 Push Notifications** - Stay updated on bookings and messages

### ⭐ **Rating & Review System**
- ✅ **Verified Reviews** - Only completed bookings can leave reviews
- 🏆 **Provider Reputation** - Average ratings and review counts
- 💬 **Provider Responses** - Providers can respond to reviews
- 👍 **Helpful Votes** - Community-rated review quality
- 📊 **Performance Statistics** - Track provider success metrics

### 💰 **Dynamic Pricing & Packages**
- ⏱️ **Flexible Pricing Types** - Hourly, fixed, or per-project rates
- 📦 **Service Packages** - Bundle services with discounts (e.g., "3 sessions - 10% off")
- 🌸 **Seasonal Pricing** - Automatic price adjustments for peak seasons
- ⚡ **Rush Charges** - Premium pricing for urgent requests
- 💵 **Transparent Costs** - Clear pricing breakdown before booking

### 📅 **Advanced Booking System**
- 🗓️ **Calendar View** - Visual provider availability
- ⏰ **Time Slot Selection** - Book specific time windows
- 🔄 **Recurring Bookings** - Schedule weekly/monthly services
- ❌ **Cancellation Policies** - Flexible refund policies based on notice
- 📝 **Rescheduling** - Easy booking modifications
- 🔒 **Booking Verification** - Confirmed appointments with notifications

### 📍 **Radius-Based Search**
- 🗺️ **Distance Filtering** - "Services within 5km"
- 📌 **Sort by Distance** - Find the closest providers
- 🌍 **Map View** - Visualize provider locations (coming soon)
- 🎯 **Service Area Boundaries** - Providers define coverage zones
- 📍 **GPS Integration** - Auto-detect your location

### 🔒 **Security & Privacy**
- 🔐 **Supabase Authentication** - Secure user management
- 🛡️ **Row Level Security** - Database-level access control
- ☎️ **Phone Verification** - OTP-based number validation
- 🖼️ **Profile Verification** - Avatar uploads and identity checks

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Android Studio (for mobile app)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryanjain281005/it_app.git
   cd it_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Go to your Supabase project SQL Editor
   - Run `DATABASE_SETUP_COMPLETE.sql` (for initial setup)
   - Run `DATABASE_UPGRADE_FEATURES.sql` (for advanced features)

5. **Create storage bucket for images**
   - Go to Supabase Storage
   - Create a public bucket named `service-images`
   - Enable public access

6. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

### 🧪 Test Accounts

**User Account:**
- Email: `test@user.com`
- Password: `testuser123`
- Phone: `9876543210`

**Provider Account:**
- Email: `test@provider.com`
- Password: `testprovider123`
- Phone: `9876543211`

*Use the "Fill Test User/Provider" buttons on login page for quick access!*

---

## 📱 Mobile App (Android)

### Build and Run

```bash
# Build web assets and sync with Android
npm run android

# Or manually:
npm run build
npx cap sync
npx cap open android
```

### Requirements
- Android Studio Hedgehog or later
- Android SDK 24+ (Android 7.0)
- Java Development Kit (JDK) 17

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library with latest features
- **Vite 7.2** - Lightning-fast build tool
- **Framer Motion** - Smooth animations
- **React Router 7** - Client-side routing
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications

### Backend & Infrastructure
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage
  - Row Level Security
- **Capacitor** - Native mobile functionality
  - Camera access
  - Geolocation
  - Push notifications

### Styling
- **Custom CSS** - Material Design 3 inspired
- **CSS Variables** - Themeable design system
- **Responsive Design** - Mobile-first approach

---

## 📁 Project Structure

```
skillscout/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── ServiceCard.jsx  # Service display card
│   │   ├── ReviewCard.jsx   # Review display component
│   │   └── ReviewForm.jsx   # Review submission form
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Search.jsx       # Service search
│   │   ├── ServiceDetails.jsx
│   │   ├── CreateService.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── android/                 # Capacitor Android project
├── DATABASE_SETUP_COMPLETE.sql
├── DATABASE_UPGRADE_FEATURES.sql
└── package.json
```

---

## 🗄️ Database Schema

### Core Tables
- **profiles** - User/provider information with phone, location, bio
- **services** - Service listings with pricing, images, location
- **bookings** - Appointments with time slots, recurring options
- **messages** - Real-time chat messages
- **reviews** - Verified ratings and comments with helpful votes
- **notifications** - User notifications

### Advanced Features Tables
- **service_packages** - Bundled service offerings with discounts
- **provider_time_slots** - Provider availability schedules
- **provider_blocked_dates** - Unavailable dates
- **cancellation_policies** - Service-specific refund policies

---

## 🎯 Roadmap

### Phase 1: MVP ✅
- [x] Authentication system
- [x] Service listing and search
- [x] Basic booking system
- [x] Real-time chat
- [x] Mobile app foundation

### Phase 2: Enhanced Features ✅
- [x] Rating & review system
- [x] Dynamic pricing & packages
- [x] Advanced booking with calendar
- [x] Radius-based search
- [x] Phone number verification

### Phase 3: Growth Features 🚧
- [ ] In-app payments (Stripe/Razorpay)
- [ ] Video consultations
- [ ] Identity verification
- [ ] Provider analytics dashboard
- [ ] Promo codes & referrals

### Phase 4: Scale Features 🔮
- [ ] AI-powered recommendations
- [ ] Multilingual support
- [ ] iOS app
- [ ] Background checks
- [ ] Insurance verification

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aryan Jain**
- GitHub: [@aryanjain281005](https://github.com/aryanjain281005)
- Repository: [it_app](https://github.com/aryanjain281005/it_app)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - The library for web and native user interfaces
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Capacitor](https://capacitorjs.com/) - Cross-platform native runtime
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons

---

<div align="center">
  <p>Made with ❤️ by Aryan Jain</p>
  <p>
    <a href="https://github.com/aryanjain281005/it_app/issues">Report Bug</a> •
    <a href="https://github.com/aryanjain281005/it_app/issues">Request Feature</a>
  </p>
</div>
