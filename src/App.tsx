import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Signup } from './pages/Signup/Signup';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { Onboarding } from './pages/Onboarding/Onboarding';
import { AppShell } from './components/layout/AppShell';
import { Advice } from './pages/Advice/Advice';
import Monitoring from './pages/Monitoring/Monitoring';
import Analytics from './pages/Analytics/Analytics';
import { Borewell, Soil, Energy, Weather, Schedule, Alerts, History, Farm, Settings } from './pages/PlaceholderPages';
import { LanguageProvider } from './i18n/LanguageContext';

const ProtectedRoute = ({ children, requireOnboarding = true }: { children: React.ReactNode, requireOnboarding?: boolean }) => {
  const { isAuthenticated } = useAuth();
  const { farmProfile, isInitializingProfile } = useOnboarding();
  const hasProfile = Object.keys(farmProfile).length > 0;

  if (isInitializingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="w-8 h-8 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireOnboarding && !hasProfile) {
    return <Navigate to="/onboarding" replace />;
  }

  // Allow users to revisit /onboarding to edit their profile
  // even if they already have one.
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { farmProfile, isInitializingProfile } = useOnboarding();
  const hasProfile = Object.keys(farmProfile).length > 0;

  if (isAuthenticated && isInitializingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="w-8 h-8 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to={hasProfile ? "/dashboard" : "/onboarding"} replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute requireOnboarding={false}>
            <Onboarding />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireOnboarding={true}>
            <AppShell><Dashboard /></AppShell>
          </ProtectedRoute>
        } 
      />

      {/* Application Shell Routes */}
      <Route path="/advice" element={<ProtectedRoute requireOnboarding={true}><AppShell><Advice /></AppShell></ProtectedRoute>} />
      <Route path="/borewell" element={<ProtectedRoute requireOnboarding={true}><AppShell><Borewell /></AppShell></ProtectedRoute>} />
      <Route path="/soil" element={<ProtectedRoute requireOnboarding={true}><AppShell><Soil /></AppShell></ProtectedRoute>} />
      <Route path="/energy" element={<ProtectedRoute requireOnboarding={true}><AppShell><Energy /></AppShell></ProtectedRoute>} />
      <Route path="/weather" element={<ProtectedRoute requireOnboarding={true}><AppShell><Weather /></AppShell></ProtectedRoute>} />
      <Route path="/monitoring" element={<ProtectedRoute requireOnboarding={true}><AppShell><Monitoring /></AppShell></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute requireOnboarding={true}><AppShell><Schedule /></AppShell></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute requireOnboarding={true}><AppShell><Alerts /></AppShell></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute requireOnboarding={true}><AppShell><History /></AppShell></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute requireOnboarding={true}><AppShell><Analytics /></AppShell></ProtectedRoute>} />
      <Route path="/farm" element={<ProtectedRoute requireOnboarding={true}><AppShell><Farm /></AppShell></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute requireOnboarding={true}><AppShell><Settings /></AppShell></ProtectedRoute>} />
      
      {/* Catch all route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <OnboardingProvider>
            <AppRoutes />
          </OnboardingProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
