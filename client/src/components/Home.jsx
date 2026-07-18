import { useState } from 'react';
import { CircleCheck, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import Squirrel from './Squirrel.jsx';
import { unitIcon } from '../lib/icons.js';
import { DAILY_GOAL } from '../lib/session.js';

const NOTES = [
  { code: '1001', title: 'Dar Kapsamlı Mevzuat', pdf: '/pdfs/1001-notes.pdf', color: '#58a700' },
  { code: '1003', title: 'Sermaye Piyasası Araçları', pdf: '/pdfs/1003-notes.pdf', color: '#1cb0f6' },
  { code: '1005', title: 'Yatırım Kuruluşları', pdf: '/pdfs/1005-notes.pdf', color: '#ce82ff' },
  { code: '1012', title: 'Takas ve Operasyon', pdf: '/pdfs/1012-notes.pdf', color: '#ff9600' },
];

export default function Home({
  units,
  verifiedByUnit,
  poolSize,
  progress,
  error,
  onStartDaily,
  onStartUnit,
}) {
  const [showNotes, setShowNotes] = useState(false);
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

      <button className="mobile-notes-link" onClick={() => setShowNotes(true)}>
        <FileText size={18} /> Ders Notları
      </button>

      {showNotes && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowNotes(false)}>
          <div className="modal">
            <h3><FileText size={20} /> Ders Notları</h3>
            <div className="notes-list">
              {NOTES.map((n) => (
                <a key={n.code} className="note-item" href={n.pdf} target="_blank" rel="noopener noreferrer">
                  <span className="note-badge" style={{ background: n.color }}>{n.code}</span>
                  <span className="note-title">{n.title}</span>
                  <ExternalLink size={16} className="note-ext" />
                </a>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setShowNotes(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
