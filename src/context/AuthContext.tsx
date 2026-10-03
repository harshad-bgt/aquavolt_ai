import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/authService';

interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  isOnboarded?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  resetPassword: (identifier: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('aquavolt_token');
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (e) {
          localStorage.removeItem('aquavolt_token');
          setUser(null);
        }
      }
      setIsInitializing(false);
    };
    
    loadUser();
  }, []);

  const login = async (credentials: { identifier: string; password: string }) => {
    setIsLoading(true);
    try {
      const { access_token } = await authService.login(credentials);
      localStorage.setItem('aquavolt_token', access_token);
      const userData = await authService.getMe();
      setUser(userData);
      navigate('/dashboard');
    } catch (e: any) {
      throw new Error(e.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      await authService.signup({
        name: userData.fullName,
        mobile: userData.mobile,
        email: userData.email || undefined,
        password: userData.password
      });
      // After signup, automatically log them in
      await login({ identifier: userData.mobile, password: userData.password });
    } catch (e: any) {
      throw new Error(e.message || 'Error signing up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (identifier: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    if (identifier.toLowerCase().includes('error')) {
      throw new Error('Account not found. Please check your details or create a new account.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aquavolt_token');
    authService.logout().catch(() => {});
    navigate('/login');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="w-8 h-8 border-4 border-farm-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, resetPassword, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
