import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

const TOKEN_KEY = 'zf_user';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredUser extends User {
  loginTime: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  phoneNumber: string | null;
  verifyOtp: (code: string) => Promise<boolean>;
  login: (phone: string, email?: string, role?: 'admin' | 'client') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return null;
    
    const storedUser: StoredUser = JSON.parse(stored);
    const isExpired = Date.now() - storedUser.loginTime > SESSION_DURATION_MS;
    
    if (isExpired) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loginTime: _loginTime, ...userData } = storedUser;
    return userData as User;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isInitializing] = useState(false);

  const login = (phone: string, email?: string, role: 'admin' | 'client' = 'client') => {
    const mockUser: User = {
      id: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: role === 'admin' ? 'Admin System' : 'John Doe',
      accountNumber: role === 'admin' ? 'ADMIN-001' : 'ZM-882910',
      phone: phone,
      email: email || (role === 'admin' ? 'admin@targeteveryone.com' : 'john.doe@example.com'),
      creditScore: role === 'admin' ? 850 : 720,
      role: role,
    };
    
    const storedUser: StoredUser = { ...mockUser, loginTime: Date.now() };
    setUser(mockUser);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(storedUser));
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return false;
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}