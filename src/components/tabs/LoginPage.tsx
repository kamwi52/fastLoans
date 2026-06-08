import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Aurora from './Aurora';
import { Phone, Lock, Eye, EyeOff, Shield, User, Mail, ArrowRight } from 'lucide-react';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  
  // Signup form states
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupConfirmPin, setSignupConfirmPin] = useState('');
  const [showSignupPin, setShowSignupPin] = useState(false);
  
  // Login form states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createAccount, login, isAuthenticated, user, isSignupFlow } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!signupName.trim()) {
      setError('Name is required');
      return;
    }
    if (signupPhone.trim().length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    if (!signupEmail.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (signupPin.length !== 4 || !/^\d+$/.test(signupPin)) {
      setError('PIN must be 4 digits');
      return;
    }
    if (signupPin !== signupConfirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      const success = await createAccount(signupPhone, signupEmail, signupName, signupPin);
      if (success) {
        navigate('/verify');
      } else {
        setError('Account with this phone number already exists');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedPhone = loginPhone.trim();
    if (trimmedPhone.toLowerCase() !== 'admin' && trimmedPhone.length < 10) {
      setError('Please enter a valid phone number or username');
      return;
    }
    if (loginPin.length !== 4 || !/^\d+$/.test(loginPin)) {
      setError('PIN must be 4 digits');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const success = await login(loginPhone, loginPin);
      if (success) {
        // Login successful, navigate will happen via useEffect
      } else {
        setError('Invalid phone number or PIN. Please check and try again.');
      }
      setLoading(false);
    }, 800);
  };

  if (isSignupFlow) {
    return <OtpVerifyFlow />;
  }

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
            {!isSignup ? (
              <>
                <h1>Secure Access</h1>
                <p>Enter your credentials to manage your loans</p>
              </>
            ) : (
              <>
                <h1>Create Account</h1>
                <p>Join Mulonga Group to start managing your loans</p>
              </>
            )}
          </div>
          
          {!isSignup ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="login-form">
              {error && <div className="login-error-msg">⚠️ {error}</div>}
              
              <div className="form-group">
                <label>Phone Number / Username</label>
                <div className="input-icon-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="admin or +260 9XX XXX XXX"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Secure PIN</label>
                <div className="input-icon-wrapper pin-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    placeholder="••••"
                    maxLength={4}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    disabled={loading}
                    className="pin-input"
                  />
                  <button
                    type="button"
                    className="toggle-pin-btn"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    tabIndex={-1}
                  >
                    {showLoginPin ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              
              <button type="submit" className={`login-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="login-form">
              {error && <div className="login-error-msg">⚠️ {error}</div>}
              
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-icon-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-icon-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    placeholder="+260 9XX XXX XXX"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Create PIN</label>
                <div className="input-icon-wrapper pin-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showSignupPin ? 'text' : 'password'}
                    placeholder="••••"
                    maxLength={4}
                    value={signupPin}
                    onChange={(e) => setSignupPin(e.target.value)}
                    disabled={loading}
                    className="pin-input"
                  />
                  <button
                    type="button"
                    className="toggle-pin-btn"
                    onClick={() => setShowSignupPin(!showSignupPin)}
                    tabIndex={-1}
                  >
                    {showSignupPin ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Confirm PIN</label>
                <div className="input-icon-wrapper pin-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showSignupPin ? 'text' : 'password'}
                    placeholder="••••"
                    maxLength={4}
                    value={signupConfirmPin}
                    onChange={(e) => setSignupConfirmPin(e.target.value)}
                    disabled={loading}
                    className="pin-input"
                  />
                </div>
              </div>
              
              <button type="submit" className={`login-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
          
          <div className="login-footer">
            {!isSignup ? (
              <>
                <a href="#">Forgot PIN?</a>
                <span className="dot-sep">•</span>
                <button 
                  className="signup-link"
                  onClick={() => {
                    setIsSignup(true);
                    setError('');
                  }}
                >
                  Create Account <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <button 
                className="signup-link"
                onClick={() => {
                  setIsSignup(false);
                  setError('');
                }}
              >
                Back to Login
              </button>
            )}
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

// OTP Verification Component
function OtpVerifyFlow() {
  const navigate = useNavigate();
  const { verifyOtp, completeSignup, resetSignupFlow } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOtp } = useAuth();
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: number | undefined;
    if (resendCooldown > 0) {
      timer = window.setInterval(() => setResendCooldown(c => Math.max(0, c - 1)), 1000);
    }
    return () => { if (timer) window.clearInterval(timer); };
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const resp = await sendOtp(window.sessionStorage.getItem('zf_signup_phone') || '');
      // If sendOtp returned debugCode, it's stored in sessionStorage by sendOtp
      setResendCooldown(60); // 60s cooldown
      // Optionally show debug code in dev console
      try { const dc = sessionStorage.getItem('zf_debug_otp'); if (dc) console.info('Dev OTP code:', dc); } catch {}
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Resend failed', e);
      setError('Failed to resend code. Please try again later.');
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    
    // Wait for the timeout first
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Then verify OTP
    const success = await verifyOtp(otp);
    setLoading(false);
    
    if (success) {
      completeSignup();
      navigate('/');
    } else {
      setError('Invalid OTP. Please try again');
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <Aurora amplitude={1.2} />
      </div>
      <div className="login-container">
        <div className="login-card fade-in">
          <div className="login-header">
            <h1>Verify Identity</h1>
            <p>Enter the 6-digit code sent to your phone</p>
          </div>
          <div className="login-form">
            {error && <div className="login-error-msg">⚠️ {error}</div>}
            <div className="form-group">
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6} 
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }}
                disabled={loading}
              />
            </div>
            <button 
              className={`login-submit-btn ${loading ? 'loading' : ''}`}
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <button className="signup-link" onClick={handleResend} disabled={resendCooldown > 0}>
                {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
              </button>
            </div>
            {process.env.NODE_ENV !== 'production' && (
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8, textAlign: 'center' }}>
                <em>Dev mode: check console or sessionStorage for debug OTP when Twilio is not configured.</em>
              </div>
            )}
          </div>
          <div className="login-footer">
            <button 
              className="signup-link"
              onClick={() => resetSignupFlow()}
            >
              Back to Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;