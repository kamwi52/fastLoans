import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css'; // Reusing login styles for consistency

const OtpVerify: React.FC = () => {
  const navigate = useNavigate();
  const { verifyOtp, phoneNumber } = useAuth();
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.length === 6) {
      const success = await verifyOtp(otp);
      if (success) navigate('/');
    } else {
      alert('Please enter a 6-digit code');
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
                placeholder="000000" 
                maxLength={6} 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }} 
              />
            </div>
            <button className="login-submit-btn" onClick={handleVerify}>
              Verify & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;