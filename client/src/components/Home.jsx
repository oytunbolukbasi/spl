import Squirrel from './Squirrel.jsx';
import { DAILY_GOAL } from '../lib/session.js';

export default function Home({
  units,
  verifiedByUnit,
  poolSize,
  progress,
  error,
  onStartDaily,
  onStartUnit,
  onOpenMistakes,
}) {
  const answered = progress.daily.answered || 0;
  const pct = Math.min(100, Math.round((answered / DAILY_GOAL) * 100));
  const goalDone = answered >= DAILY_GOAL;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Squirrel size={30} mood="happy" />
          Fındık
        </div>
        <div className="stats">
          <span className="stat streak">🔥 {progress.streak}</span>
          <span className="stat xp">⭐ {progress.xp}</span>
        </div>
      </header>

      <div className="content">
        <div className="hero">
          <Squirrel size={110} mood="happy" />
          <h1>SPL Düzey 1 Hazırlık</h1>
          <p>Her gün 25 soru çöz, sınava eğlenerek hazırlan!</p>
        </div>

        {error && (
          <div className="flag-note" style={{ marginBottom: 12 }}>
            İçerik yüklenirken sorun oluştu: {error}
          </div>
        )}

        <div className="daily-card">
          <h2>Günlük Hedef {goalDone ? '✅' : ''}</h2>
          <div style={{ fontSize: 14, opacity: 0.95 }}>
            {answered} / {DAILY_GOAL} soru
          </div>
          <div className="prog-outer">
            <div className="prog-inner" style={{ width: pct + '%' }} />
          </div>
          <button
            className="btn white"
            onClick={onStartDaily}
            disabled={poolSize === 0}
          >
            {goalDone ? 'Devam Et' : 'Günlük 25 Soruyu Başlat'}
          </button>
        </div>

        {poolSize === 0 && (
          <div className="empty">
            Henüz doğrulanmış soru yok. İçerik doğrulaması ilerledikçe sorular burada
            görünecek.
          </div>
        )}

        {progress.mistakes.length > 0 && (
          <button className="btn ghost" onClick={onOpenMistakes} style={{ marginBottom: 8 }}>
            🩹 Hatalarım ({progress.mistakes.length})
          </button>
        )}

        <div className="section-title">Üniteler</div>
        {units.map((u) => {
          const count = verifiedByUnit[u.code] || 0;
          const active = count > 0;
          return (
            <button
              key={u.code}
              className="unit"
              disabled={!active}
              onClick={() => active && onStartUnit(u.code)}
            >
              <div className="badge" style={{ background: u.color }}>
                {u.icon}
              </div>
              <div className="u-meta">
                <div className="u-code">{u.code}</div>
                <div className="u-title">{u.title}</div>
                <div className="u-sub">
                  {active ? (
                    `${count} doğrulanmış soru`
                  ) : (
                    <span className="tag soon">Yakında</span>
                  )}
                  {!u.hasBank && active ? ' • notlardan üretildi' : ''}
                </div>
              </div>
              <span className="chev">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
