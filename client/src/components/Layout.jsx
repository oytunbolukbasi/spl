import { Home, Bandage, Flame, Star, RotateCcw, LogOut, User } from 'lucide-react';
import Squirrel from './Squirrel.jsx';

const TIPS = [
  'İpucu: Yanlış yaptığın sorular “Hatalarım”da birikir, tekrar çöz!',
  'Her doğru cevap +10 XP. Serini bozma!',
  'Bir sorunun kaynağını “Kaynağı Gör” ile ders notunda açabilirsin.',
  'Fındık’a tıkla, bak ne yapıyor.',
];

export default function Layout({ active, onNav, progress, mistakeCount, username, onReset, onLogout, children }) {
  const tip = TIPS[(progress.xp / 10) % TIPS.length | 0];
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
          <button className="reset-icon" onClick={onReset} aria-label="İlerlemeyi sıfırla" title="İlerlemeyi sıfırla">
            <RotateCcw size={18} />
          </button>
          <button className="reset-icon" onClick={onLogout} aria-label="Çıkış yap" title="Çıkış yap">
            <LogOut size={18} />
          </button>
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

        <div className="sidebar-foot">
          <div className="mini-stats">
            <span className="stat streak"><Flame size={16} /> {progress.streak}</span>
            <span className="stat xp"><Star size={16} /> {progress.xp}</span>
          </div>
          {username && (
            <div className="side-user">
              <User size={15} /> @{username}
            </div>
          )}
          <button className="reset-btn" onClick={onReset}>
            <RotateCcw size={15} /> İlerlemeyi Sıfırla
          </button>
          <button className="reset-btn" onClick={onLogout}>
            <LogOut size={15} /> Çıkış Yap
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
    </div>
  );
}
