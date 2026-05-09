import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { 
  LayoutDashboard, 
  Briefcase,
  Wallet,
  FileText, 
  UserCircle,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import type { User } from '../../types';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  isAdmin: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  logout: () => void;
}

const SIDEBAR_MOBILE_BREAKPOINT = 1024;
const SIDEBAR_COLLAPSE_BREAKPOINT = 1400;

export function Sidebar({ 
  isOpen, 
  isAdmin, 
  activeTab, 
  setActiveTab, 
  user, 
  logout 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${SIDEBAR_MOBILE_BREAKPOINT}px) and (max-width: ${SIDEBAR_COLLAPSE_BREAKPOINT}px)`);
    mediaQueryRef.current = mediaQuery;

    const handler = (e: MediaQueryListEvent) => {
      setIsCollapsed(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const handleSidebarClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = (tab: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActiveTab(tab);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`sidebar ${isOpen ? 'open' : 'closed'} ${isCollapsed ? 'collapsed' : ''}`}
      onClick={handleSidebarClick}
    >
      {!isCollapsed && (
        <div className="sidebar-brand">
          <ShieldCheck size={24} color="var(--accent)" />
          <span className="brand-name">Target everyone's needs.</span>
        </div>
      )}
      
      <nav aria-label="Main navigation">
        {isAdmin && (
          <button className={activeTab === 'admin' ? 'active' : ''} onClick={(e) => handleNavClick('admin', e)} aria-label="Admin dashboard" aria-current={activeTab === 'admin' ? 'page' : undefined}>
            <ShieldCheck size={22} />
            <span className="nav-label">Admin</span>
          </button>
        )}
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={(e) => handleNavClick('overview', e)} aria-label="Home" aria-current={activeTab === 'overview' ? 'page' : undefined}>
          <LayoutDashboard size={22} />
          <span className="nav-label">Home</span>
        </button>
        {!isAdmin && (
          <>
            <button className={activeTab === 'loans' ? 'active' : ''} onClick={(e) => handleNavClick('loans', e)} aria-label="My Loans" aria-current={activeTab === 'loans' ? 'page' : undefined}>
              <Briefcase size={22} />
              <span className="nav-label">Loans</span>
            </button>
            <button className={activeTab === 'payments' ? 'active' : ''} onClick={(e) => handleNavClick('payments', e)} aria-label="Make Payment" aria-current={activeTab === 'payments' ? 'page' : undefined}>
              <Wallet size={22} />
              <span className="nav-label">Repay</span>
            </button>
            <button className={activeTab === 'apply' ? 'active' : ''} onClick={(e) => handleNavClick('apply', e)} aria-label="Apply for Loan" aria-current={activeTab === 'apply' ? 'page' : undefined}>
              <FileText size={22} />
              <span className="nav-label">Apply</span>
            </button>
          </>
        )}
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={(e) => handleNavClick('profile', e)} aria-label="My Profile" aria-current={activeTab === 'profile' ? 'page' : undefined}>
          <UserCircle size={22} />
          <span className="nav-label">Profile</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-action-btn" onClick={logout} aria-label="Log out">
          <LogOut size={20} color="#ef4444" />
        </button>
        {!isCollapsed && (
          <div className="user-avatar-initials">
            {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;