import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [korisnik, setKorisnik] = useState(() => {
    const s = sessionStorage.getItem('korisnik'); // PROMIJENJENO
    return s ? JSON.parse(s) : null;
  });

  const prijava = (token, korisnikData) => {
    sessionStorage.setItem('token', token); // PROMIJENJENO
    sessionStorage.setItem('korisnik', JSON.stringify(korisnikData)); // PROMIJENJENO
    setKorisnik(korisnikData);
  };

  const odjava = () => {
    sessionStorage.removeItem('token'); // PROMIJENJENO
    sessionStorage.removeItem('korisnik'); // PROMIJENJENO
    setKorisnik(null);
  };

  return (
    <AuthContext.Provider value={{ korisnik, prijava, odjava }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);