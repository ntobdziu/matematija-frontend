import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './Auth.css';

export default function Registracija() {
  const navigate = useNavigate();
  const { prijava } = useAuth();
  const [form, setForm] = useState({
    ime: '', prezime: '', email: '', lozinka: '', potvrdaLozinke: '', razred: '', uloga: 'ucenik'
  });
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ime || !form.prezime || !form.email || !form.lozinka) {
      setError('Molimo popuni sva obavezna polja!');
      return;
    }
    if (form.lozinka !== form.potvrdaLozinke) {
      setError('Lozinke se ne podudaraju!');
      return;
    }
    if (form.lozinka.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera!');
      return;
    }

    try {
      const res = await api.post('/auth/registracija', {
        ime: form.ime,
        prezime: form.prezime,
        email: form.email,
        lozinka: form.lozinka,
        uloga: form.uloga === 'profesor' ? 'Profesor' : 'Ucenik',
        razred: form.razred ? parseInt(form.razred) : null
      });

      // Automatska prijava nakon registracije (bez email verifikacije)
      if (res.token) {
        prijava(res.token, res.korisnik);
        setSubmitted(true);
      } else {
        setError(res.poruka || 'Greška pri registraciji.');
      }
    } catch (err) {
      setError('Greška pri povezivanju sa serverom.');
    }
  };

  if (submitted) {
    return (
      <div className="auth-page page-enter">
        <div className="auth-success">
          <div className="auth-success-icon">🌟</div>
          <h2>Dobrodošla/o, {form.ime}!</h2>
          <p>Tvoj nalog je uspješno kreiran! Sada možeš zakazivati časove.</p>
          <button className="auth-submit" onClick={() => navigate('/zakazivanje')}>
            📅 Zakaži prvi čas!
          </button>
        </div>
      </div>
    );
  }

  const strengthCheck = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#E5E7EB' };
    if (pass.length < 6) return { score: 1, label: 'Slaba', color: '#EF4444' };
    if (pass.length < 8) return { score: 2, label: 'Srednja', color: '#FBBF24' };
    return { score: 3, label: 'Jaka 💪', color: '#10B981' };
  };
  const strength = strengthCheck(form.lozinka);

  return (
    <div className="auth-page page-enter">
      <div className="auth-layout">

        {/* Left panel */}
        <div className="auth-panel reg-panel">
          <div className="auth-panel-inner">
            <div className="auth-panel-logo">
              <span></span>
              <span>Matema<em>TI</em>&amp;JA</span>
            </div>
            <h2>Pridruži se! 🚀</h2>
            <p>Kreiraj nalog i počni sa učenjem matematike!</p>
            <div className="auth-math-deco">
              <div className="math-bubble" style={{background:'#FBBF24', top:'8%', left:'8%'}}>÷</div>
              <div className="math-bubble" style={{background:'#EC4899', bottom:'20%', right:'5%'}}>√</div>
              <div className="math-bubble" style={{background:'#14B8A6', top:'35%', right:'8%'}}>∞</div>
              <div className="math-bubble" style={{background:'#F97316', bottom:'35%', left:'5%'}}>△</div>
            </div>
            <div className="auth-info-cards">
              <div className="auth-info-card">✅ Besplatna registracija</div>
              <div className="auth-info-card">📅 Zakazuj časove 24/7</div>
              <div className="auth-info-card">🏆 Prati svoja dostignuća</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="auth-form-wrap">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2>Registracija</h2>
              <p>Već imaš nalog? <button className="auth-link" onClick={() => navigate('/prijava')}>Prijavi se →</button></p>
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} autoComplete="off">

              {/* Role select */}
              <div className="auth-field">
                <label>Registruj se kao</label>
                <div className="role-toggle">
                  {['ucenik', 'profesor'].map(r => (
                    <button
                      type="button"
                      key={r}
                      className={`role-toggle-btn ${form.uloga === r ? 'active' : ''}`}
                      onClick={() => setForm({...form, uloga: r})}
                    >
                      {r === 'ucenik' ? '👤 Učenik' : '👩‍🏫 Profesor'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="auth-row">
                <div className="auth-field">
                  <label>Ime *</label>
                  <div className="input-wrap">
                    <span className="input-icon">😊</span>
                    <input
                      type="text" 
                      name="firstname-reg"
                      placeholder="Ana"
                      value={form.ime}
                      onChange={e => setForm({...form, ime: e.target.value})}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label>Prezime *</label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input
                      type="text" 
                      name="lastname-reg"
                      placeholder="Petrović"
                      value={form.prezime}
                      onChange={e => setForm({...form, prezime: e.target.value})}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="auth-field">
                <label>Email adresa *</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email" 
                    name="email-reg"
                    placeholder="tvoj@email.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              {form.uloga === 'ucenik' && (
                <div className="auth-field">
                  <label>Razred</label>
                  <div className="input-wrap">
                    <span className="input-icon">📚</span>
                    <select
                      value={form.razred}
                      onChange={e => setForm({...form, razred: e.target.value})}
                      style={{
                        width: '100%', padding: '14px 16px 14px 48px',
                        border: 'none', background: 'transparent',
                        fontFamily: 'Nunito, sans-serif', fontSize: '15px',
                        color: form.razred ? '#1E1B4B' : '#9CA3AF'
                      }}
                    >
                      <option value="">Izaberi razred</option>
                      {[1,2,3,4,5,6,7,8].map(r => (
                        <option key={r} value={r}>{r}. razred</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label>Lozinka *</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password-reg"
                    placeholder="Minimum 6 karaktera"
                    value={form.lozinka}
                    onChange={e => setForm({...form, lozinka: e.target.value})}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.lozinka && (
                  <div className="strength-bar">
                    <div className="strength-track">
                      {[1,2,3].map(i => (
                        <div
                          key={i}
                          className="strength-seg"
                          style={{background: i <= strength.score ? strength.color : '#E5E7EB'}}
                        />
                      ))}
                    </div>
                    <span style={{color: strength.color, fontSize: '12px', fontWeight: 700}}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label>Potvrda lozinke *</label>
                <div className="input-wrap">
                  <span className="input-icon">🔐</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password-confirm-reg"
                    placeholder="Ponovi lozinku"
                    value={form.potvrdaLozinke}
                    onChange={e => setForm({...form, potvrdaLozinke: e.target.value})}
                    autoComplete="new-password"
                    required
                  />
                  {form.potvrdaLozinke && (
                    <span className="pass-match">
                      {form.lozinka === form.potvrdaLozinke ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>

              <button type="submit" className="auth-submit">
                🌟 Kreiraj nalog!
              </button>

              <p className="auth-terms">
                Registracijom prihvataš naša pravila korišćenja. Plaćanje se vrši isključivo uživo.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}