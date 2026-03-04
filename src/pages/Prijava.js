import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './Auth.css';

export default function Prijava() {
  const navigate = useNavigate();
  const { prijava } = useAuth();
  const [form, setForm] = useState({ email: '', lozinka: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.lozinka) {
      setError('Molimo popuni sva polja!');
      return;
    }
    
    try {
      const res = await api.post('/auth/prijava', { 
        email: form.email, 
        lozinka: form.lozinka 
      });
      
      if (res.token) {
        prijava(res.token, res.korisnik);
        setSubmitted(true);
      } else {
        setError(res.poruka || 'Pogrešan email ili lozinka.');
      }
    } catch (err) {
      setError('Greška pri prijavi. Provjeri podatke i pokušaj ponovo.');
    }
  };

  if (submitted) {
    return (
      <div className="auth-page page-enter">
        <div className="auth-success">
          <div className="auth-success-icon">🎉</div>
          <h2>Dobrodošla/o nazad!</h2>
          <p>Uspješno si se prijavila/o!</p>
          <button className="auth-submit" onClick={() => navigate('/')}>
            Idi na početnu →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-layout">

        {/* Left decorative panel */}
        <div className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-panel-logo">
              <span></span>
              <span>Matema<em>TI</em>&amp;JA</span>
            </div>
            <h2>Zdravo! 👋</h2>
            <p>Prijavi se i nastavi sa učenjem matematike!</p>
            <div className="auth-math-deco">
              <div className="math-bubble" style={{background:'#FBBF24', top:'10%', left:'5%'}}>+</div>
              <div className="math-bubble" style={{background:'#EC4899', bottom:'15%', right:'10%'}}>π</div>
              <div className="math-bubble" style={{background:'#10B981', top:'40%', right:'5%'}}>×</div>
              <div className="math-bubble" style={{background:'#3B82F6', bottom:'30%', left:'8%'}}>∑</div>
            </div>
            <div className="auth-info-cards">
              <div className="auth-info-card">📅 Zakazuj časove online</div>
              <div className="auth-info-card">🧮 Vežbaj interaktivno</div>
              <div className="auth-info-card">⭐ Prati napredak</div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="auth-form-wrap">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2>Prijavi se</h2>
              <p>Nemaš nalog? <button className="auth-link" onClick={() => navigate('/registracija')}>Registruj se →</button></p>
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="auth-field">
                <label>Email adresa</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email-login"
                    placeholder="tvoj@email.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>
                  Lozinka
                  {/* <button type="button" className="forgot-link">Zaboravljena lozinka?</button> */}
                </label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password-login"
                    placeholder="••••••••"
                    value={form.lozinka}
                    onChange={e => setForm({...form, lozinka: e.target.value})}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit">
                🚀 Prijavi se
              </button>

              <div className="auth-divider"><span>ili nastavi sa</span></div>

              <div className="auth-roles">
                <span>Prijavi se kao:</span>
                <button type="button" className="role-btn">👤 Učenik</button>
                <button type="button" className="role-btn">👩‍🏫 Profesor</button>
                <button type="button" className="role-btn">🛡️ Admin</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}