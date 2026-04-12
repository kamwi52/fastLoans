import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('+260');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateZambianPhone = (num: string) => {
    // Validates +260 followed by 9 digits starting with 7 or 9
    return /^\+260[79]\d{8}$/.test(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateZambianPhone(phone)) {
      setError('Please enter a valid Zambian phone number (+260XXXXXXXXX)');
      return;
    }
    setError('');
    await login(phone);
    navigate('/verify');
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', transition: 'opacity 0.5s ease-in' }}>
        <h2 style={{ color: '#6495ed', marginBottom: '0.5rem', fontWeight: 600 }}>Sign In</h2>
        <p style={{ color: '#9e9e9e', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter your phone number to receive a secure code.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#616161', fontSize: '0.85rem', fontWeight: 500 }}>Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '10px', 
                border: `1px solid ${error ? '#ff5252' : '#e0e0e0'}`, 
                outline: 'none',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="+260XXXXXXXXX"
            />
            {error && <p style={{ color: '#ff5252', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>}
          </div>
          
          <button 
            type="submit" 
            style={{ width: '100%', padding: '0.85rem', backgroundColor: '#6495ed', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', transition: 'all 0.2s' }}
          >
            Get Verification Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;