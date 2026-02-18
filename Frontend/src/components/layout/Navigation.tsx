import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Building, Calendar, Shield, LogOut, User, Menu, X, Bell } from 'lucide-react';
import { membershipAPI, announcementAPI } from '../../services/api';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [announcementCount, setAnnouncementCount] = useState(0);

  useEffect(() => {
    if (user?.id && user?.role === 'STUDENT') {
      fetchAnnouncementCount();
    }
  }, [user?.id]);

  const fetchAnnouncementCount = async () => {
    try {
      if (!user?.id) return;

      // Fetch user's club memberships
      const membershipsResponse = await membershipAPI.getUserMemberships(user.id);
      const membershipsList = Array.isArray(membershipsResponse)
        ? membershipsResponse
        : (membershipsResponse.memberships || membershipsResponse.data || []);

      if (membershipsList.length === 0) {
        setAnnouncementCount(0);
        return;
      }

      // Fetch announcements from all user's clubs
      let totalAnnouncements = 0;
      for (const membership of membershipsList) {
        const announcementsResponse = await announcementAPI.getPublishedAnnouncementsByClub(membership.clubId);
        const announcements = Array.isArray(announcementsResponse)
          ? announcementsResponse
          : (announcementsResponse.announcements || announcementsResponse.data || []);
        totalAnnouncements += announcements.length;
      }

      setAnnouncementCount(totalAnnouncements);
    } catch (err) {
      console.error('Failed to fetch announcement count:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #00897b, #0097a7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="UniVerse Logo" 
              className="w-10 h-10 rounded-full"
            />
            <span className="font-bold text-xl text-gray-900">
              Uni<span className="gradient-text">Verse</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105">
              <Home className="w-5 h-5 mr-1" />
              Home
            </Link>
            <Link to="/clubs" className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105">
              <Building className="w-5 h-5 mr-1" />
              Clubs
            </Link>
            <Link to="/events" className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105">
              <Calendar className="w-5 h-5 mr-1" />
              Events
            </Link>

            {/* Announcements Link with Badge */}
            {user?.role === 'STUDENT' && (
              <Link to="/announcements" className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105 relative">
                <Bell className="w-5 h-5 mr-1" />
                Announcements
                {announcementCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {announcementCount > 9 ? '9+' : announcementCount}
                  </span>
                )}
              </Link>
            )}

            {/* Admin Links */}
            {user?.role === 'SUPER_ADMIN' && (
              <Link 
                to="/admin/super" 
                className="flex items-center text-purple-600 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-1" />
                Admin Panel
              </Link>
            )}
            {user?.role === 'CLUB_ADMIN' && (
              <Link 
                to="/admin/club" 
                className="flex items-center text-blue-600 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-1" />
                My Club
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700 border-l pl-4">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">{user.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-teal-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              <Link 
                to="/clubs" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
              >
                <Building className="w-5 h-5 mr-2" />
                Clubs
              </Link>
              <Link 
                to="/events" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Events
              </Link>

              {user?.role === 'STUDENT' && (
                <Link 
                  to="/announcements" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105 relative"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Announcements
                  {announcementCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {announcementCount > 9 ? '9+' : announcementCount}
                    </span>
                  )}
                </Link>
              )}

              {user?.role === 'SUPER_ADMIN' && (
                <Link 
                  to="/admin/super" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-purple-600 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Panel
                </Link>
              )}
              {user?.role === 'CLUB_ADMIN' && (
                <Link 
                  to="/admin/club" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-blue-600 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  My Club
                </Link>
              )}

              {user ? (
                <>
                  <div className="pt-4 border-t">
                    <div className="flex items-center text-gray-700 mb-4">
                      <User className="w-5 h-5 mr-2" />
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-red-600 w-full px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-teal-900 hover:shadow-lg hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-yellow-400 text-teal-900 px-4 py-2 rounded-lg text-center hover:bg-yellow-300 font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};