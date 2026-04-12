import type { User, Loan, Transaction, Notification } from '../types';

export const mockUser: User = {
  id: 'USR-001',
  name: 'Thabo Nkosi',
  email: 'thabo.nkosi@email.com',
  phone: '+27 82 345 6789',
  accountNumber: 'ACC-2024-00847',
  creditScore: 742,
};

export const mockLoans: Loan[] = [
  {
    id: 'LN-001',
    type: 'Personal',
    amount: 50000,
    balance: 32400,
    interestRate: 12.5,
    monthlyPayment: 1850,
    nextPaymentDate: '2026-04-25',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2027-01-15',
    progress: 35,
  },
  {
    id: 'LN-002',
    type: 'Business',
    amount: 200000,
    balance: 178000,
    interestRate: 9.75,
    monthlyPayment: 4200,
    nextPaymentDate: '2026-04-30',
    status: 'Active',
    startDate: '2025-06-01',
    endDate: '2030-06-01',
    progress: 11,
  },
  {
    id: 'LN-003',
    type: 'Auto',
    amount: 85000,
    balance: 0,
    interestRate: 11.0,
    monthlyPayment: 0,
    nextPaymentDate: '-',
    status: 'Closed',
    startDate: '2021-03-10',
    endDate: '2025-03-10',
    progress: 100,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    date: '2026-04-10',
    description: 'Monthly Repayment – Personal Loan',
    amount: 1850,
    type: 'debit',
    loanId: 'LN-001',
  },
  {
    id: 'TXN-002',
    date: '2026-04-05',
    description: 'Monthly Repayment – Business Loan',
    amount: 4200,
    type: 'debit',
    loanId: 'LN-002',
  },
  {
    id: 'TXN-003',
    date: '2026-03-25',
    description: 'Extra Payment – Personal Loan',
    amount: 5000,
    type: 'debit',
    loanId: 'LN-001',
  },
  {
    id: 'TXN-004',
    date: '2026-03-10',
    description: 'Monthly Repayment – Personal Loan',
    amount: 1850,
    type: 'debit',
    loanId: 'LN-001',
  },
  {
    id: 'TXN-005',
    date: '2026-03-05',
    description: 'Monthly Repayment – Business Loan',
    amount: 4200,
    type: 'debit',
    loanId: 'LN-002',
  },
  {
    id: 'TXN-006',
    date: '2026-02-10',
    description: 'Monthly Repayment – Personal Loan',
    amount: 1850,
    type: 'debit',
    loanId: 'LN-001',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'N-001',
    message: 'Your next payment of R1,850 is due on 25 April 2026.',
    type: 'warning',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'N-002',
    message: 'Payment of R4,200 successfully processed for Business Loan.',
    type: 'success',
    time: '6 days ago',
    read: false,
  },
  {
    id: 'N-003',
    message: 'Your credit score improved by 12 points this month!',
    type: 'info',
    time: '1 week ago',
    read: true,
  },
  {
    id: 'N-004',
    message: 'New loan offer available: Education Loan at 8.5% p.a.',
    type: 'info',
    time: '2 weeks ago',
    read: true,
  },
];

export const VALID_CREDENTIALS = {
  email: 'thabo.nkosi@email.com',
  password: 'Lend@2024',
};
