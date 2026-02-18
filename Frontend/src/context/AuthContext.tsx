import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          console.log("🔐 Token found in localStorage, validating with server...");
          // Validate token with backend
          const data = await authAPI.getCurrentUser();
          
          if (data.success && data.user) {
            console.log("✅ Token valid, user authenticated:", data.user);
            setUser(data.user);
          } else {
            console.warn("⚠️ Token invalid, clearing stored token");
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          console.log("ℹ️ No token found in localStorage");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await authAPI.login(email, password);
      
      // Check if login was successful and user data exists
      if (!data.user) {
        throw new Error(data.message || 'Login failed: No user data received from server');
      }
      
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return data.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await authAPI.register(userData);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}