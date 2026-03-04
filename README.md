# 🧮 MatemaTI&JA — Frontend

Veb aplikacija za online zakazivanje časova matematike.

## 🚀 Pokretanje projekta

### Zahtevi
- **Node.js** v16 ili noviji
- **npm** v8 ili noviji

### Instalacija i pokretanje

```bash
# Instaliraj zavisnosti
npm install

# Pokreni development server
npm start

# Aplikacija se otvara na http://localhost:3000
```

## 📁 Struktura projekta

```
src/
├── components/
│   ├── Navbar.js / Navbar.css       # Navigacija sa aktivnim rutama
│   ├── Footer.js / Footer.css       # Footer
│   └── MathBackground.js            # Animirani matematički simboli
├── pages/
│   ├── Pocetna.js / Pocetna.css     # Početna stranica (hero, features)
│   ├── Casovi.js / Casovi.css       # Pregled i filtriranje časova
│   ├── Zakazivanje.js / ...css      # Interaktivni kalendar za zakazivanje
│   ├── MojiCasovi.js / ...css       # Pregled zakazanih časova
│   ├── Vezbanje.js / Vezbanje.css   # Interaktivni matematički kviz
│   ├── Prijava.js                   # Forma za prijavu
│   ├── Registracija.js              # Forma za registraciju
│   └── Auth.css                     # Zajednički CSS za auth stranice
├── styles/
│   └── global.css                   # Globalni stilovi i animacije
├── App.js                           # Routing
└── index.js                         # Entry point
```

## 🎨 Dizajn

- **Primarna boja**: Ljubičasta (#7C3AED)
- **Akcentna boja**: Roze (#EC4899)
- **Naglasna boja**: Žuta (#FBBF24)
- **Font headera**: Fredoka One (veseo, zaobljen)
- **Font teksta**: Nunito (čitljiv, prijatan)

## 📱 Stranice

| Ruta | Stranica |
|------|----------|
| `/` | Početna |
| `/casovi` | Pregled časova |
| `/zakazivanje` | Zakaži čas |
| `/moji-casovi` | Moji časovi |
| `/vezbanje` | Matematički kviz |
| `/prijava` | Prijava |
| `/registracija` | Registracija |

## 🔧 Tehnologije

- **React 18** + React Router v6
- **Čisti CSS** (bez CSS framework-a)
- **Google Fonts**: Fredoka One, Nunito

## ℹ️ Napomene

- Plaćanje je **isključivo uživo** (pre ili posle časa)
- Otkazivanje je moguće **najmanje 48h** pre termina
- Časovi se pohađaju **uživo u Novom Pazaru**
- Sajt je na **srpskom jeziku**

---

*Projekat: Softversko inženjerstvo I — Državni univerzitet u Novom Pazaru*  
*Student: Nejla Tobdžiu | Mentor: Prof. dr Edin Dolićanin*
