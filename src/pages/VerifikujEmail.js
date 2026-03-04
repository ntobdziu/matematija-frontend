import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function VerifikujEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prijava } = useAuth();
  const korisnikId = location.state?.korisnikId;
  
  const [kod, setKod] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await api.post('/auth/verifikuj-email', {
        korisnikId,
        kod
      });
      
      if (res.token) {
        prijava(res.token, res.korisnik);
        navigate('/');
      } else {
        setError(res.poruka || 'Greška pri verifikaciji.');
      }
    } catch (err) {
      setError('Greška. Pokušaj ponovo.');
    }
  };

  return (
    <div className="auth-page page-enter" style={{textAlign: 'center', padding: '80px 20px'}}>
      <div style={{maxWidth: '400px', margin: '0 auto'}}>
        <h2>📧 Potvrdi email</h2>
        <p style={{color: '#6B7280', marginBottom: '24px'}}>
          Poslali smo 6-cifreni kod na tvoj email. Unesi ga ovdje:
        </p>
        
        {error && <div style={{background: '#FEF2F2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '16px'}}>
          ⚠️ {error}
        </div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            placeholder="123456"
            value={kod}
            onChange={e => setKod(e.target.value.replace(/\D/g, ''))}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '24px',
              textAlign: 'center',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              marginBottom: '16px',
              letterSpacing: '8px'
            }}
            required
          />
          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            background: '#7C3AED',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Potvrdi
          </button>
        </form>
      </div>
    </div>
  );
}