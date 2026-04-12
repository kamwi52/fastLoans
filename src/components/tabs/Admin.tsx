import { useState } from 'react';
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
  { id: 'APP-9012', date: '2024-05-20', applicant: '+260971234567', product: 'Personal Loan', amount: 25000, status: 'Pending', kyc: 'Verified' },
  { id: 'APP-9011', date: '2024-05-19', applicant: '+260950112233', product: 'Business Loan', amount: 500000, status: 'Pending', kyc: 'Pending' },
  { id: 'APP-9008', date: '2024-05-18', applicant: '+260966445566', product: 'Auto Loan', amount: 120000, status: 'Approved', kyc: 'Verified' },
  { id: 'APP-9005', date: '2024-05-15', applicant: '+260977889900', product: 'Education Loan', amount: 15000, status: 'Rejected', kyc: 'Verified' },
  { id: 'APP-9001', date: '2024-05-10', applicant: '+260955112233', product: 'Personal Loan', amount: 10000, status: 'Approved', kyc: 'Verified' },
];

export default function Admin() {
  const [apps, setApps] = useState(mockApplications);

  const fmt = (n: number) => 'K ' + n.toLocaleString('en-ZM');

  return (
    <div className="admin-root fade-in">
      <div className="admin-header">
        <div>
          <h2>Admin Console</h2>
          <p>Manage and review incoming loan applications</p>
        </div>
        <a 
          href="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID" 
          target="_blank" 
          rel="noreferrer"
          className="sheet-link-btn"
        >
          📊 Open Google Sheet
        </a>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-title">New Today</span>
          <span className="stat-count">12</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-title">Pending KYC</span>
          <span className="stat-count warning">5</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-title">Total Disbursed</span>
          <span className="stat-count success">K 1.2M</span>
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
            {apps.map(app => (
              <tr key={app.id}>
                <td className="font-mono">{app.id}</td>
                <td>{app.applicant}</td>
                <td>{app.product}</td>
                <td><strong>{fmt(app.amount)}</strong></td>
                <td>
                  <span className={`kyc-tag ${app.kyc.toLowerCase()}`}>{app.kyc}</span>
                </td>
                <td>
                  <span className={`status-tag ${app.status.toLowerCase()}`}>{app.status}</span>
                </td>
                <td>
                  <button className="review-btn">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}