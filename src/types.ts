export interface User {
  name: string;
  accountNumber: string;
  phone: string;
  email: string;
  creditScore: number;
  role: 'admin' | 'client';
}

export interface Loan {
  id: string;
  type: string;
  status: 'Active' | 'Pending' | 'Closed' | 'Overdue';
  amount: number;
  balance: number;
  monthlyPayment: number;
  interestRate: number;
  progress: number;
  startDate: string;
  endDate: string;
  nextPaymentDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  loanId: string;
  amount: number;
  type: 'debit' | 'credit';
}