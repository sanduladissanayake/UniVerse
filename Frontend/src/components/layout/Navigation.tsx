import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Building, Calendar, Shield, LogOut, User, Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">UV</span>
            </div>
            <span className="font-bold text-xl text-gray-900">UniVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="w-5 h-5 mr-1" />
              Home
            </Link>
            <Link to="/clubs" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <Building className="w-5 h-5 mr-1" />
              Clubs
            </Link>
            <Link to="/events" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <Calendar className="w-5 h-5 mr-1" />
              Events
            </Link>

            {/* Admin Links */}
            {user?.role === 'SUPER_ADMIN' && (
              <Link 
                to="/admin/super" 
                className="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                <Shield className="w-5 h-5 mr-1" />
                Admin Panel
              </Link>
            )}
            {user?.role === 'CLUB_ADMIN' && (
              <Link 
                to="/admin/club" 
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                  className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              <Link 
                to="/clubs" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <Building className="w-5 h-5 mr-2" />
                Clubs
              </Link>
              <Link 
                to="/events" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Events
              </Link>

              {user?.role === 'SUPER_ADMIN' && (
                <Link 
                  to="/admin/super" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-purple-600"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Panel
                </Link>
              )}
              {user?.role === 'CLUB_ADMIN' && (
                <Link 
                  to="/admin/club" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-blue-600"
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
                      className="flex items-center text-red-600 w-full"
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
                    className="block text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700"
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