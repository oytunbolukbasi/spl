import { useState, useMemo } from 'react';
import { CircleCheck, ChevronDown } from 'lucide-react';
import Squirrel from './Squirrel.jsx';
import { unitIcon } from '../lib/icons.js';
import { DAILY_GOAL } from '../lib/session.js';

const STATIC_TIPS = [
  'Yanlış yaptığın sorular "Hatalarım"da birikir, tekrar çöz!',
  'Her doğru cevap +10 XP. Serini bozma!',
  'Bir sorunun kaynağını "Kaynağı Gör" ile ders notunda açabilirsin.',
];

const BANNER_THEMES = [
  { bg: 'linear-gradient(160deg, #EAF4EA 0%, #D8ECD8 100%)', ink: '#2E7A2E', tipBg: 'rgba(63,143,63,0.08)' },
  { bg: 'linear-gradient(160deg, #E6EEF8 0%, #D4E4F2 100%)', ink: '#3A6BA8', tipBg: 'rgba(74,144,217,0.08)' },
  { bg: 'linear-gradient(160deg, #F0E8F5 0%, #E4D8ED 100%)', ink: '#7B52A3', tipBg: 'rgba(155,109,198,0.08)' },
  { bg: 'linear-gradient(160deg, #F5EFE4 0%, #EDE5D2 100%)', ink: '#A07830', tipBg: 'rgba(232,131,42,0.08)' },
];

function pickRandomTip(pool) {
  if (pool.length === 0) return STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)];
  const q = pool[Math.floor(Math.random() * pool.length)];
  if (q.explanation) return q.explanation;
  return STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)];
}

function UnitProgress({ solved, total, color }) {
  const pct = total ? Math.round((solved / total) * 100) : 0;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="unit-progress">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--track)" strokeWidth="3" />
        {pct > 0 && (
          <circle
            cx="22" cy="22" r={r}
            fill="none" stroke={color || 'var(--green)'} strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 22 22)"
          />
        )}
      </svg>
      <span className="unit-progress-label">{pct}%</span>
    </div>
  );
}

export default function Home({
  units,
  verifiedByUnit,
  poolSize,
  progress,
  error,
  onStartDaily,
  onStartUnit,
  questionPool,
}) {
  const answered = progress.daily.answered || 0;
  const pct = Math.min(100, Math.round((answered / DAILY_GOAL) * 100));
  const goalDone = answered >= DAILY_GOAL;
  const [tipExpanded, setTipExpanded] = useState(false);

  const tip = useMemo(() => pickRandomTip(questionPool || []), []);
  const theme = useMemo(() => BANNER_THEMES[Math.floor(Math.random() * BANNER_THEMES.length)], []);

  const solvedByUnit = useMemo(() => {
    const map = {};
    for (const qid of Object.keys(progress.seen)) {
      const unit = qid.split('-')[0];
      map[unit] = (map[unit] || 0) + 1;
    }
    return map;
  }, [progress.seen]);

  return (
    <>
      <div className="hero-banner" style={{ background: theme.bg }}>
        <div className="hero-banner-content">
          <h1 style={{ color: theme.ink }}>SPL Düzey 1 Hazırlık</h1>
          <p>Her gün 25 soru çöz, sınava eğlenerek hazırlan!</p>
        </div>
        <div className="hero-banner-mascot">
          <Squirrel size={72} mood="neutral" />
        </div>
        <div
          className={'hero-tip' + (tipExpanded ? ' expanded' : '')}
          style={{ background: theme.tipBg }}
          onClick={() => setTipExpanded(v => !v)}
        >
          <span className="hero-tip-text">{tip}</span>
          <ChevronDown size={18} className={'hero-tip-chev' + (tipExpanded ? ' open' : '')} />
        </div>
      </div>

      {error && (
        <div className="flag-note" style={{ marginBottom: 12 }}>
          İçerik yüklenirken sorun oluştu: {error}
        </div>
      )}

      <div className="daily-card">
        <h2>
          Günlük Hedef
          {goalDone && <CircleCheck size={20} style={{ verticalAlign: '-4px', marginLeft: 6 }} />}
        </h2>
        <div style={{ fontSize: 14, opacity: 0.95 }}>
          {answered} / {DAILY_GOAL} soru
        </div>
        <div className="prog-outer">
          <div className="prog-inner" style={{ width: pct + '%' }} />
        </div>
        <button className="btn white" onClick={onStartDaily} disabled={poolSize === 0}>
          {goalDone ? 'Devam Et' : 'Günlük 25 Soruyu Başlat'}
        </button>
      </div>

      {poolSize === 0 && (
        <div className="empty">
          Henüz doğrulanmış soru yok. İçerik doğrulaması ilerledikçe sorular burada görünecek.
        </div>
      )}

      <div className="section-title">Üniteler</div>
      <div className="unit-grid">
        {units.map((u) => {
          const count = verifiedByUnit[u.code] || 0;
          const active = count > 0;
          const UIcon = unitIcon(u.code);
          return (
            <button
              key={u.code}
              className="unit"
              disabled={!active}
              onClick={() => active && onStartUnit(u.code)}
            >
              <div className="badge" style={{ background: u.color }}>
                <UIcon size={26} strokeWidth={2.25} />
              </div>
              <div className="u-meta">
                <div className="u-code">{u.code}</div>
                <div className="u-title">{u.shortTitle || u.title}</div>
                <div className="u-sub">
                  {active ? `${count} soru` : <span className="tag soon">Yakında</span>}
                  {!u.hasBank && active ? ' • notlardan' : ''}
                </div>
              </div>
              {active && <UnitProgress solved={solvedByUnit[u.code] || 0} total={count} color={u.color} />}
            </button>
          );
        })}
      </div>

    </>
  );
}
