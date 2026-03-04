import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { korisnik, odjava } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          {/* <span className="logo-math">∑</span> */}
          <span className="logo-text">Matema<span className="logo-accent">TI</span>&amp;JA</span>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meni"
        >
          <span /><span /><span />
        </button>

        {/* Nav links - DINAMIČKI */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {/* Početna - za sve */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              🏠 Početna
            </NavLink>
          </li>

          {/* Linkovi samo za Učenike */}
          {korisnik?.uloga === 'Ucenik' && (
            <>
              <li>
                <NavLink
                  to="/casovi"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  📚 Časovi
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/zakazivanje"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  📅 Zakaži čas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/moji-casovi"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  ⭐ Moji časovi
                </NavLink>
              </li>
            </>
          )}

          {/* Link za Profesora */}
          {korisnik?.uloga === 'Profesor' && (
            <li>
              <NavLink
                to="/profesor-dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                👩‍🏫 Dashboard
              </NavLink>
            </li>
          )}

          {/* Link za Admina */}
          {korisnik?.uloga === 'Admin' && (
            <li>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                🛡️ Admin Panel
              </NavLink>
            </li>
          )}

          {/* Vežbanje - za sve */}
          <li>
            <NavLink
              to="/vezbanje"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              🧮 Vežbanje
            </NavLink>
          </li>

          {/* Linkovi za neprijavljene korisnike */}
          {!korisnik && (
            <>
              <li>
                <NavLink
                  to="/casovi"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  📚 Časovi
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/zakazivanje"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  📅 Zakaži čas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/moji-casovi"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  ⭐ Moji časovi
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Auth buttons - dinamicki */}
        <div className="navbar-auth">
          {korisnik ? (
            <>
              <span className="user-greeting">
                Zdravo, <strong>{korisnik.ime}</strong>! 👋
              </span>
              <button 
                className="btn-login btn-logout" 
                onClick={() => { 
                  odjava(); 
                  navigate('/'); 
                  setMenuOpen(false); 
                }}
              >
                Odjavi se
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => { navigate('/prijava'); setMenuOpen(false); }}>
                Prijavi se
              </button>
              <button className="btn-register" onClick={() => { navigate('/registracija'); setMenuOpen(false); }}>
                Registruj se
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}