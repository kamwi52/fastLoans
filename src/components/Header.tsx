import { useState } from 'react';
import type { User, Notification } from '../types';
import '../styles/Header.css';

interface HeaderProps {
  user: User;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMenuToggle: () => void;
}

export default function Header({ user, notifications, onMarkAllRead, onMenuToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const notifTypeIcon: Record<string, string> = {
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️',
    error: '❌',
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          ☰
        </button>
        <div className="header-greeting">
          <span className="greeting-text">
            Good {getTimeOfDay()}, <strong>{user.name.split(' ')[0]}</strong> 👋
          </span>
          <span className="header-date">{formatDate()}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <span>🔍</span>
          <input type="text" placeholder="Search loans, payments…" />
        </div>

        <div className="notif-wrapper">
          <button
            className="notif-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={onMarkAllRead}>Mark all read</button>
                )}
              </div>
              <div className="notif-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'} ${n.type}`}>
                    <span className="notif-type-icon">{notifTypeIcon[n.type]}</span>
                    <div className="notif-body">
                      <p>{n.message}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                    {!n.read && <span className="unread-dot"></span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-avatar">
          <div className="avatar-circle">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="avatar-info">
            <span className="avatar-name">{user.name}</span>
            <span className="avatar-id">{user.accountNumber}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
