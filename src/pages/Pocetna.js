import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pocetna.css';

const features = [
  {
    icon: '📅',
    title: 'Zakaži čas',
    desc: 'Izaberi slobodan termin i zakaži čas za sebe ili grupu!',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
  {
    icon: '📚',
    title: 'Individualno ili grupno',
    desc: 'Časovi su dostupni za jednog učenika ili malu grupu.',
    color: '#EC4899',
    bg: '#FCE7F3',
  },
  {
    icon: '🧮',
    title: 'Vežbaj matematiku',
    desc: 'Reši zadatke i igrajte matematičke igre online!',
    color: '#F97316',
    bg: '#FFF7ED',
  },
  {
    icon: '⭐',
    title: 'Prati napredak',
    desc: 'Vidi sve zakazane časove i rezultate vežbanja na jednom mestu.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
];

const stats = [
  { num: '1', label: 'Profesor', icon: '👩‍🏫' },
  { num: '48h', label: 'Otkazivanje', icon: '⏰' },
  { num: '∞', label: 'Zadataka', icon: '🧠' },
  { num: '100%', label: 'Zabavno', icon: '🎉' },
];

export default function Pocetna() {
  const navigate = useNavigate();

  return (
    <div className="pocetna page-enter">

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-blobs">
          <div className="blob blob1" />
          <div className="blob blob2" />
          <div className="blob blob3" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">🎓 Privatni časovi matematike · Novi Pazar</div>
          <h1 className="hero-title">
            Učenje matematike<br />
            može biti <span className="hero-highlight">zabavno</span>! 🎉
          </h1>
          <p className="hero-subtitle">
            Dobrodošli na <strong>MatemaTI&amp;JA</strong> — platformu za online zakazivanje
            časova matematike sa interaktivnim vežbanjem. Zakaži termin, vežbaj i napreduj!
          </p>
          <div className="hero-buttons">
            <button className="hero-btn primary" onClick={() => navigate('/zakazivanje')}>
              📅 Zakaži čas odmah!
            </button>
            <button className="hero-btn secondary" onClick={() => navigate('/vezbanje')}>
              🧮 Probaj vežbanje
            </button>
          </div>
        </div>

        {/* Fun math card */}
        <div className="hero-card">
          <div className="hero-card-inner">
            <div className="calc-display">
              <span className="calc-sym">∑</span>
              <span className="calc-eq">2 + 2 = ?</span>
            </div>
            <div className="calc-options">
              {['3', '4 ✓', '5', '6'].map((o, i) => (
                <button
                  key={i}
                  className={`calc-opt ${o.includes('✓') ? 'correct' : ''}`}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="calc-result">🎉 Tačno! +10 poena</div>
          </div>

          {/* Decorative shapes */}
          <div className="hero-shape s1">+</div>
          <div className="hero-shape s2">×</div>
          <div className="hero-shape s3">π</div>
          <div className="hero-shape s4">∞</div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="section-header">
          <h2>Šta sve možeš? 🚀</h2>
          <p>Sve što trebaš za uspješno učenje matematike!</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              className="feature-card"
              key={i}
              style={{ '--card-color': f.color, '--card-bg': f.bg }}
            >
              <div className="feature-icon-wrap">
                <span className="feature-icon">{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-deco">◆</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-section">
        <div className="section-header">
          <h2>Kako funkcioniše? 🤔</h2>
          <p>Tri jednostavna koraka do prvog časa!</p>
        </div>
        <div className="steps">
          {[
            { num: '1', icon: '📝', title: 'Registruj se', desc: 'Kreiraj nalog za sebe — brzo i jednostavno!', color: '#7C3AED' },
            { num: '2', icon: '📅', title: 'Zakaži termin', desc: 'Izaberi slobodan datum i vreme koje ti odgovara.', color: '#EC4899' },
            { num: '3', icon: '🎓', title: 'Pohađaj čas', desc: 'Dođi uživo u Novi Pazar i uživaj u učenju!', color: '#F97316' },
          ].map((step, i) => (
            <div className="step" key={i}>
              <div className="step-num" style={{ background: step.color }}>{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < 2 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-shapes">
            <span>+</span><span>÷</span><span>π</span><span>∑</span>
          </div>
          <h2>Spreman/na za matematiku? 🧮</h2>
          <p>Pridruži se i počni da napreduje već danas!</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => navigate('/registracija')}>
              ✨ Registruj se besplatno
            </button>
            <button className="cta-btn secondary" onClick={() => navigate('/casovi')}>
              👀 Pogledaj časove
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
