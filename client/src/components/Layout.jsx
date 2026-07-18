import { useState, useMemo } from 'react';
import { Home, Bandage, Flame, Star, RotateCcw, LogOut, BookOpen, X, FileText, ExternalLink } from 'lucide-react';
import Squirrel from './Squirrel.jsx';

const STATIC_TIPS = [
  'Yanlış yaptığın sorular "Hatalarım"da birikir, tekrar çöz!',
  'Her doğru cevap +10 XP. Serini bozma!',
  'Bir sorunun kaynağını "Kaynağı Gör" ile ders notunda açabilirsin.',
];

function pickRandomTip(pool) {
  if (pool.length === 0) return STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)];
  const q = pool[Math.floor(Math.random() * pool.length)];
  if (q.explanation) return q.explanation;
  return STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)];
}

function UserAvatar({ username, size = 34, onClick, as: Tag = 'button' }) {
  const letter = (username || '?')[0].toUpperCase();
  return (
    <Tag className="user-avatar" onClick={onClick} aria-label="Profil" style={{ width: size, height: size, fontSize: size * 0.44 }}>
      {letter}
    </Tag>
  );
}

function ProfileModal({ username, onReset, onLogout, onClose }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal profile-modal">
        <div className="profile-header">
          <UserAvatar username={username} size={56} as="span" />
          <div className="profile-name">@{username}</div>
        </div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={() => { onReset(); onClose(); }}>
            <RotateCcw size={18} /> İlerlemeyi Sıfırla
          </button>
          <button className="btn ghost" onClick={() => { onLogout(); onClose(); }}>
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}

const NOTES = [
  { code: '1001', title: 'Dar Kapsamlı Mevzuat', pdf: '/pdfs/1001-notes.pdf', color: '#58a700' },
  { code: '1003', title: 'Sermaye Piyasası Araçları', pdf: '/pdfs/1003-notes.pdf', color: '#1cb0f6' },
  { code: '1005', title: 'Yatırım Kuruluşları', pdf: '/pdfs/1005-notes.pdf', color: '#ce82ff' },
  { code: '1012', title: 'Takas ve Operasyon', pdf: '/pdfs/1012-notes.pdf', color: '#ff9600' },
];

function NotesModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3><BookOpen size={20} /> Ders Notları</h3>
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
          <button className="btn ghost" onClick={onClose}>Kapat</button>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ active, onNav, progress, mistakeCount, username, onReset, onLogout, questionPool, children }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const tip = useMemo(() => pickRandomTip(questionPool || []), []);

  return (
    <div className="shell">
      {/* Mobil üst bar */}
      <header className="mobile-topbar">
        <div className="brand">
          <Squirrel size={30} mood="happy" interactive={false} />
          Fındık
        </div>
        <div className="stats">
          <span className="stat streak"><Flame size={16} /> {progress.streak}</span>
          <span className="stat xp"><Star size={16} /> {progress.xp}</span>
          <UserAvatar username={username} size={30} onClick={() => setShowProfile(true)} />
        </div>
      </header>

      {/* Sol menü (tablet+) */}
      <aside className="sidebar">
        <div className="brand">
          <Squirrel size={34} mood="happy" interactive={false} />
          Fındık
        </div>
        <button
          className={'nav-item' + (active === 'home' ? ' active' : '')}
          onClick={() => onNav('home')}
        >
          <Home size={20} className="ni-ico" /> Ana Sayfa
        </button>
        <button
          className={'nav-item' + (active === 'mistakes' ? ' active' : '')}
          onClick={() => onNav('mistakes')}
        >
          <Bandage size={20} className="ni-ico" /> Hatalarım
          {mistakeCount > 0 && <span className="nav-badge">{mistakeCount}</span>}
        </button>
        <button
          className="nav-item"
          onClick={() => setShowNotes(true)}
        >
          <FileText size={20} className="ni-ico" /> Ders Notları
        </button>

        <div className="sidebar-foot">
          <div className="mini-stats">
            <span className="stat streak"><Flame size={16} /> {progress.streak}</span>
            <span className="stat xp"><Star size={16} /> {progress.xp}</span>
          </div>
          <button className="sidebar-profile" onClick={() => setShowProfile(true)}>
            <UserAvatar username={username} size={32} as="span" />
            <span>@{username}</span>
          </button>
        </div>
      </aside>

      {/* Ana içerik */}
      <main className="main">{children}</main>

      {/* Sağ panel (masaüstü) */}
      <aside className="rightrail">
        <div className="rr-card rr-mascot">
          <Squirrel size={150} mood="neutral" />
          <div className="speech">{tip}</div>
        </div>
        <div className="rr-card">
          <div className="rr-stat-row">
            <div className="rr-stat">
              <div className="big" style={{ color: 'var(--orange)' }}>
                <Flame size={20} /> {progress.streak}
              </div>
              <div className="lbl">Gün Serisi</div>
            </div>
            <div className="rr-stat">
              <div className="big" style={{ color: 'var(--gold)' }}>
                <Star size={20} /> {progress.xp}
              </div>
              <div className="lbl">XP</div>
            </div>
          </div>
        </div>
      </aside>

      {showProfile && (
        <ProfileModal
          username={username}
          onReset={onReset}
          onLogout={onLogout}
          onClose={() => setShowProfile(false)}
        />
      )}
      {showNotes && <NotesModal onClose={() => setShowNotes(false)} />}
    </div>
  );
}
