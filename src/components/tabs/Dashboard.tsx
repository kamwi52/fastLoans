import { useState, useEffect, useRef } from 'react';
import { Menu, PlusCircle, Wallet, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Loans from './Loans';
import Payments from './Payments';
import Apply from './Apply';
import Profile from './Profile';
import Admin from './Admin';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import type { Loan, Transaction } from '../../types';


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
  const { user, logout, isInitializing } = useAuth();

  const contentRef = useRef<HTMLDivElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const currentScrollTop = contentRef.current.scrollTop;
      
      // Detect scroll direction for header collapse/expand
      if (currentScrollTop > lastScrollTop.current && currentScrollTop > 80) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    const scrollArea = contentRef.current;
    scrollArea?.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollArea?.removeEventListener('scroll', handleScroll);
  }, []);

  if (isInitializing) {
    return <div className="loading-screen">Initializing Dashboard...</div>;
  }

  if (!user) {
    return null;
  }

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

  // Prevent background scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.classList.add('lock-scroll');
    } else {
      document.body.classList.remove('lock-scroll');
    }
    return () => document.body.classList.remove('lock-scroll');
  }, [isSidebarOpen]);

  // Sync active tab if user role changes (e.g. on initial load from context)
  useEffect(() => {
    setActiveTab(user.role === 'admin' ? 'admin' : 'overview');
  }, [user.role]);

  // Admins see an empty state for personal loan tabs to separate views.
  const displayLoans = isAdmin ? [] : mockLoans;
  const displayTransactions = isAdmin ? [] : mockTransactions;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Automatically close sidebar on mobile/tablet when an item is selected
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={handleTabChange} />;
      case 'loans': return <Loans loans={displayLoans} />;
      case 'payments': return <Payments transactions={displayTransactions} loans={displayLoans} />;
      case 'apply': return <Apply />;
      case 'profile': return <Profile user={user} />;
      case 'admin': return isAdmin ? <Admin /> : <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={handleTabChange} />;
      default: return isAdmin ? <Admin /> : <Overview user={user} loans={displayLoans} transactions={displayTransactions} onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay to dim content when sidebar is open */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} 
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar 
        isOpen={isSidebarOpen}
        isAdmin={isAdmin}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        user={user}
        logout={logout}
      />

      <main className="content" ref={contentRef}>
        <div className="content-container">
          <div className={`company-header ${!isHeaderVisible ? 'collapsed' : ''}`}>
            <button 
              className="mobile-menu-btn" 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </button>
            <span className="company-name">Mulonga Group</span>
          </div>
          <div className={`greeting-section ${!isHeaderVisible ? 'collapsed' : ''}`}>
            <h1>Welcome, {user.name.split(' ')[0]}!</h1>
            <p className="header-date">{new Date().toLocaleDateString('en-ZM', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            
            {!isAdmin && (
              <div className="header-quick-actions">
                <button onClick={() => handleTabChange('apply')} className="quick-action-pill">
                  <PlusCircle size={16} /> Apply Now
                </button>
                <button onClick={() => handleTabChange('payments')} className="quick-action-pill">
                  <Wallet size={16} /> Make Payment
                </button>
                <button onClick={() => handleTabChange('loans')} className="quick-action-pill">
                  <Clock size={16} /> My Loans
                </button>
              </div>
            )}
          </div>
          <div key={activeTab} className="fade-in tab-content-wrapper">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}