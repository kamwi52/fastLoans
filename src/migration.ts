import type { Loan, Transaction } from './types';

/**
 * Keys used for localStorage persistence
 */
export const STORAGE_KEYS = {
  ACCOUNTS: 'zf_accounts',
  LOANS: 'zf_loans',
  TRANSACTIONS: 'zf_transactions',
  USER_SESSION: 'zf_user',
  MIGRATION_VERSION: 'zf_migration_version'
};

const CURRENT_VERSION = '1.0.0';

/**
 * Seed Data: Realistic scenarios for testing
 */
const initialAccounts = [
  {
    phone: "+260912345678",
    email: "peter@example.com",
    name: "Peter Nzambi",
    accountNumber: "ZM-100200300",
    pin: "2222",
    verified: true,
    role: 'client'
  },
  {
    phone: "admin",
    email: "admin@mulongagroup.com",
    name: "System Administrator",
    accountNumber: "ZM-000000001",
    pin: "8888",
    verified: true,
    role: 'admin'
  }
];

const initialLoans: Partial<Loan>[] = [
  {
    id: 'LN-7721',
    userId: 'USR-1',
    amount: 5000,
    status: 'Active',
    type: 'Personal',
    interestRate: 5,
    balance: 3200,
    progress: 36,
    monthlyPayment: 450,
    startDate: '2024-01-10',
    endDate: '2025-01-10',
    nextPaymentDate: '2024-06-10'
  },
  {
    id: 'LN-8890',
    userId: 'USR-1',
    amount: 12000,
    status: 'Pending',
    type: 'Business',
    interestRate: 8,
    balance: 12000,
    progress: 0,
    monthlyPayment: 0,
    startDate: '-',
    endDate: '-',
    nextPaymentDate: '-'
  },
  {
    id: 'LN-4432',
    userId: 'USR-1',
    amount: 2500,
    status: 'Active',
    type: 'Education',
    interestRate: 4,
    balance: 2500,
    progress: 0,
    monthlyPayment: 210,
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    nextPaymentDate: '2024-06-01'
  },
  {
    id: 'LN-1102',
    userId: 'USR-1',
    amount: 1000,
    status: 'Closed',
    type: 'Emergency',
    interestRate: 10,
    balance: 0,
    progress: 0,
    monthlyPayment: 0,
    startDate: '2023-03-15',
    endDate: '2024-03-15',
    nextPaymentDate: '-'
  }
];

const initialTransactions: Partial<Transaction>[] = [
  { id: 'TX-001', loanId: 'LN-7721', amount: 450, date: '2024-05-10', type: 'debit', description: 'Monthly Installment - May' },
  { id: 'TX-002', loanId: 'LN-7721', amount: 450, date: '2024-04-10', type: 'debit', description: 'Monthly Installment - April' },
  { id: 'TX-003', loanId: 'LN-7721', amount: 900, date: '2024-03-15', type: 'debit', description: 'Bulk Repayment' }
];

/**
 * Migration Logic
 */
export const initializeStorage = (forceReset = false) => {
  const version = localStorage.getItem(STORAGE_KEYS.MIGRATION_VERSION);
  
  if (forceReset || version !== CURRENT_VERSION) {
    console.log('📦 Initializing Local Storage with Test Data...');
    
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(initialLoans));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
    localStorage.setItem(STORAGE_KEYS.MIGRATION_VERSION, CURRENT_VERSION);
    
    if (forceReset) {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      window.location.reload();
    }
  }
};

/**
 * Reset Utility for Dev Tools
 * Usage: Call `window.resetApp()` from browser console
 */
(window as any).resetApp = () => {
  if (confirm('This will clear all local data and reset to test state. Continue?')) {
    initializeStorage(true);
  }
};

/**
 * Storage Helper
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};