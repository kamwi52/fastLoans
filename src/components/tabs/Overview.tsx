import type { User, Loan, Transaction } from '../../types';
import { 
  Banknote, 
  TrendingDown, 
  Calendar, 
  Star, 
  ArrowDownLeft, 
  Wallet, 
  FilePlus, 
  FileText, 
  UserCircle 
} from 'lucide-react';
import { fmtZMK, formatDate } from './formatters';
import './Overview.css';

interface OverviewProps {
  user: User;
  loans: Loan[];
  transactions: Transaction[];
  onTabChange: (tab: string) => void;
}

const statusColor: Record<string, string> = {
  Active: '#0F6E56',
  Pending: '#f59e0b',
  Closed: '#6b7280',
  Overdue: '#ef4444',
};

export default function Overview({ user, loans, transactions, onTabChange }: OverviewProps) {
  const totalBorrowed = loans.reduce((s, l) => s + l.amount, 0);
  const totalOutstanding = loans.reduce((s, l) => s + l.balance, 0);
  const activeLoans = loans.filter((l) => l.status === 'Active');
  const totalMonthlyDue = activeLoans.reduce((s, l) => s + l.monthlyPayment, 0);

  const nextDueDate = activeLoans.length > 0 
    ? activeLoans.map(l => l.nextPaymentDate).filter(d => d !== '-').sort()[0]
    : null;

  const creditColor =
    user.creditScore >= 750
      ? '#0F6E56'
      : user.creditScore >= 650
      ? '#f59e0b'
      : '#ef4444';

  const isAdmin = user.role === 'admin';

  return (
    <div className="overview-root">
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card primary">
          <div className="summary-icon"><Banknote size={20} /></div>
          <div className="summary-body">
            <span className="summary-label">Total Borrowed</span>
            <span className="summary-value">{fmtZMK(totalBorrowed)}</span>
            <span className="summary-sub">Across {loans.length} loans</span>
          </div>
        </div>

        <div className="summary-card warning">
          <div className="summary-icon"><TrendingDown size={20} /></div>
          <div className="summary-body">
            <span className="summary-label">Outstanding Balance</span>
            <span className="summary-value">{fmtZMK(totalOutstanding)}</span>
            <span className="summary-sub">{activeLoans.length} active loans</span>
          </div>
        </div>

        <div className="summary-card success">
          <div className="summary-icon"><Calendar size={20} /></div>
          <div className="summary-body">
            <span className="summary-label">Monthly Repayments</span>
            <span className="summary-value">{fmtZMK(totalMonthlyDue)}</span>
            <span className="summary-sub">{nextDueDate ? `Next due: ${formatDate(nextDueDate)}` : 'No upcoming payments'}</span>
          </div>
        </div>

        <div className="summary-card info">
          <div className="summary-icon"><Star size={20} /></div>
          <div className="summary-body">
            <span className="summary-label">Credit Score</span>
            <span className="summary-value" style={{ color: creditColor }}>
              {user.creditScore}
            </span>
            <span className="summary-sub">
              {user.creditScore >= 750 ? 'Excellent' : user.creditScore >= 650 ? 'Good' : 'Fair'}
            </span>
          </div>
        </div>
      </div>

      <div className="overview-bottom">
        {/* Active Loans */}
        <div className="overview-section">
          <div className="section-header">
            <h3>Active Loans</h3>
            <button className="view-all-btn" onClick={() => onTabChange('loans')}>
              View All →
            </button>
          </div>
          <div className="loan-cards">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="loan-mini-card">
                <div className="loan-mini-top">
                  <div>
                    <span className="loan-type-badge">{loan.type}</span>
                    <span className="loan-id">{loan.id}</span>
                  </div>
                  <span
                    className="loan-status"
                    style={{ color: statusColor[loan.status] }}
                  >
                    ● {loan.status}
                  </span>
                </div>
                <div className="loan-mini-amounts">
                  <div>
                    <span className="mini-label">Balance</span>
                    <span className="mini-value">{fmtZMK(loan.balance)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Monthly</span>
                    <span className="mini-value">{fmtZMK(loan.monthlyPayment)}</span>
                  </div>
                  <div>
                    <span className="mini-label">Rate</span>
                    <span className="mini-value">{loan.interestRate}%</span>
                  </div>
                </div>
                <div className="loan-progress-wrap">
                  <div className="loan-progress-bar">
                    <div
                      className="loan-progress-fill"
                      style={{ width: `${loan.progress}%` }}
                    ></div>
                  </div>
                  <span className="loan-progress-label">{loan.progress}% repaid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="overview-section">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button className="view-all-btn" onClick={() => onTabChange('payments')}>
              View All →
            </button>
          </div>
          <div className="txn-list">
            {transactions.slice(0, 5).map((txn) => (
              <div key={txn.id} className="txn-row">
                <div className="txn-icon debit"><ArrowDownLeft size={16} /></div>
                <div className="txn-info">
                  <span className="txn-desc">{txn.description}</span>
                  <span className="txn-date">{formatDate(txn.date)}</span>
                </div>
                <span className="txn-amount debit">-{fmtZMK(txn.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {!isAdmin && (
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <button className="action-btn" onClick={() => onTabChange('payments')}>
              <Wallet size={18} /> Make Payment
            </button>
            <button className="action-btn" onClick={() => onTabChange('apply')}>
              <FilePlus size={18} /> Apply for Loan
            </button>
            <button className="action-btn" onClick={() => onTabChange('loans')}>
              <FileText size={18} /> View Statements
            </button>
            <button className="action-btn" onClick={() => onTabChange('profile')}>
              <UserCircle size={18} /> Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
