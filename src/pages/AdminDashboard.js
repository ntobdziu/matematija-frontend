import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './Dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { korisnik } = useAuth();
  
  const [korisnici, setKorisnici] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);
  const [termini, setTermini] = useState([]);
  const [tipoviCasova, setTipoviCasova] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('korisnici'); // korisnici | rezervacije | termini
  const [showAddTermin, setShowAddTermin] = useState(false);
  
  const [noviTermin, setNoviTermin] = useState({
    datum: '',
    vreme: '',
    tipCasaId: '',
    mestaUkupno: 1
  });

  // Zaštita - samo admin može pristupiti
  useEffect(() => {
    if (!korisnik || korisnik.uloga !== 'Admin') {
      navigate('/');
    }
  }, [korisnik, navigate]);

  // Učitaj podatke
  useEffect(() => {
    const ucitajPodatke = async () => {
      try {
        const [resKor, resRez, resTip, resTer] = await Promise.all([
          api.get('/korisnici'),
          api.get('/rezervacije/sve'),
          api.get('/casovi'),
          api.get('/termini')
        ]);
        
        setKorisnici(resKor);
        setRezervacije(resRez);
        setTipoviCasova(resTip);
        setTermini(resTer);
        setLoading(false);
      } catch (err) {
        console.error('Greška:', err);
        setLoading(false);
      }
    };

    if (korisnik?.uloga === 'Admin') {
      ucitajPodatke();
    }
  }, [korisnik]);

  const obrisiKorisnika = async (id, uloga) => {
    if (uloga === 'Admin' || uloga === 'Profesor') {
      alert('Ne možeš obrisati administratora ili profesora!');
      return;
    }

    if (!window.confirm('Sigurno brišeš ovog korisnika?')) return;
    
    try {
      await api.delete(`/korisnici/${id}`);
      setKorisnici(korisnici.filter(k => k.id !== id));
      alert('Korisnik obrisan!');
    } catch (err) {
      alert('Greška: ' + (err.message || 'Ne može se obrisati korisnik'));
    }
  };

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
      
      const resTer = await api.get('/termini?datum=' + noviTermin.datum);
      setTermini(resTer);
    } catch (err) {
      alert('Greška: ' + (err.message || 'Nepoznata greška'));
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

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-header">
        <h1>🛡️ Admin Panel</h1>
        <p>Dobrodošao/la, {korisnik?.ime}!</p>
      </div>

      {/* Statistika */}
      <div className="dashboard-stats">
        <div className="stat-card" style={{'--color': '#7C3AED'}}>
          <span className="stat-icon">👥</span>
          <span className="stat-number">{korisnici.length}</span>
          <span className="stat-label">Korisnika</span>
        </div>
        <div className="stat-card" style={{'--color': '#10B981'}}>
          <span className="stat-icon">📅</span>
          <span className="stat-number">{rezervacije.length}</span>
          <span className="stat-label">Rezervacija</span>
        </div>
        <div className="stat-card" style={{'--color': '#F97316'}}>
          <span className="stat-icon">🕐</span>
          <span className="stat-number">{termini.length}</span>
          <span className="stat-label">Termina</span>
        </div>
      </div>

      {/* Tab navigacija */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'korisnici' ? 'active' : ''}`}
          onClick={() => setActiveTab('korisnici')}
        >
          👥 Korisnici
        </button>
        <button 
          className={`tab ${activeTab === 'rezervacije' ? 'active' : ''}`}
          onClick={() => setActiveTab('rezervacije')}
        >
          📋 Rezervacije
        </button>
        <button 
          className={`tab ${activeTab === 'termini' ? 'active' : ''}`}
          onClick={() => setActiveTab('termini')}
        >
          🕐 Termini
        </button>
      </div>

      {/* Tab sadržaj */}
      {activeTab === 'korisnici' && (
        <div className="dashboard-section">
          <h2>👥 Svi korisnici</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ime</th>
                  <th>Prezime</th>
                  <th>Email</th>
                  <th>Uloga</th>
                  <th>Razred</th>
                  <th>Email potvrđen</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {korisnici.map(k => (
                  <tr key={k.id}>
                    <td>{k.id}</td>
                    <td>{k.ime}</td>
                    <td>{k.prezime}</td>
                    <td>{k.email}</td>
                    <td>
                      <span className={`role-badge role-${k.uloga.toLowerCase()}`}>
                        {k.uloga}
                      </span>
                    </td>
                    <td>{k.razred || '-'}</td>
                    <td>{k.emailPotvrđen ? '✅' : '❌'}</td>
                    <td>
                      {k.uloga === 'Ucenik' && (
                        <button 
                          className="btn-delete" 
                          onClick={() => obrisiKorisnika(k.id, k.uloga)}
                        >
                          🗑️ Obriši
                        </button>
                      )}
                      {k.uloga !== 'Ucenik' && (
                        <span style={{color: '#9CA3AF', fontSize: '13px'}}>Zaštićeno</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rezervacije' && (
        <div className="dashboard-section">
          <h2>📋 Sve rezervacije</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                  <tr><td colSpan="7" style={{textAlign: 'center'}}>Nema rezervacija</td></tr>
                ) : (
                  rezervacije.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.korisnikIme} {r.korisnikPrezime}</td>
                      <td>{r.korisnikRazred ? `${r.korisnikRazred}. razred` : '-'}</td>
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
      )}

      {activeTab === 'termini' && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>🕐 Svi termini</h2>
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

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Datum i vreme</th>
                  <th>Tip časa</th>
                  <th>Mesta (zauzeto/ukupno)</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {termini.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>Nema termina</td></tr>
                ) : (
                  termini.map(t => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
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
      )}
    </div>
  );
}