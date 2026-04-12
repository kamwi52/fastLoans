import type { DashboardTab } from '../types';
import '../styles/Sidebar.css';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { tab: DashboardTab; icon: string; label: string }[] = [
  { tab: 'overview', icon: '🏠', label: 'Overview' },
  { tab: 'loans', icon: '💳', label: 'My Loans' },
  { tab: 'payments', icon: '💸', label: 'Payments' },
  { tab: 'apply', icon: '📝', label: 'Apply for Loan' },
  { tab: 'profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
  collapsed,
  onToggle,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">⬡</span>
          {!collapsed && <span className="brand-name">LendSphere</span>}
        </div>
        <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ tab, icon, label }) => (
          <button
            key={tab}
            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
            title={collapsed ? label : undefined}
          >
            <span className="nav-icon">{icon}</span>
            {!collapsed && <span className="nav-label">{label}</span>}
            {!collapsed && activeTab === tab && <span className="nav-indicator"></span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-support">
          {!collapsed && (
            <div className="support-card">
              <p>Need help?</p>
              <a href="#" onClick={(e) => e.preventDefault()}>Contact Support</a>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={onLogout} title={collapsed ? 'Logout' : undefined}>
          <span className="nav-icon">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
