import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import FloatingParticles from './components/FloatingParticles';
import GlowCursor from './components/GlowCursor';
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
  
  return (
    <div className="app">
      <FloatingParticles count={25} />
      <GlowCursor />
      <Navbar />
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
      {user && <BottomNav userRole={user.user_metadata?.role} />}
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
