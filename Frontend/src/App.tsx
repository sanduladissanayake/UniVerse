import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navigation } from './components/layout/Navigation';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ClubList } from './components/clubs/ClubList';
import { ClubDetails } from './components/clubs/ClubDetails';
import { EventList } from './components/events/EventList';
import { EventDetails } from './components/events/EventDetails';
import { SuperAdminPanel } from './components/admin/SuperAdminPanel';
import { ClubAdminPanel } from './components/admin/ClubAdminPanel';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentCancelPage } from './pages/PaymentCancelPage';
import { MembershipFormPage } from './pages/MembershipFormPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-white">
          <Navigation />
            
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Clubs Routes */}
                <Route path="/clubs" element={<ClubList />} />
                <Route path="/clubs/:id" element={<ClubDetails />} />
                
                {/* Events Routes */}
                <Route path="/events" element={<EventList />} />
                <Route path="/events/:id" element={<EventDetails />} />

                {/* Announcements Route */}
                <Route path="/announcements" element={<AnnouncementsPage />} />
              
              {/* Payment Routes */}
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-cancel" element={<PaymentCancelPage />} />
              <Route path="/membership-form" element={<MembershipFormPage />} />
              
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
          <footer className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white mt-16">
            <div className="max-w-6xl mx-auto px-8 py-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                {/* Brand Section */}
                <div>
                  <div className="text-2xl font-black mb-3 tracking-tight">
                    Uni<span className="text-yellow-300">Verse</span>
                  </div>
                  <p className="text-sm text-opacity-80 text-white leading-relaxed mb-6 max-w-sm">
                    Connect with vibrant clubs, discover amazing events, and create unforgettable memories with our university community platform.
                  </p>
                  {/* Social Links */}
                  <div className="flex gap-2 flex-wrap">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-9 h-9 rounded-full bg-white bg-opacity-15 border border-white border-opacity-25 flex items-center justify-center text-white hover:bg-yellow-300 hover:text-teal-900 hover:-translate-y-0.5 transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="w-9 h-9 rounded-full bg-white bg-opacity-15 border border-white border-opacity-25 flex items-center justify-center text-white hover:bg-yellow-300 hover:text-teal-900 hover:-translate-y-0.5 transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter / X" className="w-9 h-9 rounded-full bg-white bg-opacity-15 border border-white border-opacity-25 flex items-center justify-center text-white hover:bg-yellow-300 hover:text-teal-900 hover:-translate-y-0.5 transition">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-9 h-9 rounded-full bg-white bg-opacity-15 border border-white border-opacity-25 flex items-center justify-center text-white hover:bg-yellow-300 hover:text-teal-900 hover:-translate-y-0.5 transition">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                </div>

                {/* Contact Section */}
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-yellow-300 mb-4">Contact Us</h4>
                  
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded bg-white bg-opacity-15 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">📍</div>
                    <div className="text-sm text-white text-opacity-82 leading-relaxed">
                      Student Affairs Office<br/>Block A, Level 2, University of Kelaniya
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded bg-white bg-opacity-15 flex items-center justify-center text-sm flex-shrink-0">📧</div>
                    <div className="text-sm text-white text-opacity-82">
                      <a href="mailto:universe@university.edu" className="hover:text-yellow-300 transition">universe@university.edu</a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-white bg-opacity-15 flex items-center justify-center text-sm flex-shrink-0">📞</div>
                    <div className="text-sm text-white text-opacity-82">
                      <a href="tel:+60123456789" className="hover:text-yellow-300 transition">+94 714535667</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white border-opacity-20 pt-5 mt-11">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white text-opacity-65">
                  <span>© 2025 UniVerse – University Club Management System</span>
                  <div className="flex gap-6">
                    <a href="#" className="hover:text-yellow-300 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-yellow-300 transition">Terms of Use</a>
                    <a href="#" className="hover:text-yellow-300 transition">Support</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;