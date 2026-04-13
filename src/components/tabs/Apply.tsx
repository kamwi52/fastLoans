import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Apply.css';

type Step = 1 | 2 | 3 | 4 | 5;

const loanProducts = [
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: '👤',
    rate: '12.5%',
    max: 'K 5,000',
    term: '6 – 60 months',
    desc: 'For personal expenses, emergencies, or debt consolidation.',
  },
  {
    id: 'business',
    name: 'Business Loan',
    icon: '🏢',
    rate: '10.5%',
    max: 'K 10,000',
    term: '12 – 84 months',
    desc: 'Grow your business with flexible working capital.',
  },
  {
    id: 'education',
    name: 'Education Loan',
    icon: '🎓',
    rate: '8.5%',
    max: 'K 3,500',
    term: '12 – 120 months',
    desc: 'Invest in your future with affordable study financing.',
  },
  {
    id: 'auto',
    name: 'Auto Loan',
    icon: '🚗',
    rate: '11.5%',
    max: 'K 7,500',
    term: '12 – 72 months',
    desc: 'Drive your dream car with competitive vehicle finance.',
  },
];

export default function Apply() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('24');
  const [purpose, setPurpose] = useState('');
  const [income, setIncome] = useState('8500');
  const [disbursementMethod, setDisbursementMethod] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [nrcNumber, setNrcNumber] = useState('123456/11/1');
  const [idFile, setIdFile] = useState<string | null>(null);
  const [residenceFile, setResidenceFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState('employed');
  const [employerName, setEmployerName] = useState('TechCorp Zambia');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedLoan = loanProducts.find((p) => p.id === selectedProduct);

  // Centralized theme colors for design consistency (Phase 5)
  const theme = {
    primary: '#6495ed', // Lighter royal blue
    secondary: '#87ceeb',
    grayLight: '#f5f5f5',
  };

  const estimatedMonthly =
    loanAmount && loanTerm
      ? calculateMonthly(Number(loanAmount), 12.5, Number(loanTerm))
      : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    
    const payload = {
      timestamp: new Date().toISOString(),
      applicantPhone: user?.phone,
      product: selectedLoan?.name,
      amount: loanAmount,
      term: loanTerm,
      purpose: purpose,
      disbursementMethod: disbursementMethod,
      accountNumber: accountNumber,
      monthlyIncome: income,
      employmentStatus: employmentStatus,
      nrcNumber: nrcNumber,
      kycIdStatus: idFile ? 'Uploaded' : 'Missing',
      kycResStatus: residenceFile ? 'Uploaded' : 'Missing',
      employer: employerName,
      reference: `APP-${Date.now().toString().slice(-8)}`
    };

    try {
      const scriptId = import.meta.env.VITE_GOOGLE_SCRIPT_ID;
      if (!scriptId) throw new Error('Script ID not configured');
      await fetch(`https://script.google.com/macros/s/${scriptId}/exec`, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (type: 'id' | 'residence') => {
    setIsUploading(true);
    // Simulate file upload delay
    setTimeout(() => {
      if (type === 'id') setIdFile('nrc_id_copy.pdf');
      else setResidenceFile('utility_bill.pdf');
      setIsUploading(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="apply-root">
        <div className="apply-success">
          <div className="success-icon">🎉</div>
          <h2>Application Submitted!</h2>
          <div className="kyc-badge success" style={{ 
            backgroundColor: '#e8f5e9', 
            color: '#2e7d32', 
            padding: '0.5rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>✅ KYC Documents Verified</div>
          <p>
            Your {selectedLoan?.name} application for{' '}
            <strong>K {Number(loanAmount).toLocaleString('en-ZM')}</strong> has been received.
          </p>
          <p className="success-ref">
            Reference: <strong>APP-{Date.now().toString().slice(-8)}</strong>
          </p>
          <p className="success-note">
            Our team will review your application and contact you within <strong>24–48 hours</strong>.
          </p>
          <button 
            className="apply-new-btn" 
            style={{ backgroundColor: theme.primary }}
            onClick={() => { setSubmitted(false); setStep(1); setSelectedProduct(''); setLoanAmount(''); }}
          >
            Apply for Another Loan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-root">
      <div className="apply-header">
        <h2>Apply for a Loan</h2>
        <p>Complete the steps below to submit your loan application</p>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`step-item ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`} style={{ transition: 'opacity 0.3s ease' }}>
            <div className="step-circle" style={step >= s ? { backgroundColor: theme.primary, borderColor: theme.primary } : {}}>{step > s ? '✓' : s}</div>
            <span className="step-label">
              {s === 1 ? 'Product' : s === 2 ? 'Amount' : s === 3 ? 'Details' : s === 4 ? 'KYC' : 'Review'}
            </span>
            {s < 5 && <div className={`step-line ${step > s ? 'done' : ''}`}></div>}
          </div>
        ))}
      </div>

      <div className="apply-body">
        {/* Step 1: Choose Product */}
        {step === 1 && (
          <div className="apply-step fade-in">
            <h3>Choose a Loan Product</h3>
            <div className="product-grid">
              {loanProducts.map((product) => (
                <div
                  key={product.id}
                  className={`product-card ${selectedProduct === product.id ? 'selected' : ''}`}
                  style={selectedProduct === product.id ? { borderColor: theme.primary, boxShadow: `0 0 0 1px ${theme.primary}` } : {}}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="product-icon">{product.icon}</div>
                  <h4>{product.name}</h4>
                  <p className="product-desc">{product.desc}</p>
                  <div className="product-details">
                    <div className="product-detail">
                      <span>Rate</span>
                      <strong>{product.rate}</strong>
                    </div>
                    <div className="product-detail">
                      <span>Max</span>
                      <strong>{product.max}</strong>
                    </div>
                    <div className="product-detail">
                      <span>Term</span>
                      <strong>{product.term}</strong>
                    </div>
                  </div>
                  {selectedProduct === product.id && (
                    <div className="product-selected-badge">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>
            <div className="step-actions">
              <button
                className="step-next-btn"
                style={{ backgroundColor: theme.primary }}
                disabled={!selectedProduct}
                onClick={() => setStep(2)}
              >
                Next: Loan Amount →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Loan Amount */}
        {step === 2 && (
          <div className="apply-step fade-in">
            <h3>Loan Amount & Term</h3>
            <div className="amount-form">
              <div className="amount-field">
                <label>Loan Amount (ZMK)</label>
                <div className="amount-input-wrap">
                  <span>K</span>
                  <input
                    type="number"
                    min="1000"
                    max="10000"
                    step="1000"
                    placeholder="5 000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                <div className="amount-presets">
                  {[1000, 2500, 5000, 7500, 9500].map((amt) => (
                    <button key={amt} type="button" onClick={() => setLoanAmount(String(amt))}>
                      K {amt.toLocaleString('en-ZM')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="amount-field">
                <label>Repayment Term: <strong>{loanTerm} months</strong></label>
                <input
                  type="range"
                  min="6"
                  max="84"
                  step="6"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="term-slider"
                  style={{ accentColor: theme.primary }}
                />
                <div className="term-labels">
                  <span>6 months</span>
                  <span>84 months</span>
                </div>
              </div>

              {loanAmount && (
                <div className="loan-estimate">
                  <h4>Estimated Monthly Payment</h4>
                  <div className="estimate-amount" style={{ color: theme.primary }}>
                    K {estimatedMonthly.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="estimate-note">
                    Based on 12.5% p.a. interest rate. Final rate subject to credit assessment.
                  </p>
                </div>
              )}
            </div>
            <div className="step-actions">
              <button className="step-back-btn" onClick={() => setStep(1)}>← Back</button>
              <button
                className="step-next-btn"
                style={{ backgroundColor: theme.primary }}
                disabled={!loanAmount}
                onClick={() => setStep(3)}
              >
                Next: Your Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="apply-step fade-in">
            <h3>Additional Details</h3>
            <div className="details-form">
              <div className="details-field">
                <label>Purpose of Loan</label>
                <select value={purpose} onChange={(e) => setPurpose(e.target.value)} required>
                  <option value="">— Select purpose —</option>
                  <option value="debt">Debt Consolidation</option>
                  <option value="home">Home Improvement</option>
                  <option value="medical">Medical Expenses</option>
                  <option value="education">Education</option>
                  <option value="business">Business Expansion</option>
                  <option value="vehicle">Vehicle Purchase</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="details-field">
                <label>Disbursement Method</label>
                <select 
                  value={disbursementMethod} 
                  onChange={(e) => setDisbursementMethod(e.target.value)} 
                  required
                >
                  <option value="">— Select method —</option>
                  <option value="momo">Mobile Money (MTN/Airtel/Zamtel)</option>
                  <option value="xapit">Zanaco Xapit</option>
                  <option value="fnb">FNB Bank</option>
                  <option value="indo">Indo Zambia Bank</option>
                </select>
              </div>
              {disbursementMethod && (
                <div className="details-field">
                  <label>{disbursementMethod === 'momo' ? 'Mobile Money Number' : 'Account Number'}</label>
                  <input 
                    type="text" 
                    placeholder={disbursementMethod === 'momo' ? '09XXXXXXXX' : 'Enter account number'} 
                    value={accountNumber} 
                    onChange={(e) => setAccountNumber(e.target.value)} 
                    required
                  />
                </div>
              )}
              <div className="details-field">
                <label>NRC Number</label>
                <input 
                  type="text" 
                  placeholder="XXXXXX/XX/X" 
                  value={nrcNumber} 
                  onChange={(e) => setNrcNumber(e.target.value)} 
                />
              </div>
              <div className="details-field">
                <label>Monthly Income (ZMK)</label>
                <div className="amount-input-wrap">
                  <span>K</span>
                  <input 
                    type="number" 
                    placeholder="25 000" 
                    value={income} 
                    onChange={(e) => setIncome(e.target.value)} 
                  />
                </div>
              </div>
              <div className="details-field">
                <label>Employment Status</label>
                <select 
                  value={employmentStatus} 
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                >
                  <option value="employed">Permanently Employed</option>
                  <option value="contract">Contract Employee</option>
                  <option value="self">Self-Employed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div className="details-field">
                <label>Employer Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Corporation" 
                  value={employerName} 
                  onChange={(e) => setEmployerName(e.target.value)} 
                />
              </div>
              <div className="consent-check">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>
                    I consent to a credit bureau check and agree to the{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>Terms & Conditions</a> and{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
                  </span>
                </label>
              </div>
            </div>
            <div className="step-actions">
              <button className="step-back-btn" onClick={() => setStep(2)}>← Back</button>
              <button
                className="step-next-btn"
                style={{ backgroundColor: theme.primary }}
                disabled={!purpose || !disbursementMethod || !accountNumber}
                onClick={() => setStep(4)}
              >
                Next: KYC Uploads →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: KYC Documents */}
        {step === 4 && (
          <div className="apply-step fade-in">
            <h3>KYC Documentation</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Please upload your supporting documents to verify your identity.</p>
            
            <div className="kyc-upload-grid" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="kyc-upload-card" style={{ padding: '1.25rem', border: '1px solid #e0e0e0', borderRadius: '12px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Identity Document (NRC)</h4>
                    <p style={{ fontSize: '0.85rem', color: '#9e9e9e', margin: '4px 0 0' }}>Clear photo or PDF of your NRC</p>
                  </div>
                  {idFile ? (
                    <span style={{ color: '#10b981', fontWeight: 600 }}>✅ {idFile}</span>
                  ) : (
                    <button 
                      onClick={() => handleFileUpload('id')}
                      className="upload-btn"
                      disabled={isUploading}
                      style={{ padding: '0.6rem 1rem', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      {isUploading ? 'Uploading...' : '📤 Upload'}
                    </button>
                  )}
                </div>
              </div>

              <div className="kyc-upload-card" style={{ padding: '1.25rem', border: '1px solid #e0e0e0', borderRadius: '12px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Proof of Residence</h4>
                    <p style={{ fontSize: '0.85rem', color: '#9e9e9e', margin: '4px 0 0' }}>Utility bill or lease agreement</p>
                  </div>
                  {residenceFile ? (
                    <span style={{ color: '#10b981', fontWeight: 600 }}>✅ {residenceFile}</span>
                  ) : (
                    <button 
                      onClick={() => handleFileUpload('residence')}
                      className="upload-btn"
                      disabled={isUploading}
                      style={{ padding: '0.6rem 1rem', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      {isUploading ? 'Uploading...' : '📤 Upload'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button className="step-back-btn" onClick={() => setStep(3)}>← Back</button>
              <button
                className="step-next-btn"
                style={{ backgroundColor: theme.primary }}
                disabled={!idFile || !residenceFile || isUploading}
                onClick={() => setStep(5)}
              >
                Next: Final Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="apply-step fade-in">
            <h3>Review Your Application</h3>
            <div className="review-card">
              <div className="review-row">
                <span>Loan Product</span>
                <strong>{selectedLoan?.icon} {selectedLoan?.name}</strong>
              </div>
              <div className="review-row">
                <span>Loan Amount</span>
                <strong>K {Number(loanAmount).toLocaleString('en-ZM')}</strong>
              </div>
              <div className="review-row">
                <span>Repayment Term</span>
                <strong>{loanTerm} months</strong>
              </div>
              <div className="review-row">
                <span>Est. Monthly Payment</span>
                <strong style={{ color: theme.primary }}>K {estimatedMonthly.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="review-row">
                <span>Purpose</span>
                <strong>{purpose}</strong>
              </div>
              <div className="review-row">
                <span>Disbursement</span>
                <strong>{disbursementMethod.toUpperCase()} ({accountNumber})</strong>
              </div>
              <div className="review-row">
                <span>NRC Number</span>
                <strong>{nrcNumber}</strong>
              </div>
              <div className="review-row">
                <span>KYC Status</span>
                <strong style={{ color: '#10b981' }}>Documents Uploaded</strong>
              </div>
              <div className="review-row">
                <span>Interest Rate (est.)</span>
                <strong>12.5% p.a.</strong>
              </div>
            </div>
            <div className="review-disclaimer">
              ⚠️ This is an indicative quote. Final terms are subject to credit assessment and approval.
            </div>
            <div className="step-actions">
              <button className="step-back-btn" onClick={() => setStep(4)}>← Back</button>
              <button
                className={`step-submit-btn ${submitting ? 'loading' : ''}`}
                style={{ backgroundColor: theme.primary }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <><span className="spinner"></span> Submitting…</>
                ) : (
                  '🚀 Submit Application'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function calculateMonthly(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
