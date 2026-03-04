import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';  
import './Casovi.css';

export default function Casovi() {
  const navigate = useNavigate();
  const { korisnik } = useAuth(); // DODAO SAM OVO - FALI TI OVA LINIJA!
  const [filter, setFilter] = useState('Svi');
  const [expanded, setExpanded] = useState(null);
  const [casovi, setCasovi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/casovi').then(data => {
      const obogaceniPodaci = data.map(cas => ({
        ...cas,
        icon: cas.tip === 'Individualni' && cas.razred === '1-4. razred' ? '👤' :
              cas.tip === 'Individualni' && cas.razred === '5-8. razred' ? '📐' :
              cas.tip === 'Grupni' && cas.razred === '1-4. razred' ? '👥' : '🏆',
        boja: cas.tip === 'Individualni' && cas.razred === '1-4. razred' ? '#7C3AED' :
              cas.tip === 'Individualni' && cas.razred === '5-8. razred' ? '#EC4899' :
              cas.tip === 'Grupni' && cas.razred === '1-4. razred' ? '#F97316' : '#10B981',
        bg: cas.tip === 'Individualni' && cas.razred === '1-4. razred' ? '#EDE9FE' :
            cas.tip === 'Individualni' && cas.razred === '5-8. razred' ? '#FCE7F3' :
            cas.tip === 'Grupni' && cas.razred === '1-4. razred' ? '#FFF7ED' : '#ECFDF5',
      }));
      setCasovi(obogaceniPodaci);
      setLoading(false);
    });
  }, []);

  // ZASTITA - provera mora biti POSLE svih hooks-ova
  if (!korisnik) {
    return (
      <div className="casovi-page page-enter" style={{textAlign: 'center', padding: '80px 20px'}}>
        <div style={{maxWidth: '500px', margin: '0 auto'}}>
          <div style={{fontSize: '80px', marginBottom: '20px'}}>🔒</div>
          <h2 style={{color: '#1F2937', marginBottom: '12px'}}>Prijavi se da vidiš časove</h2>
          <p style={{color: '#6B7280', marginBottom: '30px'}}>
            Mораš biti prijavljen da bi video dostupne časove i mogao da ih zakazuješ.
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

  const filteri = ['Svi', 'Individualni', 'Grupni'];
  const filtrirani = filter === 'Svi' ? casovi : casovi.filter(c => c.tip === filter);

  if (loading) {
    return <div className="casovi-page page-enter" style={{textAlign: 'center', padding: '80px'}}>
      <p style={{fontSize: '20px', color: '#7C3AED'}}>Učitavam časove... ⏳</p>
    </div>;
  }

  return (
    <div className="casovi-page page-enter">

      {/* Header */}
      <div className="casovi-header">
        <div className="casovi-header-inner">
          <span className="casovi-badge">📚 Naša ponuda</span>
          <h1>Dostupni časovi</h1>
          <p>Izaberi vrstu časa koja ti najviše odgovara!</p>
        </div>
        <div className="casovi-header-shapes">
          <span>📏</span><span>📐</span><span>🔢</span>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        {filteri.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'Svi' ? '✨ Svi' : f === 'Individualni' ? '👤 Individualni' : '👥 Grupni'}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="info-banner">
        <span>💡</span>
        <div>
          <strong>Napomena:</strong> Plaćanje je uživo (pre ili posle časa). Otkazivanje je moguće najmanje 48 sata pre termina. Časovi se održavaju u Novom Pazaru.
        </div>
      </div>

      {/* Cards */}
      <div className="casovi-grid">
        {filtrirani.map(c => (
          <div
            className="cas-card"
            key={c.id}
            style={{ '--cas-color': c.boja, '--cas-bg': c.bg }}
          >
            {/* Card header */}
            <div className="cas-card-top" style={{ background: c.boja }}>
              <span className="cas-type-icon">{c.icon}</span>
              <div>
                <div className="cas-tip">{c.tip}</div>
                <div className="cas-razred">{c.razred}</div>
              </div>
              <div className="cas-cena">
                <span className="cena-num">{c.cena}</span>
                <span className="cena-valuta">RSD</span>
              </div>
            </div>

            {/* Card body */}
            <div className="cas-card-body">
              <div className="cas-trajanje">
                <span>⏱️ {c.trajanjeMinuta} minuta</span>
                {c.tip === 'Grupni' && <span>👥 Do {c.maxUcenika} učenika</span>}
              </div>
              <p className="cas-opis">{c.opis}</p>

              {/* Expandable teme */}
              <button
                className="teme-toggle"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              >
                {expanded === c.id ? '▲ Sakrij teme' : '▼ Prikaži teme'}
              </button>

              {expanded === c.id && (
                <ul className="teme-lista">
                  {c.teme.map((t, i) => (
                    <li key={i}>
                      <span className="tema-check" style={{ color: c.boja }}>✓</span> {t}
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="cas-btn"
                style={{ background: c.boja }}
                onClick={() => navigate('/zakazivanje')}
              >
                📅 Zakaži ovaj čas
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="compare-section">
        <h2>Individualno vs Grupno 🤔</h2>
        <div className="compare-table">
          <div className="compare-col header-col">
            <div className="compare-cell header"></div>
            <div className="compare-cell">💰 Cena</div>
            <div className="compare-cell">⏱️ Trajanje</div>
            <div className="compare-cell">🎯 Pažnja</div>
            <div className="compare-cell">😄 Zabava</div>
            <div className="compare-cell">📈 Tempo</div>
          </div>
          <div className="compare-col ind-col">
            <div className="compare-cell header" style={{background: '#EDE9FE', color: '#7C3AED'}}>👤 Individualno</div>
            <div className="compare-cell">800-1000 RSD</div>
            <div className="compare-cell">45-60 min</div>
            <div className="compare-cell">⭐⭐⭐⭐⭐</div>
            <div className="compare-cell">⭐⭐⭐⭐</div>
            <div className="compare-cell">Tvoj tempo</div>
          </div>
          <div className="compare-col grp-col">
            <div className="compare-cell header" style={{background: '#FFF7ED', color: '#F97316'}}>👥 Grupno</div>
            <div className="compare-cell">500-700 RSD</div>
            <div className="compare-cell">60-90 min</div>
            <div className="compare-cell">⭐⭐⭐</div>
            <div className="compare-cell">⭐⭐⭐⭐⭐</div>
            <div className="compare-cell">Grupni tempo</div>
          </div>
        </div>
      </div>

    </div>
  );
}