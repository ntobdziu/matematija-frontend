import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-shapes">
        <span className="fs fs1">+</span>
        <span className="fs fs2">×</span>
        <span className="fs fs3">÷</span>
        <span className="fs fs4">=</span>
        <span className="fs fs5">π</span>
      </div>
      <div className="footer-inner">
        <div className="footer-logo">
          {/* <span className="footer-logo-sym">∑</span> */}
          <span className="footer-logo-name">Matema<span>TI</span>&amp;JA</span>
        </div>
        <p className="footer-tagline">Matematika može biti zabavna! 🎉</p>
        <div className="footer-links">
          <a href="/">Početna</a>
          <a href="/casovi">Časovi</a>
          <a href="/vezbanje">Vežbanje</a>
          <a href="/registracija">Registracija</a>
        </div>
        <div className="footer-info">
          <p>📍 Novi Pazar &nbsp;|&nbsp; 📧 matematija@mail.com</p>
          <p>⏰ Plaćanje: uživo, pre ili posle časa</p>
          <p>❌ Otkazivanje: najmanje 48h ranije</p>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MatemaTI&amp;JA · Državni univerzitet u Novom Pazaru</p>
          <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
            Student: Nejla Tobdžiu | Mentor: Prof. dr Edin Dolićanin
          </p>
        </div>
      </div>
    </footer>
  );
}
