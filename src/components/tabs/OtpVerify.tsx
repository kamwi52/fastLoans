import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reusing login styles for consistency

const OtpVerify: React.FC = () => {
  const navigate = useNavigate();

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
              <input type="text" placeholder="000000" maxLength={6} style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }} />
            </div>
            <button className="login-submit-btn" onClick={() => navigate('/')}>
              Verify & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;