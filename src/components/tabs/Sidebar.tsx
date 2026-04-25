import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase,
  Wallet,
  FileText, 
  UserCircle,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { User } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  isAdmin: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isAdmin, 
  activeTab, 
  setActiveTab, 
  user, 
  logout 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? 'Expand' : 'Collapse'}>
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </div>

      {!isCollapsed && (
        <div className="sidebar-brand">
          <ShieldCheck size={24} color="var(--accent)" />
          <span className="brand-name">Target everyones need.</span>
        </div>
      )}
      
      <nav>
        {isAdmin && (
          <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')} title="Admin">
            <ShieldCheck size={22} />
            <span className="nav-label">Admin</span>
          </button>
        )}
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')} title="Home">
          <LayoutDashboard size={22} />
          <span className="nav-label">Home</span>
        </button>
        {!isAdmin && (
          <>
            <button className={activeTab === 'loans' ? 'active' : ''} onClick={() => setActiveTab('loans')} title="Loans">
              <Briefcase size={22} />
              <span className="nav-label">Loans</span>
            </button>
            <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')} title="Repay">
              <Wallet size={22} />
              <span className="nav-label">Repay</span>
            </button>
            <button className={activeTab === 'apply' ? 'active' : ''} onClick={() => setActiveTab('apply')} title="Apply">
              <FileText size={22} />
              <span className="nav-label">Apply</span>
            </button>
          </>
        )}
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')} title="Profile">
          <UserCircle size={22} />
          <span className="nav-label">Profile</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-action-btn" onClick={logout} title="Logout">
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