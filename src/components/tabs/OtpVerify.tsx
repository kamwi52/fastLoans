import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css'; // Reusing login styles for consistency

const OtpVerify: React.FC = () => {
  const navigate = useNavigate();
  const { verifyOtp, completeSignup } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const code = otp.trim();
    if (code.length !== 6 || !/^[0-9]{6}$/.test(code)) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const success = await verifyOtp(code);
      if (success) {
        // Make sure signup is completed and user created
        try { completeSignup(); } catch (e) { /* swallow */ }
        navigate('/');
      } else {
        alert('Invalid code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-container">
        <div className="login-card fade-in">
          <div className="login-header">
            <h1>Verify Identity</h1>
            <p>Enter the 6-digit code sent to your phone</p>
          </div>
          <div className="login-form">
            <div className="form-group">
              <input 
                type="text" 
                inputMode="numeric"
                placeholder="000000" 
                maxLength={6} 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }} 
                disabled={loading}
              />
            </div>
            <button className={`login-submit-btn ${loading ? 'loading' : ''}`} onClick={handleVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;