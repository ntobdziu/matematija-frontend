import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './Dashboard.css';

export default function ProfesorDashboard() {
  const navigate = useNavigate();
  const { korisnik } = useAuth();
  
  const [rezervacije, setRezervacije] = useState([]);
  const [termini, setTermini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTermin, setShowAddTermin] = useState(false);
  const [tipoviCasova, setTipoviCasova] = useState([]);
  
  const [noviTermin, setNoviTermin] = useState({
    datum: '',
    vreme: '',
    tipCasaId: '',
    mestaUkupno: 1
  });

  // Zaštita - samo profesor može pristupiti
  useEffect(() => {
    if (!korisnik || korisnik.uloga !== 'Profesor') {
      navigate('/');
    }
  }, [korisnik, navigate]);

  // Učitaj podatke
  useEffect(() => {
    const ucitajPodatke = async () => {
      try {
        const [resRez, resTip, resTer] = await Promise.all([
          api.get('/rezervacije/sve'),
          api.get('/casovi'),
          api.get('/termini') // Primer - učitaj termine za mart
        ]);
        
        setRezervacije(resRez);
        setTipoviCasova(resTip);
        setTermini(resTer);
        setLoading(false);
      } catch (err) {
        console.error('Greška:', err);
        setLoading(false);
      }
    };

    if (korisnik?.uloga === 'Profesor') {
      ucitajPodatke();
    }
  }, [korisnik]);

  const dodajTermin = async (e) => {
    e.preventDefault();
    
    try {
      const datumVreme = `${noviTermin.datum}T${noviTermin.vreme}:00`;
      
      await api.post('/termini', {
        datumVreme,
        tipCasaId: parseInt(noviTermin.tipCasaId),
        mestaUkupno: parseInt(noviTermin.mestaUkupno),
        mestaZauzeto: 0,
        aktivan: true
      });

      alert('Termin je dodat!');
      setShowAddTermin(false);
      setNoviTermin({ datum: '', vreme: '', tipCasaId: '', mestaUkupno: 1 });
      
      // Osvježi listu
      const resTer = await api.get('/termini?datum=' + noviTermin.datum);
      setTermini(resTer);
    } catch (err) {
      alert('Greška pri dodavanju termina: ' + (err.message || 'Nepoznata greška'));
    }
  };

  const obrisiTermin = async (id) => {
    if (!window.confirm('Sigurno brišeš ovaj termin?')) return;
    
    try {
      await api.delete(`/termini/${id}`);
      setTermini(termini.filter(t => t.id !== id));
      alert('Termin obrisan!');
    } catch (err) {
      alert('Greška: ' + (err.message || 'Ne može se obrisati termin'));
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '80px'}}>Učitavam... ⏳</div>;
  }

  const predstojeceRez = rezervacije.filter(r => r.status === 'Predstojeći');
  const zavrseneRez = rezervacije.filter(r => r.status === 'Završen');

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-header">
        <h1>👩‍🏫 Profesor Dashboard</h1>
        <p>Dobrodošao/la, {korisnik?.ime}!</p>
      </div>

      {/* Statistika */}
      <div className="dashboard-stats">
        <div className="stat-card" style={{'--color': '#7C3AED'}}>
          <span className="stat-icon">📅</span>
          <span className="stat-number">{predstojeceRez.length}</span>
          <span className="stat-label">Predstojeći časovi</span>
        </div>
        <div className="stat-card" style={{'--color': '#10B981'}}>
          <span className="stat-icon">✅</span>
          <span className="stat-number">{zavrseneRez.length}</span>
          <span className="stat-label">Završeni časovi</span>
        </div>
        <div className="stat-card" style={{'--color': '#F97316'}}>
          <span className="stat-icon">📊</span>
          <span className="stat-number">{rezervacije.length}</span>
          <span className="stat-label">Ukupno rezervacija</span>
        </div>
      </div>

      {/* Sekcija: Dodaj termin */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>➕ Termini</h2>
          <button 
            className="btn-primary" 
            onClick={() => setShowAddTermin(!showAddTermin)}
          >
            {showAddTermin ? 'Otkaži' : '+ Dodaj novi termin'}
          </button>
        </div>

        {showAddTermin && (
          <form className="add-form" onSubmit={dodajTermin}>
            <div className="form-row">
              <div className="form-group">
                <label>Datum *</label>
                <input 
                  type="date" 
                  value={noviTermin.datum}
                  onChange={e => setNoviTermin({...noviTermin, datum: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vreme *</label>
                <input 
                  type="time" 
                  value={noviTermin.vreme}
                  onChange={e => setNoviTermin({...noviTermin, vreme: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tip časa *</label>
                <select 
                  value={noviTermin.tipCasaId}
                  onChange={e => setNoviTermin({...noviTermin, tipCasaId: e.target.value})}
                  required
                >
                  <option value="">Izaberi tip</option>
                  {tipoviCasova.map(t => (
                    <option key={t.id} value={t.id}>{t.naziv}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Mesta *</label>
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  value={noviTermin.mestaUkupno}
                  onChange={e => setNoviTermin({...noviTermin, mestaUkupno: e.target.value})}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">Sačuvaj termin</button>
          </form>
        )}

        {/* Lista termina */}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Datum i vreme</th>
                <th>Tip časa</th>
                <th>Mesta (zauzeto/ukupno)</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {termini.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center'}}>Nema termina</td></tr>
              ) : (
                termini.map(t => (
                  <tr key={t.id}>
                    <td>{new Date(t.datumVreme).toLocaleString('sr-RS')}</td>
                    <td>{t.tipCasaNaziv || 'N/A'}</td>
                    <td>{t.mestaZauzeto || 0} / {t.mestaUkupno}</td>
                    <td>
                      <button 
                        className="btn-delete" 
                        onClick={() => obrisiTermin(t.id)}
                      >
                        🗑️ Obriši
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sekcija: Sve rezervacije */}
      <div className="dashboard-section">
        <h2>📋 Sve rezervacije</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Učenik</th>
                <th>Razred</th>
                <th>Datum</th>
                <th>Tip časa</th>
                <th>Status</th>
                <th>Napomena</th>
              </tr>
            </thead>
            <tbody>
              {rezervacije.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>Nema rezervacija</td></tr>
              ) : (
                rezervacije.map(r => (
                  <tr key={r.id}>
                    <td>{r.korisnikIme} {r.korisnikPrezime}</td>
                    <td>{r.korisnikRazred ? `${r.korisnikRazred}. razred` : 'N/A'}</td>
                    <td>{new Date(r.datumVreme).toLocaleDateString('sr-RS')}</td>
                    <td>{r.tipCasa}</td>
                    <td>
                      <span className={`status-badge status-${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.napomena || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}