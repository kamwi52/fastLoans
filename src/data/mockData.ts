import type { User, Notification } from '../types';

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