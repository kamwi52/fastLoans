import { useState, useEffect } from 'react';
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
      default: return isAdmin ? <Admin /> : <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar-overlay ${(isSidebarOpen || (isAdmin && isRightSidebarOpen)) ? 'show' : ''}`} 
           onClick={() => { setSidebarOpen(false); setRightSidebarOpen(false); }} />
      
      {/* LEFT SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">FastLoans</div>
        <nav>
          {isAdmin && (
            <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => { setActiveTab('admin'); setSidebarOpen(false); }}>🛡️ Admin Console</button>
          )}
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}>📊 Overview</button>
          {!isAdmin && (
            <>
              <button className={activeTab === 'loans' ? 'active' : ''} onClick={() => { setActiveTab('loans'); setSidebarOpen(false); }}>💼 My Loans</button>
              <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}>💸 Payments</button>
              <button className={activeTab === 'apply' ? 'active' : ''} onClick={() => { setActiveTab('apply'); setSidebarOpen(false); }}>📝 Apply Now</button>
            </>
          )}
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}>👤 Profile</button>
        </nav>
        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </aside>
      <main className="content">
        <div className="content-container">
          <header className="content-header">
            <div className="header-left">
              <button className="pane-toggle left" onClick={() => setSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? '◀' : '☰'}</button>
              <h1>Welcome, {user.name.split(' ')[0]}!</h1>
              <p className="header-date">{new Date().toLocaleDateString('en-ZM', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="header-right">
              {!isRightSidebarOpen && (
                <button className="pane-toggle right" onClick={() => setRightSidebarOpen(true)}>⚙️</button>
              )}
              <div className="user-profile-mini">
                <div className="avatar-circle">{(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}</div>
              </div>
            </div>
          </header>
          {renderContent()}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      {isAdmin && (
      <aside className={`right-sidebar ${isRightSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <div className="right-sidebar-header">
            <h3>Quick Actions</h3>
            <button className="close-pane" onClick={() => setRightSidebarOpen(false)}>✕</button>
          </div>
          
          <div className="action-stack">
            <a href={`https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_GOOGLE_SHEET_ID || ''}`} target="_blank" rel="noreferrer" className="pane-btn primary">
              <span className="button-icon">📊</span> Open Google Sheet
            </a>
            <button className="pane-btn">
              <span className="button-icon">📞</span> Contact Client
            </button>
            <button className="pane-btn danger">
              <span className="button-icon">🚫</span> Reject Application
            </button>
          </div>

          <div className="activity-section">
            <h4 className="activity-title">Recent Activity</h4>
            <div className="activity-card">
              <div className="activity-item">
                <div className="activity-icon info">ℹ️</div>
                <div className="activity-details">
                  <p>System Update</p>
                  <small>2 hours ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button 
          className="pane-toggle right-float" 
          onClick={() => setRightSidebarOpen(!isRightSidebarOpen)}
        >
          {isRightSidebarOpen ? '▶' : '⚙️'}
        </button>
      </aside>
      )}
    </div>
  );
}