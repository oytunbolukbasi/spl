import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import Session from './components/Session.jsx';
import MistakesReview from './components/MistakesReview.jsx';
import Auth from './components/Auth.jsx';
import Squirrel from './components/Squirrel.jsx';
import { normalize, ensureToday, emptyProgress } from './lib/storage.js';
import { buildDailySession, buildUnitSession, buildMistakeSession } from './lib/session.js';
import {
  getToken,
  getUsername,
  clearSession,
  fetchProgress,
  saveProgress,
} from './lib/api.js';

export default function App() {
  const [units, setUnits] = useState([]);
  const [pool, setPool] = useState([]);
  const [error, setError] = useState(null);

  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null); // username | null
  const [progress, setProgress] = useState(null);

  const [nav, setNav] = useState('home');
  const [session, setSession] = useState(null);

  // İçerik (herkese açık) her zaman yüklenir
  useEffect(() => {
    Promise.all([
      fetch('/api/units').then((r) => r.json()),
      fetch('/api/questions').then((r) => r.json()),
    ])
      .then(([u, q]) => {
        setUnits(u.units || []);
        setPool(q.questions || []);
      })
      .catch((e) => setError(e.message));
  }, []);

  // Oturum kontrolü: jeton varsa ilerlemeyi sunucudan çek
  useEffect(() => {
    (async () => {
      if (getToken() && getUsername()) {
        try {
          const { progress: p } = await fetchProgress();
          setUser(getUsername());
          setProgress(ensureToday(normalize(p)));
        } catch {
          clearSession();
        }
      }
      setAuthReady(true);
    })();
  }, []);

  function onAuthed(username, serverProgress) {
    setUser(username);
    setProgress(ensureToday(normalize(serverProgress)));
    setNav('home');
    setSession(null);
  }

  function persist(next) {
    const copy = { ...next };
    setProgress(copy);
    saveProgress(copy).catch(() => {}); // ağ hatasında sessiz; bellek güncel kalır
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    setProgress(null);
    setNav('home');
    setSession(null);
  }

  function handleReset() {
    if (!window.confirm('Tüm ilerlemen (XP, seri, hatalar, günlük sayaç) silinecek. Emin misin?')) return;
    const fresh = ensureToday(emptyProgress());
    setProgress(fresh);
    saveProgress(fresh).catch(() => {});
    setSession(null);
    setNav('home');
  }

  function startDaily() {
    const qs = buildDailySession(pool, progress.seen);
    if (qs.length) setSession({ questions: qs, title: 'Günlük 25' });
  }
  function startUnit(code) {
    const qs = buildUnitSession(pool, code);
    if (qs.length) setSession({ questions: qs, title: code });
  }
  function startMistakes() {
    const qs = buildMistakeSession(progress.mistakes);
    if (qs.length) setSession({ questions: qs, title: 'Hatalarım' });
  }

  const verifiedByUnit = pool.reduce((acc, q) => {
    acc[q.unit] = (acc[q.unit] || 0) + 1;
    return acc;
  }, {});

  if (!authReady) {
    return (
      <div className="splash">
        <Squirrel size={140} mood="neutral" />
        <div className="splash-text">Yükleniyor…</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthed={onAuthed} />;
  }

  if (session) {
    return (
      <Session
        questions={session.questions}
        title={session.title}
        units={units}
        progress={progress}
        onAnswer={persist}
        onExit={() => setSession(null)}
      />
    );
  }

  return (
    <Layout
      active={nav}
      onNav={setNav}
      progress={progress}
      mistakeCount={progress.mistakes.length}
      username={user}
      onReset={handleReset}
      onLogout={handleLogout}
      questionPool={pool}
    >
      {nav === 'home' ? (
        <Home
          units={units}
          verifiedByUnit={verifiedByUnit}
          poolSize={pool.length}
          progress={progress}
          error={error}
          onStartDaily={startDaily}
          onStartUnit={startUnit}
        />
      ) : (
        <MistakesReview progress={progress} units={units} onReview={startMistakes} />
      )}
    </Layout>
  );
}
