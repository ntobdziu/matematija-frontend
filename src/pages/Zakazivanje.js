import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Zakazivanje.css';
import { api } from '../services/api';

const meseci = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avg','Septembar','Oktobar','Novembar','Decembar'];
const daniSedmice = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
}

export default function Zakazivanje() {
  const navigate = useNavigate();
  const { korisnik } = useAuth(); // DODAO SAM OVO
  
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTermin, setSelectedTermin] = useState(null);
  const [selectedTerminId, setSelectedTerminId] = useState(null);
  const [tipCasa, setTipCasa] = useState('');
  const [form, setForm] = useState({ ime: '', email: '', napomena: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  // Podaci sa backenda
  const [termini, setTermini] = useState([]);
  const [tipoviCasova, setTipoviCasova] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminiZaDan, setTerminiZaDan] = useState([]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  // Ucitaj tipove casova
  useEffect(() => {
    api.get('/casovi').then(data => {
      setTipoviCasova(data);
      setLoading(false);
    });
  }, []);

  // Ucitaj termine za odabrani mesec
  useEffect(() => {
    const mesecStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    api.get(`/termini/slobodni?mesec=${mesecStr}`).then(data => {
      setTermini(data);
    });
  }, [year, month]);

  // Ucitaj termine za odabrani dan
  useEffect(() => {
    if (selectedDay) {
      const datum = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      api.get(`/termini?datum=${datum}`).then(data => {
        setTerminiZaDan(data);
      });
    }
  }, [selectedDay, year, month]);

  // ZASTITA - provera POSLE svih hooks-ova
  if (!korisnik) {
    return (
      <div className="zakazivanje-page page-enter" style={{textAlign: 'center', padding: '80px 20px'}}>
        <div style={{maxWidth: '500px', margin: '0 auto'}}>
          <div style={{fontSize: '80px', marginBottom: '20px'}}>🔒</div>
          <h2 style={{color: '#1F2937', marginBottom: '12px'}}>Prijavi se da zakazuješ časove</h2>
          <p style={{color: '#6B7280', marginBottom: '30px'}}>
            Mораš imati nalog da bi mogao/la da zakazuješ časove.
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

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
    setSelectedTermin(null);
    setSelectedTerminId(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
    setSelectedTermin(null);
    setSelectedTerminId(null);
  };

  // Proveri da li dan ima slobodnih termina
  const imaTermina = (day) => {
    const datum = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return termini.includes(datum);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTerminId) {
      setError('Morate izabrati termin!');
      return;
    }
    
    try {
      const res = await api.post('/rezervacije', {
        terminId: selectedTerminId,
        napomena: form.napomena
      });
      
      if (res.rezervacijaId) {
        setSubmitted(true);
        setError('');
      } else {
        setError(res.poruka || 'Greška pri zakazivanju.');
      }
    } catch (err) {
      setError('Greška pri povezivanju sa serverom.');
    }
  };

  if (loading) {
    return (
      <div className="zakazivanje-page page-enter" style={{textAlign: 'center', padding: '80px'}}>
        <p style={{fontSize: '20px', color: '#7C3AED'}}>Učitavam termine... ⏳</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="zakazivanje-page page-enter">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Čas je zakazan!</h2>
          <p>Vidimo se <strong>{selectedDay}. {meseci[month]} {year}.</strong> u <strong>{selectedTermin}h</strong>!</p>
          <p style={{color: '#6B7280', marginTop: 8}}>Tip časa: {tipCasa}</p>
          <div className="success-reminder">
            <span>⚠️</span> Ako trebaš otkazati čas, to uradi najmanje 48 sati ranije!
          </div>
          <button className="success-btn" onClick={() => { 
            setSubmitted(false); 
            setSelectedDay(null); 
            setSelectedTermin(null);
            setSelectedTerminId(null);
            setTipCasa('');
            setForm({ ime: '', email: '', napomena: '' });
          }}>
            Zakaži još jedan čas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="zakazivanje-page page-enter">

      <div className="zakazivanje-header">
        <span className="badge">📅 Zakazivanje</span>
        <h1>Zakaži čas</h1>
        <p>Izaberi datum, vreme i tip časa koji ti odgovara!</p>
      </div>

      {error && (
        <div style={{
          background: '#FEF2F2', 
          border: '1px solid #FCA5A5', 
          padding: '12px 16px', 
          borderRadius: '8px',
          color: '#B91C1C',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div className="zakazivanje-layout">

        {/* Left: Calendar */}
        <div className="calendar-section">
          <div className="calendar-card">
            <div className="calendar-nav">
              <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
              <span className="cal-month-title">{meseci[month]} {year}</span>
              <button className="cal-nav-btn" onClick={nextMonth}>›</button>
            </div>

            {/* Day names */}
            <div className="calendar-grid header-row">
              {daniSedmice.map(d => (
                <div className="cal-cell day-name" key={d}>{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="calendar-grid">
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`e${i}`} className="cal-cell empty" />
              ))}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const isSelected = selectedDay === day;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const imaTermine = imaTermina(day);
                
                return (
                  <button
                    key={day}
                    className={`cal-cell cal-day ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''} ${isToday ? 'today' : ''} ${imaTermine ? 'ima-termine' : ''}`}
                    onClick={() => { 
                      if (!isPast) { 
                        setSelectedDay(day); 
                        setSelectedTermin(null);
                        setSelectedTerminId(null);
                      } 
                    }}
                    disabled={isPast}
                    style={imaTermine && !isPast ? { fontWeight: 700, color: '#7C3AED' } : {}}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="cal-legend">
              <span className="leg-item"><span className="leg-dot today-dot" /> Danas</span>
              <span className="leg-item"><span className="leg-dot sel-dot" /> Izabran dan</span>
              <span className="leg-item"><span className="leg-dot past-dot" /> Prošlo</span>
            </div>
          </div>

          {/* Termini */}
          {selectedDay && (
            <div className="termini-card">
              <h3>Slobodni termini za <span>{selectedDay}. {meseci[month]}</span></h3>
              {terminiZaDan.length === 0 ? (
                <p style={{textAlign: 'center', color: '#6B7280', padding: '20px'}}>
                  Nema slobodnih termina za ovaj dan 😔
                </p>
              ) : (
                <div className="termini-grid">
                  {terminiZaDan.map(t => {
                    const vreme = new Date(t.datumVreme).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
                    const zauzet = !t.imaSlobodnihMesta;
                    const izabran = selectedTerminId === t.id;
                    
                    return (
                      <button
                        key={t.id}
                        className={`termin-btn ${zauzet ? 'zauzet' : ''} ${izabran ? 'selected' : ''}`}
                        onClick={() => {
                          if (!zauzet) {
                            setSelectedTermin(vreme);
                            setSelectedTerminId(t.id);
                            if (!tipCasa && t.tipCasaNaziv) {
                              setTipCasa(t.tipCasaNaziv);
                            }
                          }
                        }}
                        disabled={zauzet}
                      >
                        {vreme}
                        <span style={{fontSize: '11px', display: 'block', marginTop: '2px', opacity: 0.7}}>
                          {t.tipCasaNaziv}
                        </span>
                        {zauzet && <span className="zauzet-label">zauzeto</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div className="form-section">
          <form className="zakaz-form" onSubmit={handleSubmit}>
            <h2>Tvoji podaci</h2>

            {/* Summary */}
            <div className="booking-summary">
              <div className="sum-item">
                <span className="sum-icon">📅</span>
                <span>{selectedDay ? `${selectedDay}. ${meseci[month]} ${year}` : 'Izaberi datum'}</span>
              </div>
              <div className="sum-item">
                <span className="sum-icon">⏰</span>
                <span>{selectedTermin || 'Izaberi termin'}</span>
              </div>
            </div>

            {/* Tip casa */}
            <div className="form-group">
              <label>Tip časa *</label>
              <div className="tip-options">
                {tipoviCasova.map(opt => {
                  const icon = opt.tip === 'Individualni' && opt.razred === '1-4. razred' ? '👤' :
                               opt.tip === 'Individualni' && opt.razred === '5-8. razred' ? '📐' :
                               opt.tip === 'Grupni' && opt.razred === '1-4. razred' ? '👥' : '🏆';
                  
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      className={`tip-opt ${tipCasa === opt.naziv ? 'selected' : ''}`}
                      onClick={() => setTipCasa(opt.naziv)}
                    >
                      <span className="tip-opt-icon">{icon}</span>
                      <span className="tip-opt-name">{opt.naziv}</span>
                      <span className="tip-opt-price">{opt.cena} RSD</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ime">Ime i prezime *</label>
              <input
                id="ime" type="text" placeholder="Npr. Ana Petrović"
                required value={form.ime}
                onChange={e => setForm({...form, ime: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email adresa *</label>
              <input
                id="email" type="email" placeholder="ana@mail.com"
                required value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="napomena">Napomena (opciono)</label>
              <textarea
                id="napomena" rows="3"
                placeholder="Napiši nešto što bi profesor trebao znati..."
                value={form.napomena}
                onChange={e => setForm({...form, napomena: e.target.value})}
              />
            </div>

            <div className="napomena-box">
              <span>⚠️</span>
              <p>Plaćanje je isključivo <strong>uživo</strong> — pre ili posle časa. Otkazivanje je moguće najkasnije <strong>48 sati</strong> pre termina.</p>
            </div>

            <button
              type="submit"
              className={`submit-btn ${!selectedDay || !selectedTerminId || !tipCasa || !form.ime || !form.email ? 'disabled' : ''}`}
              disabled={!selectedDay || !selectedTerminId || !tipCasa || !form.ime || !form.email}
            >
              📅 Potvrdi zakazivanje!
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}