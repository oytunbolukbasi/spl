import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import Session from './components/Session.jsx';
import MistakesReview from './components/MistakesReview.jsx';
import { load, ensureToday, save } from './lib/storage.js';
import {
  buildDailySession,
  buildUnitSession,
  buildMistakeSession,
} from './lib/session.js';

export default function App() {
  const [units, setUnits] = useState([]);
  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(() => ensureToday(load()));

  // screen: {name:'home'} | {name:'session', questions, title} | {name:'mistakes'}
  const [screen, setScreen] = useState({ name: 'home' });

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
    if (!qs.length) return;
    setScreen({ name: 'session', questions: qs, title: 'Günlük 25' });
  }

  function startUnit(code) {
    const qs = buildUnitSession(pool, code);
    if (!qs.length) return;
    setScreen({ name: 'session', questions: qs, title: code });
  }

  function startMistakes() {
    const qs = buildMistakeSession(progress.mistakes);
    if (!qs.length) return;
    setScreen({ name: 'session', questions: qs, title: 'Hatalarım' });
  }

  const verifiedByUnit = pool.reduce((acc, q) => {
    acc[q.unit] = (acc[q.unit] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="app">
        <div className="spinner" />
        <p style={{ textAlign: 'center', color: '#777' }}>Yükleniyor…</p>
      </div>
    );
  }

  if (screen.name === 'session') {
    return (
      <Session
        questions={screen.questions}
        title={screen.title}
        units={units}
        progress={progress}
        onAnswer={persist}
        onExit={() => setScreen({ name: 'home' })}
      />
    );
  }

  if (screen.name === 'mistakes') {
    return (
      <MistakesReview
        progress={progress}
        units={units}
        onBack={() => setScreen({ name: 'home' })}
        onReview={startMistakes}
      />
    );
  }

  return (
    <Home
      units={units}
      verifiedByUnit={verifiedByUnit}
      poolSize={pool.length}
      progress={progress}
      error={error}
      onStartDaily={startDaily}
      onStartUnit={startUnit}
      onOpenMistakes={() => setScreen({ name: 'mistakes' })}
    />
  );
}
