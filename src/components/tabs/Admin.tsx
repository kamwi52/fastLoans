import { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle, 
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
      <div className="admin-header">
        <div>
          <h2>Admin Console</h2>
          <p>Manage and review incoming loan applications</p>
        </div>
        <a 
          href={`https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_GOOGLE_SHEET_ID || ''}`} 
          target="_blank" 
          rel="noreferrer"
          className="sheet-link-btn"
        >
          <BarChart3 size={18} /> Open Google Sheet
        </a>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card elevation">
          <div className="stat-icon-wrap primary"><Users size={20} /></div>
          <div className="stat-data">
            <span className="stat-title">New Today</span>
            <span className="stat-count">12</span>
          </div>
        </div>
        <div className="admin-stat-card elevation">
          <div className="stat-icon-wrap warning"><Clock size={20} /></div>
          <div className="stat-data">
            <span className="stat-title">Pending KYC</span>
            <span className="stat-count warning">5</span>
          </div>
        </div>
        <div className="admin-stat-card elevation">
          <div className="stat-icon-wrap success"><CheckCircle size={20} /></div>
          <div className="stat-data">
            <span className="stat-title">Total Disbursed</span>
            <span className="stat-count success">{fmtZMK(42500)}</span>
          </div>
        </div>
      </div>

      <div className="table-controls">
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

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref ID</th>
              <th>Applicant</th>
              <th>Product</th>
              <th>Amount</th>
              <th>KYC</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr key={app.id}>
                <td className="font-mono">{app.id}</td>
                <td>{app.applicant}</td>
                <td>{app.product}</td>
                <td><strong>{fmtZMK(app.amount)}</strong></td>
                <td>
                  <span className={`kyc-tag ${app.kyc.toLowerCase()}`}>{app.kyc}</span>
                </td>
                <td>
                  <span className={`status-tag ${app.status.toLowerCase()}`}>{app.status}</span>
                </td>
                <td>
                  <button className="review-btn"><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}