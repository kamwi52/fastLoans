import { useState, useRef, useEffect } from 'react';
import type { AuthView } from '../types';
import '../styles/OtpVerify.css';

interface OtpVerifyProps {
  onVerify: (view: AuthView) => void;
  onBack: () => void;
}

const CORRECT_OTP = '482916';

export default function OtpVerify({ onVerify, onBack }: OtpVerifyProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(CORRECT_OTP);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array(6).fill('');
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (code === generatedOtp) {
        onVerify('dashboard');
      } else {
        setError('Incorrect OTP. Please try again.');
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
      setLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtp(Array(6).fill(''));
    setError('');
    setResendTimer(59);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    alert(`Demo: Your new OTP is ${newCode}`);
  };

  return (
    <div className="otp-root">
      <div className="otp-card">
        <div className="otp-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">LendSphere</span>
        </div>

        <div className="otp-icon-wrap">
          <div className="otp-shield">🛡️</div>
        </div>

        <h2 className="otp-title">Two-Factor Authentication</h2>
        <p className="otp-desc">
          We sent a 6-digit verification code to<br />
          <strong>t***o@email.com</strong>
        </p>

        <div className="otp-hint-box">
          <span>💡</span>
          <span>Demo OTP: <strong>{generatedOtp}</strong></span>
        </div>

        {error && (
          <div className="otp-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`otp-input ${digit ? 'filled' : ''} ${error ? 'error' : ''}`}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          className={`otp-verify-btn ${loading ? 'loading' : ''}`}
          onClick={handleVerify}
          disabled={loading || otp.join('').length < 6}
        >
          {loading ? (
            <><span className="spinner"></span> Verifying…</>
          ) : (
            'Verify & Sign In'
          )}
        </button>

        <div className="otp-resend">
          {canResend ? (
            <button className="resend-btn" onClick={handleResend}>
              🔄 Resend OTP
            </button>
          ) : (
            <p>Resend code in <strong>0:{String(resendTimer).padStart(2, '0')}</strong></p>
          )}
        </div>

        <button className="otp-back-btn" onClick={onBack}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
