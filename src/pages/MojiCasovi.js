import React, { useState, useEffect } from 'react';  
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';  
import './MojiCasovi.css';

export default function MojiCasovi() {
  const navigate = useNavigate();
  const { korisnik } = useAuth(); // DODAO SAM OVO
  
  const [filter, setFilter] = useState('Svi');
  const [cancelled, setCancelled] = useState([]);
  const [casovi, setCasovi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rezervacije/moje').then(data => {
      // Pretvori backend format u frontend format
      const formatirani = data.map(r => ({
        id: r.id,
        datum: new Date(r.datumVreme).toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' }) + '.',
        vreme: new Date(r.datumVreme).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }),
        tip: r.tipCasa,
        razred: r.razred,
        status: r.status.toLowerCase(),
        icon: r.tipCasa === 'Individualni' && r.razred === '1-4. razred' ? '👤' :
              r.tipCasa === 'Individualni' && r.razred === '5-8. razred' ? '📐' :
              r.tipCasa === 'Grupni' && r.razred === '1-4. razred' ? '👥' : '🏆',
        boja: r.tipCasa === 'Individualni' ? '#7C3AED' : '#F97316',
        ocena: r.ocena
      }));
      setCasovi(formatirani);
      setLoading(false);
    }).catch(err => {
      console.error('Greška pri učitavanju:', err);
      setLoading(false);
    });
  }, []);

  // ZASTITA - provera POSLE svih hooks-ova
  if (!korisnik) {
    return (
      <div className="moji-page page-enter" style={{textAlign: 'center', padding: '80px 20px'}}>
        <div style={{maxWidth: '500px', margin: '0 auto'}}>
          <div style={{fontSize: '80px', marginBottom: '20px'}}>🔒</div>
          <h2 style={{color: '#1F2937', marginBottom: '12px'}}>Prijavi se da vidiš svoje časove</h2>
          <p style={{color: '#6B7280', marginBottom: '30px'}}>
            Ovde možeš vidjeti sve svoje zakazane, završene i otkazane časove.
          </p>
          <button 
            onClick={() => navigate('/prijava')} 
            style={{
              padding: '12px 24px',
              background: '#7C3AED',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            🚀 Prijavi se
          </button>
          <button 
            onClick={() => navigate('/registracija')} 
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#7C3AED',
              border: '2px solid #7C3AED',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ✨ Registruj se
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="moji-page page-enter" style={{textAlign: 'center', padding: '80px'}}>
        <p style={{fontSize: '20px', color: '#7C3AED'}}>Učitavam časove... ⏳</p>
      </div>
    );
  }

  const statusi = ['Svi', 'Predstojeći', 'Završen', 'Otkazan'];
  const filtered = casovi.filter(c => {
    if (filter === 'Svi') return true;
    return c.status === filter.toLowerCase();
  });

  const otkaziCas = async (id) => {
    if (window.confirm('Sigurno otkazuješ čas? Otkazivanje mora biti najmanje 48h pre termina!')) {
      try {
        const res = await api.delete(`/rezervacije/${id}`);
        if (res.poruka) {
          // Osvježi listu
          const data = await api.get('/rezervacije/moje');
          const formatirani = data.map(r => ({
            id: r.id,
            datum: new Date(r.datumVreme).toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' }) + '.',
            vreme: new Date(r.datumVreme).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }),
            tip: r.tipCasa,
            razred: r.razred,
            status: r.status.toLowerCase(),
            icon: r.tipCasa === 'Individualni' && r.razred === '1-4. razred' ? '👤' :
                  r.tipCasa === 'Individualni' && r.razred === '5-8. razred' ? '📐' :
                  r.tipCasa === 'Grupni' && r.razred === '1-4. razred' ? '👥' : '🏆',
            boja: r.tipCasa === 'Individualni' ? '#7C3AED' : '#F97316',
            ocena: r.ocena
          }));
          setCasovi(formatirani);
        } else {
          alert(res.poruka || 'Greška pri otkazivanju.');
        }
      } catch (err) {
        alert('Greška: ' + err.message);
      }
    }
  };

  return (
    <div className="moji-page page-enter">

      <div className="moji-header">
        <div className="moji-header-left">
          <span className="badge">⭐ Moj profil</span>
          <h1>Moji časovi</h1>
          <p>Ovde vidiš sve zakazane i prošle časove!</p>
        </div>
        <div className="moji-avatar">
          <div className="avatar-circle">👧</div>
          <div className="avatar-info">
            <span className="avatar-name">{korisnik.ime} {korisnik.prezime}</span>
            <span className="avatar-role">{korisnik.uloga === 'Ucenik' ? 'Učenik' : korisnik.uloga}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="moji-stats">
        {[
          { num: casovi.filter(c=>c.status==='predstojeći').length, label: 'Predstojeći', icon: '📅', color: '#7C3AED', bg: '#EDE9FE' },
          { num: casovi.filter(c=>c.status==='završen').length, label: 'Završeni', icon: '✅', color: '#10B981', bg: '#ECFDF5' },
          { num: casovi.filter(c=>c.status==='otkazan').length, label: 'Otkazani', icon: '❌', color: '#EF4444', bg: '#FEF2F2' },
          { num: casovi.length, label: 'Ukupno', icon: '📚', color: '#F97316', bg: '#FFF7ED' },
        ].map((s, i) => (
          <div className="moji-stat" key={i} style={{'--s-color': s.color, '--s-bg': s.bg}}>
            <span className="ms-icon">{s.icon}</span>
            <span className="ms-num">{s.num}</span>
            <span className="ms-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="filter-bar">
        {statusi.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="casovi-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <span>🔍</span>
            <p>Nema časova za ovaj filter.</p>
          </div>
        )}
        {filtered.map(c => (
          <div
            className={`cas-item ${c.status}`}
            key={c.id}
          >
            <div className="cas-item-icon" style={{background: c.boja}}>
              {c.icon}
            </div>
            <div className="cas-item-info">
              <div className="cas-item-top">
                <span className="cas-item-tip">{c.tip} · {c.razred}</span>
                <span className={`cas-status-badge ${c.status}`}>
                  {c.status === 'predstojeći' ? '📅 Predstojeći' :
                   c.status === 'završen' ? '✅ Završen' : '❌ Otkazan'}
                </span>
              </div>
              <div className="cas-item-datum">
                📅 {c.datum} &nbsp;·&nbsp; ⏰ {c.vreme}h
              </div>
              {c.ocena && (
                <div className="cas-ocena">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className={i < c.ocena ? 'star filled' : 'star'}>★</span>
                  ))}
                  <span className="ocena-text">Ocena: {c.ocena}/5</span>
                </div>
              )}
            </div>
            {c.status === 'predstojeći' && !cancelled.includes(c.id) && (
              <button
                className="otkazivanje-btn"
                onClick={() => otkaziCas(c.id)}
              >
                ✕ Otkaži
              </button>
            )}
            {cancelled.includes(c.id) && (
              <span className="otkazan-tag">Otkazano</span>
            )}
          </div>
        ))}
      </div>

      {/* Reminder */}
      <div className="reminder-card">
        <span>⚠️</span>
        <div>
          <strong>Pravilo otkazivanja:</strong> Čas možeš otkazati <strong>najmanje 48 sati</strong> pre zakazanog termina.
          Plaćanje se vrši isključivo <strong>uživo</strong> — pre ili posle časa.
        </div>
      </div>

    </div>
  );
}