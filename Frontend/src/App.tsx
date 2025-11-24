import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navigation } from './components/layout/Navigation';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { SuperAdminPanel } from './components/admin/SuperAdminPanel';
import { ClubAdminPanel } from './components/admin/ClubAdminPanel';

//additional imports can be added here
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
          
          <main>
            <Routes>
              
              
              
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              
            
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/super" 
                element={
                  <ProtectedRoute requiredRole="SUPER_ADMIN">
                    <SuperAdminPanel />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/club" 
                element={
                  <ProtectedRoute requiredRole="CLUB_ADMIN">
                    <ClubAdminPanel />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p>&copy; 2025 UniVerse - University Club Management System</p>
              <p className="text-gray-400 text-sm mt-2">
                Made with ❤️ for students
              </p>
            </div>
          </footer>
        </div>
    </AuthProvider>
  );
};

export default App;