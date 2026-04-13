import { useState, useEffect } from 'react';
import { 
  Menu,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Loans from './Loans';
import Payments from './Payments';
import Apply from './Apply';
import Profile from './Profile';
import Admin from './Admin';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import type { User, Loan, Transaction } from '../../types';

const mockUser: User = {
  id: 'USR-001',
  name: 'John Doe',
  accountNumber: 'ZM-882910',
  phone: '+260971234567',
  email: 'john.doe@example.com',
  creditScore: 720,
  role: 'client',
};

const mockLoans: Loan[] = [
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

const mockTransactions: Transaction[] = [
  { id: 'TX-9901', date: '2026-03-25', description: 'Monthly Installment', loanId: 'LN-1001', amount: 245, type: 'debit' },
  { id: 'TX-9850', date: '2026-02-25', description: 'Monthly Installment', loanId: 'LN-1001', amount: 245, type: 'debit' },
];

export default function Dashboard() {
  const { user: authUser, logout } = useAuth();
  const user = authUser || mockUser;
  const isAdmin = user.role === 'admin';

  const [activeTab, setActiveTab] = useState<string>(isAdmin ? 'admin' : 'overview');
  // Initialize sidebar state based on viewport
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync active tab if user role changes (e.g. on initial load from context)
  useEffect(() => {
    if (authUser) {
      setActiveTab(authUser.role === 'admin' ? 'admin' : 'overview');
    }
  }, [authUser?.role]);

  if (!user) {
    return <div className="loading-screen">Initializing Dashboard...</div>;
  }

  // Admins see an empty state for personal loan tabs to separate views.
  const displayLoans = isAdmin ? [] : mockLoans;
  const displayTransactions = isAdmin ? [] : mockTransactions;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={setActiveTab} />;
      case 'loans': return <Loans loans={displayLoans} />;
      case 'payments': return <Payments transactions={displayTransactions} loans={displayLoans} />;
      case 'apply': return <Apply />;
      case 'profile': return <Profile user={user} />;
      case 'admin': return isAdmin ? <Admin /> : <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={setActiveTab} />;
      default: return isAdmin ? <Admin /> : <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen}
        isAdmin={isAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />

      <main className="content">
        <div className="content-container">
          <div className="greeting-section">
            <h1>Welcome, {user.name.split(' ')[0]}!</h1>
            <p className="header-date">{new Date().toLocaleDateString('en-ZM', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}