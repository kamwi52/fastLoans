import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Aurora from './Aurora';
import { Phone, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phone.trim().length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setLoading(true);
    // Simulate authentication delay for better UX
    setTimeout(() => {
      login(phone, pin); // Correctly passing both arguments
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <Aurora amplitude={1.2} />
      </div>
      
      <div className="login-container">
        <div className="login-card fade-in">
          <div className="login-header">
            <div className="login-company">Mulonga Group</div>
            <div className="login-logo">Target everyone's needs.</div>
            <h1>Secure Access</h1>
            <p>Enter your credentials to manage your loans</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error-msg">⚠️ {error}</div>}
            
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-icon-wrapper">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  placeholder="+260 9XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Secure PIN</label>
              <div className="input-icon-wrapper pin-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPin ? 'text' : 'password'}
                  placeholder="••••"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  disabled={loading}
                  className="pin-input"
                />
                <button
                  type="button"
                  className="toggle-pin-btn"
                  onClick={() => setShowPin(!showPin)}
                  tabIndex={-1}
                >
                  {showPin ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
            
            <button type="submit" className={`login-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>
          
          <div className="login-footer">
            <a href="#">Forgot PIN?</a>
            <span className="dot-sep">•</span>
            <a href="#">Apply for Account</a>
          </div>

          <div className="security-badge">
            <Shield size={14} />
            <span>SSL Encrypted • Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;