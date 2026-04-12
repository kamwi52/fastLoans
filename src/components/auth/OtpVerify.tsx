import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OtpVerify: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { verifyOtp, phoneNumber } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    const success = await verifyOtp(otp);
    setIsVerifying(false);
    if (success) {
      navigate('/');
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#6495ed', marginBottom: '0.5rem', fontWeight: 600 }}>Verify Code</h2>
        <p style={{ color: '#9e9e9e', marginBottom: '2rem', fontSize: '0.9rem' }}>
          We've sent a 6-digit code to <br/><strong>{phoneNumber}</strong>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          style={{ 
            letterSpacing: '0.8rem', 
            fontSize: '1.75rem', 
            padding: '1rem', 
            textAlign: 'center', 
            width: '100%', 
            borderRadius: '12px', 
            border: '2px solid #e0e0e0', 
            outline: 'none', 
            marginBottom: '1.5rem',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ marginBottom: '2rem', fontSize: '0.85rem' }}>
          {timer > 0 ? (
            <span style={{ color: '#9e9e9e' }}>Resend code in <strong style={{ color: '#6495ed' }}>{timer}s</strong></span>
          ) : (
            <button 
              onClick={() => setTimer(60)} 
              style={{ background: 'none', border: 'none', color: '#6495ed', cursor: 'pointer', fontWeight: 600 }}
            >
              Resend Verification Code
            </button>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.length !== 6 || isVerifying}
          style={{ width: '100%', padding: '0.85rem', backgroundColor: '#6495ed', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, opacity: otp.length === 6 ? 1 : 0.6 }}
        >
          {isVerifying ? 'Verifying...' : 'Confirm & Continue'}
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;