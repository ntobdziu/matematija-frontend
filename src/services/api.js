const API = 'http://localhost:5000/api';

const headers = () => ({
  'Content-Type': 'application/json',
  ...(sessionStorage.getItem('token') && { // PROMIJENJENO
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` // PROMIJENJENO
  })
});

export const api = {
  get:    (url) => fetch(`${API}${url}`, { headers: headers() }).then(r => r.json()),
  post:   (url, body) => fetch(`${API}${url}`, { method: 'POST',   headers: headers(), body: JSON.stringify(body) }).then(r => r.json()),
  delete: (url) =>       fetch(`${API}${url}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),
  put:    (url, body) => fetch(`${API}${url}`, { method: 'PUT',    headers: headers(), body: JSON.stringify(body) }).then(r => r.json()),
};