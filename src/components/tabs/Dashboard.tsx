import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Settings, 
  LayoutDashboard, 
  Briefcase, 
  Wallet, 
  FileText, 
  UserCircle, 
  ShieldCheck,
  LogOut,
  BarChart3,
  Phone,
  Ban,
  Info
} from 'lucide-react';
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
    amount: 50000,
    balance: 32500,
    monthlyPayment: 2450,
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
    amount: 150000,
    balance: 150000,
    monthlyPayment: 0,
    interestRate: 9.5,
    progress: 0,
    startDate: '-',
    endDate: '-',
    nextPaymentDate: '-',
  },
];

const mockTransactions: Transaction[] = [
  { id: 'TX-9901', date: '2026-03-25', description: 'Monthly Installment', loanId: 'LN-1001', amount: 2450, type: 'debit' },
  { id: 'TX-9850', date: '2026-02-25', description: 'Monthly Installment', loanId: 'LN-1001', amount: 2450, type: 'debit' },
];

export default function Dashboard() {
  const { user: authUser, logout } = useAuth();
  const user = authUser || mockUser;
  const isAdmin = user.role === 'admin';

  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin' : 'overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);

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
      default: return <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar-overlay ${(isSidebarOpen || (isAdmin && isRightSidebarOpen)) ? 'show' : ''}`} 
           onClick={() => { setSidebarOpen(false); setRightSidebarOpen(false); }} />
      
      {/* LEFT SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">FastLoans</div>
        <button className="sidebar-handle left" onClick={() => setSidebarOpen(false)}>
          <ChevronLeft size={14} strokeWidth={3} />
        </button>
        <nav>
          {isAdmin && (
            <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => { setActiveTab('admin'); setSidebarOpen(false); }}>
              <ShieldCheck size={18} /> Admin Console
            </button>
          )}
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}>
            <LayoutDashboard size={18} /> Overview
          </button>
          {!isAdmin && (
            <>
              <button className={activeTab === 'loans' ? 'active' : ''} onClick={() => { setActiveTab('loans'); setSidebarOpen(false); }}>
                <Briefcase size={18} /> My Loans
              </button>
              <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}>
                <Wallet size={18} /> Payments
              </button>
              <button className={activeTab === 'apply' ? 'active' : ''} onClick={() => { setActiveTab('apply'); setSidebarOpen(false); }}>
                <FileText size={18} /> Apply Now
              </button>
            </>
          )}
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}>
            <UserCircle size={18} /> Profile
          </button>
        </nav>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="content">
        <div className="content-container">
          <header className="content-header">
            <div className="header-left">
              {!isSidebarOpen && (
                <button className="sidebar-trigger" onClick={() => setSidebarOpen(true)}>
                  <Menu size={20} />
                </button>
              )}
              <div>
                <h1>Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="header-date">{new Date().toLocaleDateString('en-ZM', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            <div className="header-right">
              {isAdmin && !isRightSidebarOpen && (
                <button className="sidebar-trigger secondary" onClick={() => setRightSidebarOpen(true)} title="Quick Actions">
                  <Settings size={18} />
                  <span>Actions</span>
                </button>
              )}
              <div className="user-profile-mini">
                <div className="avatar-circle">{(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}</div>
              </div>
            </div>
          </header>
          <div className="tab-content-wrapper fade-in">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      {isAdmin && (
      <aside className={`right-sidebar ${isRightSidebarOpen ? 'open' : 'closed'}`}>
        <button className="sidebar-handle right" onClick={() => setRightSidebarOpen(false)}>
          <ChevronRight size={14} strokeWidth={3} />
        </button>
        <div className="sidebar-content">
          <div className="right-sidebar-header"><h3>Quick Actions</h3></div>
          
          <div className="action-stack">
            <a href="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID" target="_blank" rel="noreferrer" className="pane-btn primary">
              <BarChart3 size={18} /> Open Google Sheet
            </a>
            <button className="pane-btn">
              <Phone size={18} /> Contact Client
            </button>
            <button className="pane-btn danger">
              <Ban size={18} /> Reject Application
            </button>
          </div>

          <div className="activity-section">
            <h4 className="activity-title">Recent Activity</h4>
            <div className="activity-card">
              <div className="activity-item">
                <div className="activity-icon info"><Info size={14} /></div>
                <div className="activity-details">
                  <p>System Update</p>
                  <small>2 hours ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      )}
    </div>
  );
}