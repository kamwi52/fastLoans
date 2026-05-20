import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

const TOKEN_KEY = 'zf_user';
const ACCOUNTS_KEY = 'zf_accounts';
const SIGNUP_TEMP_KEY = 'zf_signup_temp';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredUser extends User {
  loginTime: number;
}

interface SignupData {
  phone: string;
  email: string;
  name: string;
  accountNumber: string;
  pin?: string;
  verified: boolean;
  documentsUploaded: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  phoneNumber: string | null;
  signupData: SignupData | null;
  isSignupFlow: boolean;
  verifyOtp: (code: string) => Promise<boolean>;
  createAccount: (phone: string, email: string, name: string, pin: string) => Promise<boolean>;
  completeSignup: () => void;
  login: (phone: string, pin: string) => Promise<boolean>;
  updateDocumentsUploaded: (uploaded: boolean) => void;
  logout: () => void;
  resetSignupFlow: () => void;
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

function getAllAccounts(): SignupData[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAccount(account: SignupData): void {
  const accounts = getAllAccounts();
  const existingIndex = accounts.findIndex(a => a.phone === account.phone);
  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getSignupTemp(): SignupData | null {
  try {
    const stored = localStorage.getItem(SIGNUP_TEMP_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveSignupTemp(data: SignupData | null): void {
  if (data) {
    localStorage.setItem(SIGNUP_TEMP_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(SIGNUP_TEMP_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isInitializing] = useState(false);
  const signupFromStorage = getSignupTemp();
  const [signupData, setSignupData] = useState<SignupData | null>(signupFromStorage);
  const [isSignupFlow, setIsSignupFlow] = useState(!!signupFromStorage);

  const createAccount = async (phone: string, email: string, name: string, pin: string): Promise<boolean> => {
    // Check if account already exists
    const accounts = getAllAccounts();
    if (accounts.some(a => a.phone === phone)) {
      return false; // Account already exists
    }

    // Create new account data
    const newAccount: SignupData = {
      phone,
      email,
      name,
      accountNumber: 'ZM-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      pin,
      verified: false,
      documentsUploaded: false,
    };

    setSignupData(newAccount);
    saveSignupTemp(newAccount);
    setIsSignupFlow(true);
    return true;
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    // Verify OTP format (6 digits)
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return false;
    }

    // Get signup data from temp storage or state
    const currentSignupData = signupData || getSignupTemp();
    if (!currentSignupData) {
      return false;
    }

    // In a real app, you'd verify against the sent OTP
    // For now, any 6-digit code is valid
    const verifiedAccount: SignupData = { ...currentSignupData, verified: true };
    setSignupData(verifiedAccount);
    saveSignupTemp(verifiedAccount);
    saveAccount(verifiedAccount);
    return true;
  };

  const completeSignup = () => {
    const currentSignupData = signupData || getSignupTemp();
    if (currentSignupData && currentSignupData.verified) {
      const mockUser: User = {
        id: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: currentSignupData.name,
        accountNumber: currentSignupData.accountNumber,
        phone: currentSignupData.phone,
        email: currentSignupData.email,
        creditScore: 650, // New users start with lower score
        role: 'client',
        documentsUploaded: currentSignupData.documentsUploaded,
      };

      const storedUser: StoredUser = { ...mockUser, loginTime: Date.now() };
      setUser(mockUser);
      setSignupData(null);
      setIsSignupFlow(false);
      saveSignupTemp(null);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(storedUser));
    }
  };

  const login = async (phone: string, pin: string): Promise<boolean> => {
    // Check if account exists
    const accounts = getAllAccounts();
    const account = accounts.find(a => a.phone === phone && a.verified);

    if (!account) {
      return false; // Account not found or not verified
    }

    // Check PIN
    if (account.pin !== pin) {
      return false; // Wrong PIN
    }

    // Check for admin
    const isAdmin = phone.includes('admin') || account.email.toLowerCase().includes('admin');

    const mockUser: User = {
      id: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: account.name,
      accountNumber: account.accountNumber,
      phone: account.phone,
      email: account.email,
      creditScore: isAdmin ? 850 : 720,
      role: isAdmin ? 'admin' : 'client',
      documentsUploaded: account.documentsUploaded ?? false,
    };

    const storedUser: StoredUser = { ...mockUser, loginTime: Date.now() };
    setUser(mockUser);
    setSignupData(null);
    setIsSignupFlow(false);
    saveSignupTemp(null);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(storedUser));
    return true;
  };

  const updateDocumentsUploaded = (uploaded: boolean) => {
    if (!user) return;

    const accounts = getAllAccounts();
    const updatedAccounts = accounts.map((account) =>
      account.phone === user.phone ? { ...account, documentsUploaded: uploaded } : account
    );

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
    setUser({ ...user, documentsUploaded: uploaded });
  };

  const logout = () => {
    setUser(null);
    setSignupData(null);
    setIsSignupFlow(false);
    saveSignupTemp(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const resetSignupFlow = () => {
    setSignupData(null);
    setIsSignupFlow(false);
    saveSignupTemp(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        phoneNumber: user?.phone || signupData?.phone || null,
        signupData,
        isSignupFlow,
        verifyOtp,
        createAccount,
        completeSignup,
        login,
        logout,
        resetSignupFlow,
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