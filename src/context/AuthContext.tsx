import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  phoneNumber: string | null;
  verifyOtp: (code: string) => Promise<boolean>;
  login: (phone: string, pin: string, email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Persist user session across refreshes
  useEffect(() => {
    const saved = localStorage.getItem('zf_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('zf_user');
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (phone: string, _pin: string, email?: string) => {
    // Check for admin by phone or email
    const isAdmin = 
      phone === '0999999999' || 
      email === 'admin@targeteveryone.com' ||
      phone.includes('admin') ||
      email?.includes('admin');
    
    const mockUser: User = {
      id: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: isAdmin ? 'Admin System' : 'John Doe',
      accountNumber: isAdmin ? 'ADMIN-001' : 'ZM-882910',
      phone: phone,
      email: email || (isAdmin ? 'admin@targeteveryone.com' : 'john.doe@example.com'),
      creditScore: isAdmin ? 850 : 720,
      role: isAdmin ? 'admin' : 'client',
    };
    setUser(mockUser);
    localStorage.setItem('zf_user', JSON.stringify(mockUser));
  };

  const verifyOtp = async (_code: string) => {
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zf_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        phoneNumber: user?.phone || null,
        verifyOtp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}