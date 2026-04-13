import { useState, useRef } from 'react';
import type { User } from '../../types';
import { 
  Contact2, 
  Briefcase, 
  Landmark, 
  Home, 
  CheckCircle2, 
  Pencil, 
  Save, 
  Key, 
  Smartphone, 
  Bell, 
  ClipboardList, 
  Clock 
} from 'lucide-react';
import './Profile.css';

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentDocName, setCurrentDocName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState([
    { name: 'Identity Document (ID)', status: 'Verified', icon: <Contact2 size={20} /> },
    { name: 'Proof of Income', status: 'Verified', icon: <Briefcase size={20} /> },
    { name: 'Bank Statement (3 months)', status: 'Verified', icon: <Landmark size={20} /> },
    { name: 'Proof of Residence', status: 'Pending', icon: <Home size={20} /> },
  ]);

  const handleUploadClick = (docName: string) => {
    setCurrentDocName(docName);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentDocName) {
      setUploadingDoc(currentDocName);
      setUploadProgress(0);

      // Simulate progress increment
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          alert(`${currentDocName} (${file.name}) uploaded successfully for review!`);
          setDocs(prev => prev.map(d => 
            d.name === currentDocName ? { ...d, status: 'Verified' } : d
          ));
          setUploadingDoc(null);
          setCurrentDocName(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 300);
      }, 2000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const initials = (user?.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="profile-root">
      {/* Hidden file input for document selection */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="application/pdf"
        onChange={handleFileChange}
      />

      {/* Profile Header */}
      <div className="profile-hero">
        <div className="profile-avatar-large">{initials}</div>
        <div className="profile-hero-info">
          <h2>{user.name}</h2>
          <p className="profile-account-id">Account: {user.accountNumber}</p>
          <p className="profile-member-since">Member since January 2024</p>
          <div className="profile-badges">
            <span className="profile-badge verified"><CheckCircle2 size={14} /> Identity Verified</span>
            <span className="profile-badge active"><span className="status-dot"></span> Account Active</span>
          </div>
        </div>
        <div className="profile-credit-widget">
          <span className="credit-label">Credit Score</span>
          <span className="credit-score">{user.creditScore}</span>
          <span className="credit-rating">Excellent</span>
          <div className="credit-bar">
            <div
              className="credit-fill"
              style={{ width: `${((user.creditScore - 300) / 550) * 100}%` }}
            ></div>
          </div>
          <div className="credit-range">
            <span>300</span><span>850</span>
          </div>
        </div>
      </div>

      {saved && (
        <div className="profile-saved-msg">✅ Profile updated successfully!</div>
      )}

      <div className="profile-body">
        {/* Personal Information */}
        <div className="profile-section-card">
          <div className="profile-section-header border-bottom">
            <h3>Personal Information</h3>
            {!editing && (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <Pencil size={14} /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="profile-edit-form">
              <div className="profile-field-row">
                <div className="profile-field">
                  <label>Full Name</label>
                  <input type="text" value={user.name} disabled />
                </div>
                <div className="profile-field">
                  <label>NRC Number</label>
                  <input type="text" value="123456/11/1" disabled />
                </div>
              </div>
              <div className="profile-field-row">
                <div className="profile-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="profile-field-row">
                <div className="profile-field">
                  <label>Physical Address</label>
                  <input type="text" defaultValue="45 Cairo Road, Lusaka" />
                </div>
                <div className="profile-field">
                  <label>Province</label>
                  <select defaultValue="LUS">
                    <option value="CEN">Central</option>
                    <option value="COP">Copperbelt</option>
                    <option value="EAS">Eastern</option>
                    <option value="LUA">Luapula</option>
                    <option value="LUS">Lusaka</option>
                    <option value="MUC">Muchinga</option>
                    <option value="NOR">Northern</option>
                    <option value="NWE">North-Western</option>
                    <option value="SOU">Southern</option>
                    <option value="WES">Western</option>
                  </select>
                </div>
              </div>
              <div className="profile-edit-actions">
                <button type="submit" className="save-btn"><Save size={16} /> Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">NRC Number</span>
                <span className="info-value">123456/11/1</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Physical Address</span>
                <span className="info-value">45 Cairo Road, Lusaka</span>
              </div>
              <div className="info-item">
                <span className="info-label">Province</span>
                <span className="info-value">Lusaka</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="profile-section-card">
          <h3>Security & Access</h3>
          <div className="security-list">
            <div className="security-item">
              <div className="security-left">
                <span className="security-icon"><Key size={20} /></span>
                <div>
                  <strong>Password</strong>
                  <p>Last changed 3 months ago</p>
                </div>
              </div>
              <button className="security-action-btn">Change</button>
            </div>
            <div className="security-item">
              <div className="security-left">
                <span className="security-icon"><Smartphone size={20} /></span>
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Enabled via SMS OTP</p>
                </div>
              </div>
              <span className="security-enabled"><CheckCircle2 size={14} /> Enabled</span>
            </div>
            <div className="security-item">
              <div className="security-left">
                <span className="security-icon"><Bell size={20} /></span>
                <div>
                  <strong>Payment Notifications</strong>
                  <p>Email & SMS alerts active</p>
                </div>
              </div>
              <span className="security-enabled"><CheckCircle2 size={14} /> Active</span>
            </div>
            <div className="security-item">
              <div className="security-left">
                <span className="security-icon"><ClipboardList size={20} /></span>
                <div>
                  <strong>Login Sessions</strong>
                  <p>1 active session</p>
                </div>
              </div>
              <button className="security-action-btn danger">Revoke All</button>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="profile-section-card">
          <h3>Documents & Compliance</h3>
          <div className="docs-list">
            {docs.map((doc) => (
              <div key={doc.name} className="doc-item">
                <span className="doc-icon">{doc.icon}</span>
                <span className="doc-name">{doc.name}</span>
                <div className="doc-actions">
                  <span className={`doc-status ${doc.status.toLowerCase()}`}>
                    {doc.status === 'Verified' ? <CheckCircle2 size={14} /> : <Clock size={14} />} {doc.status}
                  </span>
                  {doc.status === 'Pending' && (
                    <button 
                      className="upload-btn-small" 
                      onClick={() => handleUploadClick(doc.name)}
                      disabled={uploadingDoc === doc.name}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: uploadingDoc === doc.name ? '#e0e0e0' : '#6495ed',
                        color: uploadingDoc === doc.name ? '#616161' : 'white',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {uploadingDoc === doc.name ? (
                        <>
                          <span style={{ position: 'relative', zIndex: 2 }}>{uploadProgress}%</span>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: `${uploadProgress}%`,
                            backgroundColor: '#6495ed',
                            opacity: 0.4,
                            zIndex: 1,
                            transition: 'width 0.2s ease-out'
                          }} />
                        </>
                      ) : (
                        '📤 Upload'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
