import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  phoneNumber: string | null;
  verifyOtp: (code: string) => Promise<boolean>;
  login: (phone: string, pin: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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
  }, []);

  const login = (phone: string, _pin: string) => {
    const isAdmin = phone === '0999999999'; // Example admin phone number
    const mockUser: User = {
      id: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: isAdmin ? 'Admin System' : 'John Doe',
      accountNumber: isAdmin ? 'ADMIN-001' : 'ZM-882910',
      phone: phone,
      email: isAdmin ? 'admin@fastloans.com' : 'john.doe@example.com',
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, phoneNumber: user?.phone || null, verifyOtp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}