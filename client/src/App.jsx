import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import Session from './components/Session.jsx';
import MistakesReview from './components/MistakesReview.jsx';
import { load, ensureToday, save } from './lib/storage.js';
import { buildDailySession, buildUnitSession, buildMistakeSession } from './lib/session.js';

export default function App() {
  const [units, setUnits] = useState([]);
  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(() => ensureToday(load()));

  // nav: 'home' | 'mistakes'  ;  session ayrı tam ekran
  const [nav, setNav] = useState('home');
  const [session, setSession] = useState(null); // {questions, title}

  useEffect(() => {
    Promise.all([
      fetch('/api/units').then((r) => r.json()),
      fetch('/api/questions').then((r) => r.json()),
    ])
      .then(([u, q]) => {
        setUnits(u.units || []);
        setPool(q.questions || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  function persist(next) {
    setProgress({ ...next });
    save(next);
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

  if (loading) {
    return (
      <div className="shell">
        <main className="main">
          <div className="spinner" />
          <p style={{ textAlign: 'center', color: '#777' }}>Yükleniyor…</p>
        </main>
      </div>
    );
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
