import { useEffect, useRef, useState } from 'react';

// Fındık — minimal, temiz sincap maskot.
// Sayfa açılışında intro animasyonu; tıklanınca sincaba özgü mini animasyonlar
// (fındık yeme, zıplama, kuyruk sallama, göz kırpma).
// mood: 'neutral' | 'happy' | 'sad'  — quiz sonucu vb. için ifade.
const CLICK_ANIMS = ['eat', 'hop', 'flick', 'blink', 'eat'];

export default function Squirrel({ mood = 'neutral', size = 120, interactive = true }) {
  const [intro, setIntro] = useState(true);
  const [anim, setAnim] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  function play() {
    if (!interactive) return;
    const pick = CLICK_ANIMS[Math.floor(Math.random() * CLICK_ANIMS.length)];
    setAnim(null);
    // reflow to allow re-trigger of the same animation
    requestAnimationFrame(() => {
      setAnim(pick);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAnim(null), 1100);
    });
  }

  const cls = [
    'squirrel',
    interactive ? 'is-interactive' : '',
    intro ? 'intro' : '',
    anim ? 'anim-' + anim : '',
    'mood-' + mood,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={cls}
      style={{ width: size, height: size }}
      onClick={play}
      role={interactive ? 'button' : 'img'}
      aria-label="Fındık maskot"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Kuyruk — imza kıvrım */}
        <g className="sq-tail">
          <path
            d="M74 82
               C96 78 96 44 82 34
               C74 28 62 30 58 40
               C66 38 74 42 76 50
               C79 60 72 72 60 74 Z"
            fill="#a5673a"
          />
          <path
            d="M72 76
               C88 71 88 46 78 39
               C82 47 80 58 70 63
               C74 66 74 72 72 76 Z"
            fill="#c98a54"
          />
        </g>

        {/* Gövde */}
        <g className="sq-body">
          <ellipse cx="46" cy="70" rx="26" ry="25" fill="#b87840" />
          <ellipse cx="46" cy="74" rx="16" ry="17" fill="#fbe4cc" />
          {/* patiler */}
          <ellipse className="sq-paw" cx="37" cy="90" rx="7" ry="5" fill="#a5673a" />
          <ellipse className="sq-paw" cx="55" cy="90" rx="7" ry="5" fill="#a5673a" />
        </g>

        {/* Fındık — yeme animasyonunda görünür */}
        <g className="sq-nut">
          <ellipse cx="46" cy="86" rx="6.5" ry="7.5" fill="#c98a54" />
          <path d="M39.5 84 Q46 78 52.5 84 Q46 88 39.5 84 Z" fill="#7a4a22" />
          <ellipse cx="46" cy="88" rx="3" ry="3.5" fill="#8a5a2b" opacity="0.35" />
        </g>

        {/* Baş */}
        <g className="sq-head">
          {/* kulaklar */}
          <g className="sq-ears">
            <path d="M30 32 Q26 16 38 20 Q40 30 36 36 Z" fill="#b87840" />
            <path d="M66 32 Q70 16 58 20 Q56 30 60 36 Z" fill="#b87840" />
            <path d="M32 30 Q30 22 36 23 Z" fill="#c98a54" />
            <path d="M64 30 Q66 22 60 23 Z" fill="#c98a54" />
          </g>
          <circle cx="48" cy="44" r="24" fill="#b87840" />
          {/* yüz açık ton */}
          <ellipse cx="48" cy="50" rx="16" ry="15" fill="#fbe4cc" />
          {/* yanaklar */}
          <circle cx="33" cy="52" r="4.5" fill="#f6b98f" opacity="0.6" />
          <circle cx="63" cy="52" r="4.5" fill="#f6b98f" opacity="0.6" />

          {/* gözler */}
          <g className="sq-eyes">
            {mood === 'happy' ? (
              <>
                <path d="M37 44 q4 -5 8 0" stroke="#3a2a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M51 44 q4 -5 8 0" stroke="#3a2a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="41" cy="45" r="3.6" fill="#3a2a1a" />
                <circle cx="55" cy="45" r="3.6" fill="#3a2a1a" />
                <circle cx="42.2" cy="43.8" r="1.1" fill="#fff" />
                <circle cx="56.2" cy="43.8" r="1.1" fill="#fff" />
              </>
            )}
          </g>

          {/* burun + ağız */}
          <ellipse cx="48" cy="53" rx="2.6" ry="2" fill="#5a3a1e" />
          {mood === 'sad' ? (
            <path d="M43 61 q5 -4 10 0" stroke="#5a3a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path className="sq-mouth" d="M43 58 q5 5 10 0" stroke="#5a3a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          {/* ön dişler */}
          {mood !== 'sad' && <rect x="46" y="57.5" width="4" height="3.5" rx="1" fill="#fff" />}
        </g>
      </svg>
    </span>
  );
}
