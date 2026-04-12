import { useState } from 'react';
import type { AuthView } from '../types';
import { VALID_CREDENTIALS } from '../data/mockData';
import '../styles/LoginPage.css';

interface LoginPageProps {
  onLogin: (view: AuthView) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (
        email === VALID_CREDENTIALS.email &&
        password === VALID_CREDENTIALS.password
      ) {
        onLogin('otp');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 1200);
  };

  const fillDemo = () => {
    setEmail(VALID_CREDENTIALS.email);
    setPassword(VALID_CREDENTIALS.password);
  };

  return (
    <div className="login-root">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="brand-logo">
            <span className="brand-icon">⬡</span>
            <span className="brand-name">LendSphere</span>
          </div>
          <h1 className="login-tagline">
            Smart Lending,<br />
            <span className="tagline-accent">Smarter Future.</span>
          </h1>
          <p className="login-sub">
            Access your loan portfolio, track repayments, and manage your
            financial journey — all in one secure place.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div>
                <strong>Bank-Grade Security</strong>
                <p>256-bit SSL encryption & 2FA protection</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <strong>Instant Decisions</strong>
                <p>AI-powered credit assessment in minutes</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <strong>Real-Time Insights</strong>
                <p>Live loan tracking & payment analytics</p>
              </div>
            </div>
          </div>

          <div className="trust-badges">
            <span className="badge">🏦 NCR Registered</span>
            <span className="badge">✅ FSCA Compliant</span>
            <span className="badge">🛡️ POPIA Protected</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="mobile-brand">
              <span className="brand-icon">⬡</span>
              <span className="brand-name">LendSphere</span>
            </div>
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
                <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Authenticating…
                </>
              ) : (
                'Sign In Securely'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="demo-btn" onClick={fillDemo}>
            🚀 Use Demo Credentials
          </button>

          <p className="register-link">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Apply for a loan
            </a>
          </p>

          <p className="security-note">
            🔒 Your connection is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
