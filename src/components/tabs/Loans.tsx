import { useState } from 'react';
import type { Loan } from '../../types';
import { 
  User, 
  Building2, 
  Home, 
  Car, 
  GraduationCap, 
  Inbox, 
  ChevronUp, 
  ChevronDown,
  CreditCard,
  Download
} from 'lucide-react';
import { fmtZMK, formatDate } from './formatters';
import './Loans.css';

interface LoansProps {
  loans: Loan[];
}

const statusColor: Record<string, string> = {
  Active: '#10b981',
  Pending: '#f59e0b',
  Closed: '#6b7280',
  Overdue: '#ef4444',
};

const loanTypeIcon: Record<string, React.ReactNode> = {
  Personal: <User size={20} />,
  Business: <Building2 size={20} />,
  Mortgage: <Home size={20} />,
  Auto: <Car size={20} />,
  Education: <GraduationCap size={20} />,
};

export default function Loans({ loans }: LoansProps) {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Closed' | 'Pending' | 'Overdue'>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'All' ? loans : loans.filter((l) => l.status === filter);

  return (
    <div className="loans-root">
      <div className="loans-header">
        <h2>My Loans</h2>
        <div className="loans-filter">
          {(['All', 'Active', 'Pending', 'Overdue', 'Closed'] as const).map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="loans-list">
        {filtered.length === 0 && (
          <div className="loans-empty">
            <Inbox size={48} color="var(--text-muted)" />
            <p>No loans found for this filter.</p>
          </div>
        )}
        {filtered.map((loan) => (
          <div key={loan.id} className={`loan-card ${expanded === loan.id ? 'expanded' : ''}`}>
            <div
              className="loan-card-header"
              onClick={() => setExpanded(expanded === loan.id ? null : loan.id)}
            >
              <div className="loan-card-left">
                <div className="loan-type-icon">{loanTypeIcon[loan.type]}</div>
                <div className="loan-card-info">
                  <h3>{loan.type} Loan</h3>
                  <span className="loan-card-id">{loan.id}</span>
                </div>
              </div>
              <div className="loan-card-right">
                <span
                  className="loan-status-badge"
                  style={{
                    backgroundColor: statusColor[loan.status] + '20',
                    color: statusColor[loan.status],
                    border: `1px solid ${statusColor[loan.status]}40`,
                  }}
                >
                  {loan.status}
                </span>
                <span className="loan-expand-icon">
                  {expanded === loan.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>
            </div>

            <div className="loan-card-summary">
              <div className="loan-stat">
                <span className="stat-label">Loan Amount</span>
                <span className="stat-value">{fmtZMK(loan.amount)}</span>
              </div>
              <div className="loan-stat">
                <span className="stat-label">Outstanding</span>
                <span className="stat-value highlight">{fmtZMK(loan.balance)}</span>
              </div>
              <div className="loan-stat">
                <span className="stat-label">Monthly Payment</span>
                <span className="stat-value">{loan.monthlyPayment > 0 ? fmtZMK(loan.monthlyPayment) : '—'}</span>
              </div>
              <div className="loan-stat">
                <span className="stat-label">Interest Rate</span>
                <span className="stat-value">{loan.interestRate}% p.a.</span>
              </div>
            </div>

            <div className="loan-progress-section">
              <div className="loan-progress-bar">
                <div
                  className="loan-progress-fill"
                  style={{ width: `${loan.progress}%` }}
                ></div>
              </div>
              <div className="loan-progress-labels">
                <span>{loan.progress}% repaid</span>
                <span>{100 - loan.progress}% remaining</span>
              </div>
            </div>

            {expanded === loan.id && (
              <div className="loan-card-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Start Date</span>
                    <span className="detail-value">{formatDate(loan.startDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">End Date</span>
                    <span className="detail-value">{formatDate(loan.endDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Next Payment</span>
                    <span className="detail-value">
                      {loan.nextPaymentDate === '-' ? '—' : formatDate(loan.nextPaymentDate)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Amount Repaid</span>
                    <span className="detail-value">{fmtZMK(loan.amount - loan.balance)}</span>
                  </div>
                </div>
                <div className="loan-card-actions">
                  {loan.status === 'Active' && (
                    <>
                      <button className="loan-action-btn primary">
                        <CreditCard size={18} />
                        Make Payment
                      </button>
                      <button className="loan-action-btn secondary">
                        <Download size={18} />
                        Download Statement
                      </button>
                    </>
                  )}
                  {loan.status === 'Closed' && (
                    <button className="loan-action-btn secondary">
                      <Download size={18} />
                      Download Statement
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
