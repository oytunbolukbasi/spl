// Sunucu API'si + oturum jetonu yönetimi
const TOKEN_KEY = 'spl_token';
const USER_KEY = 'spl_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function getUsername() {
  return localStorage.getItem(USER_KEY);
}
export function setSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function req(url, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers.Authorization = 'Bearer ' + token;
  const r = await fetch(url, { ...opts, headers });
  let data = {};
  try {
    data = await r.json();
  } catch {
    /* boş */
  }
  if (!r.ok) {
    const err = new Error(data.error || 'İstek başarısız (' + r.status + ')');
    err.status = r.status;
    throw err;
  }
  return data;
}

export function register(username, password) {
  return req('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) });
}
export function login(username, password) {
  return req('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
}
export function fetchProgress() {
  return req('/api/progress');
}
export function saveProgress(progress) {
  return req('/api/progress', { method: 'PUT', body: JSON.stringify(progress) });
}
