import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CoordinatorDashboard from './components/dashboards/CoordinatorDashboard';
import HODDashboard from './components/dashboards/HODDashboard';
import DeanDashboard from './components/dashboards/DeanDashboard';
import InstitutionalHeadDashboard from './components/dashboards/InstitutionalHeadDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import { USER_ROLES } from './types/types';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md animate-fade-in">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-600 mb-6">You don't have permission to view this page.</p>
      <a href="/" className="btn btn-primary inline-block">Return Home</a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}

          {/* Event Coordinator Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.EVENT_COORDINATOR]}>
                <CoordinatorDashboard />
              </ProtectedRoute>
            }
          />

          {/* HOD Dashboard */}
          <Route
            path="/hod-dashboard"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HOD]}>
                <HODDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dean Dashboard */}
          <Route
            path="/dean-dashboard"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.DEAN]}>
                <DeanDashboard />
              </ProtectedRoute>
            }
          />

          {/* Institutional Head Dashboard */}
          <Route
            path="/head-dashboard"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.INSTITUTIONAL_HEAD]}>
                <InstitutionalHeadDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin / ITC Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN_ITC]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
