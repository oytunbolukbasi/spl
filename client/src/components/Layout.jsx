import Squirrel from './Squirrel.jsx';

const TIPS = [
  'İpucu: Yanlış yaptığın sorular “Hatalarım”da birikir, tekrar çöz!',
  'Her doğru cevap +10 XP. Serini bozma! 🔥',
  'Bir sorunun kaynağını “Kaynağı Gör” ile ders notunda açabilirsin.',
  'Fındık’a tıkla, bak ne yapıyor 🐿️',
];

export default function Layout({ active, onNav, progress, mistakeCount, children }) {
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
          <span className="stat streak">🔥 {progress.streak}</span>
          <span className="stat xp">⭐ {progress.xp}</span>
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
          <span className="ni-ico">🏠</span> Ana Sayfa
        </button>
        <button
          className={'nav-item' + (active === 'mistakes' ? ' active' : '')}
          onClick={() => onNav('mistakes')}
        >
          <span className="ni-ico">🩹</span> Hatalarım
          {mistakeCount > 0 && <span className="nav-badge">{mistakeCount}</span>}
        </button>

        <div className="sidebar-foot">
          <div className="side-caption">SPL Düzey 1 Hazırlık</div>
          <div className="mini-stats">
            <span className="stat streak">🔥 {progress.streak}</span>
            <span className="stat xp">⭐ {progress.xp}</span>
          </div>
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
              <div className="big" style={{ color: 'var(--orange)' }}>🔥 {progress.streak}</div>
              <div className="lbl">Gün Serisi</div>
            </div>
            <div className="rr-stat">
              <div className="big" style={{ color: 'var(--gold)' }}>⭐ {progress.xp}</div>
              <div className="lbl">XP</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
