import { useState, useMemo } from 'react';
import { Home, Bandage, Flame, Star, RotateCcw, LogOut, BookOpen, X, FileText, ExternalLink, CircleCheck, CircleX, Menu, ListChecks, Library } from 'lucide-react';
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

function UserAvatar({ username, size = 34, onClick, as: Tag = 'button', avatarUrl }) {
  const letter = (username || '?')[0].toUpperCase();
  return (
    <Tag className="user-avatar" onClick={onClick} aria-label="Profil" style={{ width: size, height: size, fontSize: size * 0.44 }}>
      {avatarUrl
        ? <img src={avatarUrl} alt={username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        : letter}
    </Tag>
  );
}

function StatWithTooltip({ icon, value, label, color, size = 18 }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className={'stat ' + (color || '')}
      style={color && !['streak','xp','correct','wrong'].includes(color) ? { color } : undefined}
      onClick={() => { setShow(true); setTimeout(() => setShow(false), 1800); }}
    >
      {icon} {value}
      {show && <span className="stat-tooltip">{label}</span>}
    </span>
  );
}

function ProfileModal({ username, progress, onReset, onLogout, onClose, avatarUrl, totalQuestions }) {
  const correct = Object.values(progress.seen).filter(v => v === 'correct').length;
  const wrong = Object.values(progress.seen).filter(v => v === 'wrong').length;
  const solved = Object.keys(progress.seen).length;
  const pct = totalQuestions ? Math.round((solved / totalQuestions) * 100) : 0;
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal profile-modal">
        <div className="profile-header">
          <UserAvatar username={username} size={56} as="span" avatarUrl={avatarUrl} />
          <div className="profile-name">@{username}</div>
        </div>
        <div className="profile-stats">
          <StatWithTooltip icon={<Flame size={18} />} value={progress.streak} label="Günlük seri" color="streak" />
          <StatWithTooltip icon={<Star size={18} />} value={progress.xp} label="Toplam puan" color="xp" />
          <StatWithTooltip icon={<CircleCheck size={18} />} value={correct} label="Doğru cevap" color="correct" />
          <StatWithTooltip icon={<CircleX size={18} />} value={wrong} label="Yanlış cevap" color="wrong" />
          <StatWithTooltip icon={<ListChecks size={18} />} value={`${solved}`} label={`Çözülen (${pct}%)`} color="var(--blue)" />
          <StatWithTooltip icon={<Library size={18} />} value={totalQuestions || 0} label="Toplam soru" color="#8e8e93" />
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
  { code: '1001', title: 'Dar Kapsamlı Mevzuat', pdf: '/pdfs/1001-notes.pdf', color: '#3F8F3F' },
  { code: '1003', title: 'Sermaye Piyasası Araçları', pdf: '/pdfs/1003-notes.pdf', color: '#4A90D9' },
  { code: '1005', title: 'Yatırım Kuruluşları', pdf: '/pdfs/1005-notes.pdf', color: '#9B6DC6' },
  { code: '1012', title: 'Takas ve Operasyon', pdf: '/pdfs/1012-notes.pdf', color: '#E8832A' },
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

export default function Layout({ active, onNav, progress, mistakeCount, username, onReset, onLogout, questionPool, avatarUrl, children }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const tip = useMemo(() => pickRandomTip(questionPool || []), []);
  return (
    <div className="shell">
      {/* Mobil üst bar */}
      <header className="mobile-topbar">
        <div className="brand-row">
          <button className="hamburger-btn" onClick={() => setMenuOpen(true)} aria-label="Menü">
            <Menu size={22} />
          </button>
          <div className="brand" onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>fındık</div>
        </div>
        <div className="stats">
          <span className="stat streak"><Flame size={16} /> {progress.streak}</span>
          <span className="stat xp"><Star size={16} /> {progress.xp}</span>
          <UserAvatar username={username} size={30} onClick={() => setShowProfile(true)} avatarUrl={avatarUrl} />
        </div>
      </header>

      {/* Hamburger menü (mobil) */}
      {menuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="brand">fındık</div>
              <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Kapat">
                <X size={22} />
              </button>
            </div>
            <button
              className={'nav-item' + (active === 'home' ? ' active' : '')}
              onClick={() => { onNav('home'); setMenuOpen(false); }}
            >
              <Home size={20} className="ni-ico" /> Ana Sayfa
            </button>
            <button
              className={'nav-item' + (active === 'mistakes' ? ' active' : '')}
              onClick={() => { onNav('mistakes'); setMenuOpen(false); }}
            >
              <Bandage size={20} className="ni-ico" /> Hatalarım
              {mistakeCount > 0 && <span className="nav-badge">{mistakeCount}</span>}
            </button>
            <button
              className="nav-item"
              onClick={() => { setShowNotes(true); setMenuOpen(false); }}
            >
              <FileText size={20} className="ni-ico" /> Ders Notları
            </button>
          </nav>
        </div>
      )}

      {/* Sol menü (tablet+) */}
      <aside className="sidebar">
        <div className="brand">fındık</div>
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
            <UserAvatar username={username} size={32} as="span" avatarUrl={avatarUrl} />
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
        <div className="rr-stat-row">
          <div className="rr-card rr-stat">
            <div className="big" style={{ color: 'var(--orange)' }}>
              <Flame size={26} /> {progress.streak}
            </div>
            <div className="lbl">Günlük seri</div>
          </div>
          <div className="rr-card rr-stat">
            <div className="big" style={{ color: 'var(--gold)' }}>
              <Star size={26} /> {progress.xp}
            </div>
            <div className="lbl">Toplam Puan</div>
          </div>
        </div>
        <div className="rr-stat-row">
          <div className="rr-card rr-stat">
            <div className="big" style={{ color: 'var(--green)' }}>
              <CircleCheck size={26} /> {Object.values(progress.seen).filter(v => v === 'correct').length}
            </div>
            <div className="lbl">Doğru</div>
          </div>
          <div className="rr-card rr-stat">
            <div className="big" style={{ color: 'var(--red)' }}>
              <CircleX size={26} /> {Object.values(progress.seen).filter(v => v === 'wrong').length}
            </div>
            <div className="lbl">Yanlış</div>
          </div>
        </div>
        <div className="rr-stat-row">
          <div className="rr-card rr-stat">
            <div className="big" style={{ color: 'var(--blue)' }}>
              <ListChecks size={26} /> {Object.keys(progress.seen).length}
            </div>
            <div className="lbl">Çözülen {questionPool?.length ? `(${Math.round((Object.keys(progress.seen).length / questionPool.length) * 100)}%)` : ''}</div>
          </div>
          <div className="rr-card rr-stat">
            <div className="big" style={{ color: '#8e8e93' }}>
              <Library size={26} /> {questionPool?.length || 0}
            </div>
            <div className="lbl">Toplam Soru</div>
          </div>
        </div>
      </aside>

      {showProfile && (
        <ProfileModal
          username={username}
          progress={progress}
          onReset={onReset}
          onLogout={onLogout}
          onClose={() => setShowProfile(false)}
          avatarUrl={avatarUrl}
          totalQuestions={questionPool?.length || 0}
        />
      )}
      {showNotes && <NotesModal onClose={() => setShowNotes(false)} />}
    </div>
  );
}
