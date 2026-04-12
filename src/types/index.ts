export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  creditScore: number;
  avatar?: string;
}

export interface Loan {
  id: string;
  type: 'Personal' | 'Business' | 'Mortgage' | 'Auto' | 'Education';
  amount: number;
  balance: number;
  interestRate: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  status: 'Active' | 'Pending' | 'Closed' | 'Overdue';
  startDate: string;
  endDate: string;
  progress: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  loanId: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  read: boolean;
}

export type AuthView = 'login' | 'otp' | 'dashboard';
export type DashboardTab = 'overview' | 'loans' | 'payments' | 'profile' | 'apply';
