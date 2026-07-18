import { CircleCheck, ChevronRight } from 'lucide-react';
import Squirrel from './Squirrel.jsx';
import { unitIcon } from '../lib/icons.js';
import { DAILY_GOAL } from '../lib/session.js';

export default function Home({
  units,
  verifiedByUnit,
  poolSize,
  progress,
  error,
  onStartDaily,
  onStartUnit,
}) {
  const answered = progress.daily.answered || 0;
  const pct = Math.min(100, Math.round((answered / DAILY_GOAL) * 100));
  const goalDone = answered >= DAILY_GOAL;

  return (
    <>
      <div className="hero">
        <span className="hero-mascot">
          <Squirrel size={120} mood="neutral" />
        </span>
        <h1>SPL Düzey 1 Hazırlık</h1>
        <p>Her gün 25 soru çöz, sınava eğlenerek hazırlan!</p>
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
              <ChevronRight className="chev" size={22} />
            </button>
          );
        })}
      </div>
    </>
  );
}
