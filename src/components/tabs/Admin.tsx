import { useState, type FormEvent } from 'react';
import {
  BarChart3,
  Search,
  Filter,
  Edit3,
  Trash2,
  PlusCircle,
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
  { id: 'APP-9020', date: '2024-06-01', applicant: '+260974445566', product: 'Small Business', amount: 6200, status: 'Pending', kyc: 'Pending' },
  { id: 'APP-9021', date: '2024-06-02', applicant: '+260971112233', product: 'Auto Loan', amount: 3200, status: 'Approved', kyc: 'Verified' },
  { id: 'APP-9022', date: '2024-06-03', applicant: '+260973334455', product: 'Education Loan', amount: 1800, status: 'Rejected', kyc: 'Pending' },
];

export default function Admin() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchBar] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [formState, setFormState] = useState({
    applicant: '',
    product: 'Personal Loan',
    amount: 0,
    status: 'Pending' as Application['status'],
    kyc: 'Pending' as Application['kyc'],
  });

  const filteredApps = applications.filter(app =>
    (statusFilter === 'All' || app.status === statusFilter) &&
    (app.applicant.includes(searchTerm) || app.id.includes(searchTerm))
  );

  const totalApplications = applications.length;
  const pendingCount = applications.filter((app) => app.status === 'Pending').length;
  const approvedCount = applications.filter((app) => app.status === 'Approved').length;
  const rejectedCount = applications.filter((app) => app.status === 'Rejected').length;
  const totalExposure = applications.reduce((sum, app) => sum + app.amount, 0);

  const resetForm = () => {
    setSelectedApp(null);
    setFormState({
      applicant: '',
      product: 'Personal Loan',
      amount: 0,
      status: 'Pending',
      kyc: 'Pending',
    });
  };

  const handleSelect = (app: Application) => {
    setSelectedApp(app);
    setFormState({
      applicant: app.applicant,
      product: app.product,
      amount: app.amount,
      status: app.status,
      kyc: app.kyc,
    });
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    if (selectedApp?.id === id) resetForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.applicant.trim() || formState.amount <= 0) {
      return;
    }

    if (selectedApp) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? {
                ...app,
                applicant: formState.applicant,
                product: formState.product,
                amount: formState.amount,
                status: formState.status,
                kyc: formState.kyc,
              }
            : app
        )
      );
      resetForm();
      return;
    }

    const newApp: Application = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      applicant: formState.applicant,
      product: formState.product,
      amount: formState.amount,
      status: formState.status,
      kyc: formState.kyc,
    };

    setApplications((prev) => [newApp, ...prev]);
    resetForm();
  };

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
          <span className="stat-label">Applications</span>
          <span className="stat-value">{totalApplications}</span>
          <span className="stat-sub">active applications</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value warning">{pendingCount}</span>
          <span className="stat-sub">awaiting review</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Exposure</span>
          <span className="stat-value success">{fmtZMK(totalExposure)}</span>
          <span className="stat-sub">loan portfolio value</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resolved</span>
          <span className="stat-value">{approvedCount + rejectedCount}</span>
          <span className="stat-sub">closed / rejected</span>
        </div>
      </div>

      {/* CRUD Form */}
      <div className="admin-crud-panel">
        <div className="crud-header">
          <div>
            <h2>{selectedApp ? 'Edit Application' : 'Create New Application'}</h2>
            <p>{selectedApp ? `Modify application ${selectedApp.id}` : 'Add a new loan application to the system.'}</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            {selectedApp ? 'Cancel Edit' : 'Reset'}
          </button>
        </div>

        <form className="admin-crud-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Applicant
              <input
                type="text"
                value={formState.applicant}
                onChange={(e) => setFormState({ ...formState, applicant: e.target.value })}
                placeholder="+260 97X XXX XXX"
              />
            </label>
            <label>
              Product
              <select
                value={formState.product}
                onChange={(e) => setFormState({ ...formState, product: e.target.value })}
              >
                <option>Personal Loan</option>
                <option>Business Loan</option>
                <option>Auto Loan</option>
                <option>Education Loan</option>
              </select>
            </label>
            <label>
              Amount
              <input
                type="number"
                min={0}
                value={formState.amount}
                onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })}
              />
            </label>
            <label>
              KYC Status
              <select
                value={formState.kyc}
                onChange={(e) => setFormState({ ...formState, kyc: e.target.value as Application['kyc'] })}
              >
                <option>Pending</option>
                <option>Verified</option>
              </select>
            </label>
            <label>
              Application Status
              <select
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value as Application['status'] })}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </label>
          </div>
          <div className="crud-actions">
            <button type="submit" className="btn btn-primary">
              {selectedApp ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
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

      {/* Admin Action Cards */}
      <div className="admin-action-grid">
        <button type="button" className="admin-action-card action-primary" onClick={resetForm}>
          <PlusCircle size={18} /> Create Loan
        </button>
        <button type="button" className="admin-action-card action-secondary" onClick={() => setStatusFilter('Pending')}>
          Review Applications
        </button>
        <button type="button" className="admin-action-card action-secondary">
          Manage Users
        </button>
        <button type="button" className="admin-action-card action-secondary">
          System Settings
        </button>
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
          {filteredApps.length === 0 ? (
            <div className="no-results-card">No applications match your search and filter criteria.</div>
          ) : (
            filteredApps.map((app) => (
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
                  <button className="icon-btn" title="Edit application" onClick={() => handleSelect(app)}>
                    <Edit3 size={18} />
                  </button>
                  <button className="icon-btn delete-btn" title="Delete application" onClick={() => handleDelete(app.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
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