import type { User, Notification, Loan, Transaction } from '../types';

export const mockUser: User = {
  id: 'USR-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+260971234567',
  accountNumber: 'ZM-882910',
  creditScore: 720,
  role: 'client',
};

export const mockNotifications: Notification[] = [
  {
    id: 'N-001',
    date: '2024-05-20',
    time: '10:30 AM',
    message: 'Your loan payment is due in 5 days.',
    read: false,
    type: 'warning',
  },
  {
    id: 'N-002',
    date: '2024-05-15',
    time: '02:15 PM',
    message: 'Loan application APP-9001 has been approved!',
    read: false,
    type: 'success',
  }
];

export const mockLoans: Loan[] = [
  {
    id: 'LN-1001',
    type: 'Personal',
    status: 'Active',
    amount: 5000,
    balance: 3250,
    monthlyPayment: 245,
    interestRate: 12.5,
    progress: 35,
    startDate: '2024-01-15',
    endDate: '2025-12-15',
    nextPaymentDate: '2026-04-25',
  },
  {
    id: 'LN-1005',
    type: 'Business',
    status: 'Pending',
    amount: 8000,
    balance: 8000,
    monthlyPayment: 0,
    interestRate: 9.5,
    progress: 0,
    startDate: '-',
    endDate: '-',
    nextPaymentDate: '-',
  },
];

export const mockTransactions: Transaction[] = [
  { id: 'TX-9901', date: '2026-03-25', description: 'Monthly Installment', loanId: 'LN-1001', amount: 245, type: 'debit' },
  { id: 'TX-9850', date: '2026-02-25', description: 'Monthly Installment', loanId: 'LN-1001', amount: 245, type: 'debit' },
];