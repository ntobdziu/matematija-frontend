import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MathBackground from './components/MathBackground';
import Pocetna from './pages/Pocetna';
import Casovi from './pages/Casovi';
import Zakazivanje from './pages/Zakazivanje';
import MojiCasovi from './pages/MojiCasovi';
import Vezbanje from './pages/Vezbanje';
import Prijava from './pages/Prijava';
import Registracija from './pages/Registracija';
import VerifikujEmail from './pages/VerifikujEmail';
import ProfesorDashboard from './pages/ProfesorDashboard';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>
      <MathBackground />
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/casovi" element={<Casovi />} />
          <Route path="/zakazivanje" element={<Zakazivanje />} />
          <Route path="/moji-casovi" element={<MojiCasovi />} />
          <Route path="/vezbanje" element={<Vezbanje />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/verifikuj-email" element={<VerifikujEmail />} />
          <Route path="/profesor-dashboard" element={<ProfesorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />  
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;