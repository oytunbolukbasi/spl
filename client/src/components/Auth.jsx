import { useState } from 'react';
import Squirrel from './Squirrel.jsx';
import { register, login, setSession } from '../lib/api.js';

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const fn = mode === 'register' ? register : login;
      const res = await fn(username, password);
      setSession(res.token, res.username);
      onAuthed(res.username, res.progress, res.avatarUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <Squirrel size={110} mood="neutral" />
        </div>
        <h1 className="auth-title">Fındık'a Hoş Geldin</h1>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Giriş yap, ilerlemen tüm cihazlarında seninle.'
            : 'Hesap oluştur, sınav hazırlığına başla.'}
        </p>

        <form onSubmit={submit}>
          <label className="field-label">Kullanıcı adı</label>
          <input
            className="field"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="ör. fındık123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <label className="field-label">Şifre</label>
          <input
            className="field"
            type="password"
            placeholder="en az 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="auth-error">{error}</div>}

          <button className="btn" type="submit" disabled={busy} style={{ marginTop: 14 }}>
            {busy ? 'Lütfen bekle…' : mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <>
              Hesabın yok mu?{' '}
              <button onClick={() => { setMode('register'); setError(null); }}>Kayıt ol</button>
            </>
          ) : (
            <>
              Zaten hesabın var mı?{' '}
              <button onClick={() => { setMode('login'); setError(null); }}>Giriş yap</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
