import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Aurora from './Aurora';
import { Phone, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (loginMethod === 'phone') {
      if (phone.trim().length < 10) {
        setError('Please enter a valid phone number');
        return;
      }
    } else {
      if (!email.includes('@')) {
        setError('Please enter a valid email');
        return;
      }
    }

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setLoading(true);
    // Simulate authentication delay for better UX
    setTimeout(() => {
      login(phone || email, pin, email || undefined);
      setLoading(false);
      
      // Redirect based on role - determine role from login logic
      const isAdmin = 
        phone === '0999999999' || 
        email === 'admin@targeteveryone.com' ||
        phone.includes('admin') ||
        email?.includes('admin');
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
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
            
            {/* Login Method Toggle */}
            <div className="login-method-toggle">
              <button
                type="button"
                className={`toggle-btn ${loginMethod === 'phone' ? 'active' : ''}`}
                onClick={() => setLoginMethod('phone')}
              >
                Phone
              </button>
              <button
                type="button"
                className={`toggle-btn ${loginMethod === 'email' ? 'active' : ''}`}
                onClick={() => setLoginMethod('email')}
              >
                Email
              </button>
            </div>
            
            {loginMethod === 'phone' ? (
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-icon-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    placeholder="+260 9XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-icon-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            
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