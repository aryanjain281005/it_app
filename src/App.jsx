import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import FloatingParticles from './components/FloatingParticles';
import GlowCursor from './components/GlowCursor';
import { SkipToContent, createScreenReaderAnnouncer, usePrefersReducedMotion } from './lib/accessibility.jsx';
import { initPushNotifications, isNative } from './lib/capacitorUtils';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import CreateService from './pages/CreateService';
import AdminView from './pages/AdminView';

import ServiceDetails from './pages/ServiceDetails';
import ReviewBooking from './pages/ReviewBooking';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}><div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--md-sys-color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// App Content with Premium Effects
const AppContent = () => {
  const { user } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  useEffect(() => {
    // Initialize accessibility announcer
    createScreenReaderAnnouncer();
    
    // Initialize push notifications on native platforms
    if (isNative()) {
      initPushNotifications();
    }
  }, []);
  
  return (
    <div className="app">
      <SkipToContent />
      {!prefersReducedMotion && <FloatingParticles count={25} />}
      {!prefersReducedMotion && <GlowCursor />}
      <Navbar />
      <main id="main-content" role="main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminView />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-service"
          element={
            <ProtectedRoute>
              <CreateService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:bookingId"
          element={
            <ProtectedRoute>
              <ReviewBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      </main>
      {user && <BottomNav userRole={user.user_metadata?.role} />}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          },
          success: {
            iconTheme: {
              primary: '#27AE60',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#D63864',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
