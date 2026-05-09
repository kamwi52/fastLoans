import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, PlusCircle, Wallet, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Loans from './Loans';
import Payments from './Payments';
import Apply from './Apply';
import Profile from './Profile';
import Admin from './Admin';
import { useAuth } from '../../context/AuthContext';
import { mockLoans, mockTransactions } from '../../data/mockData';
import './Dashboard.css';

const SCROLL_THRESHOLD = 80;
const TABLET_BREAKPOINT = 1024;

export default function Dashboard() {
  const { user, logout, isInitializing } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(isAdminRoute ? 'admin' : 'overview');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > TABLET_BREAKPOINT);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const currentScrollTop = contentRef.current.scrollTop;
      
      if (currentScrollTop > lastScrollTop.current && currentScrollTop > SCROLL_THRESHOLD) {
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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < TABLET_BREAKPOINT) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < TABLET_BREAKPOINT) {
      document.body.classList.add('lock-scroll');
    } else {
      document.body.classList.remove('lock-scroll');
    }
    return () => document.body.classList.remove('lock-scroll');
  }, [isSidebarOpen]);

  if (isInitializing) {
    return <div className="loading-screen">Initializing Dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin' || isAdminRoute;

  // Admins see an empty state for personal loan tabs to separate views.
  const displayLoans = isAdmin ? [] : mockLoans;
  const displayTransactions = isAdmin ? [] : mockTransactions;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Automatically close sidebar on mobile/tablet when an item is selected
    if (window.innerWidth < TABLET_BREAKPOINT) {
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

      <div className="dashboard-main-layout">
        <Sidebar 
          isOpen={isSidebarOpen}
          isAdmin={isAdmin}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          user={user}
          logout={logout}
        />

        <div className="content">
          <header className={`company-header ${!isHeaderVisible ? 'collapsed' : ''}`}>
            <div className="content-container">
              <div className="header-inner">
                <div className="header-left">
                  <button 
                    className="mobile-menu-btn" 
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle Menu"
                  >
                    <Menu size={24} />
                  </button>
                  <span className="company-name">Mulonga Group</span>
                </div>
              </div>
            </div>
          </header>

          <main className="content-main" ref={contentRef}>
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
        </main>
        </div>
      </div>
    </div>
  );
}