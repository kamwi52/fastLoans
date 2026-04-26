import { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter,
  MoreHorizontal 
} from 'lucide-react';
import { fmtZMK } from './formatters';
import './Admin.css';

interface Application {
  id: string;
  date: string;
  applicant: string;
  product: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  kyc: 'Verified' | 'Pending';
}

const mockApplications: Application[] = [
  { id: 'APP-9012', date: '2024-05-20', applicant: '+260971234567', product: 'Personal Loan', amount: 2500, status: 'Pending', kyc: 'Verified' },
  { id: 'APP-9011', date: '2024-05-19', applicant: '+260950112233', product: 'Business Loan', amount: 5000, status: 'Pending', kyc: 'Pending' },
  { id: 'APP-9008', date: '2024-05-18', applicant: '+260966445566', product: 'Auto Loan', amount: 1200, status: 'Approved', kyc: 'Verified' },
  { id: 'APP-9005', date: '2024-05-15', applicant: '+260977889900', product: 'Education Loan', amount: 1500, status: 'Rejected', kyc: 'Verified' },
  { id: 'APP-9001', date: '2024-05-10', applicant: '+260955112233', product: 'Personal Loan', amount: 1000, status: 'Approved', kyc: 'Verified' },
];

export default function Admin() {
  const [searchTerm, setSearchBar] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredApps = mockApplications.filter(app => 
    (statusFilter === 'All' || app.status === statusFilter) &&
    (app.applicant.includes(searchTerm) || app.id.includes(searchTerm))
  );

  return (
    <div className="admin-root fade-in">
      {/* Header Section */}
      <div className="admin-header-section">
        <div className="admin-title-group">
          <h2>Applications</h2>
          <p>Manage and review incoming loan applications</p>
        </div>
        <a 
          href={`https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_GOOGLE_SHEET_ID || ''}`} 
          target="_blank" 
          rel="noreferrer"
          className="sheet-link-btn"
        >
          <BarChart3 size={18} /> Export
        </a>
      </div>

      {/* Stats Summary */}
      <div className="admin-stats-summary">
        <div className="stat-item">
          <span className="stat-label">New Today</span>
          <span className="stat-value">12</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending KYC</span>
          <span className="stat-value warning">5</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Disbursed</span>
          <span className="stat-value success">{fmtZMK(42500)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by ID or Phone..." 
            value={searchTerm}
            onChange={(e) => setSearchBar(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* List Container */}
      <div className="admin-list-container">
        {/* List Header */}
        <div className="admin-list-header">
          <div className="list-col-id">Ref ID</div>
          <div className="list-col-applicant">Applicant</div>
          <div className="list-col-product">Product</div>
          <div className="list-col-amount">Amount</div>
          <div className="list-col-kyc">KYC</div>
          <div className="list-col-status">Status</div>
          <div className="list-col-actions">Action</div>
        </div>

        {/* List Body */}
        <div className="admin-list-body">
          {filteredApps.map(app => (
            <div key={app.id} className="admin-list-row">
              <div className="list-col-id"><span className="font-mono">{app.id}</span></div>
              <div className="list-col-applicant">{app.applicant}</div>
              <div className="list-col-product">{app.product}</div>
              <div className="list-col-amount"><strong>{fmtZMK(app.amount)}</strong></div>
              <div className="list-col-kyc">
                <span className={`badge badge-${app.kyc.toLowerCase()}`}>{app.kyc}</span>
              </div>
              <div className="list-col-status">
                <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
              </div>
              <div className="list-col-actions">
                <button className="icon-btn" title="More options"><MoreHorizontal size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="admin-action-bar">
        <div className="action-bar-content">
          <span className="selection-count">{filteredApps.length} applications shown</span>
          <div className="action-buttons">
            <button className="btn btn-secondary">Bulk Review</button>
            <button className="btn btn-primary">Export Selected</button>
          </div>
        </div>
      </div>
    </div>
  );
}