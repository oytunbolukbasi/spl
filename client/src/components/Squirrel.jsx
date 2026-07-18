import { useEffect, useRef, useState } from 'react';

// Fındık — sevimli, gözlüklü çizgi film sincabı. Sıfırdan özgün SVG.
// Büyük yeşil gözler + yuvarlak kırmızı gözlük, ponpon kuyruk, kulak püskülleri, kitap.
// Sayfa açılışında intro; tıklanınca sincaba özgü mini animasyonlar (fındık yeme vb.).
// mood: 'neutral' | 'happy' | 'sad'
const CLICK_ANIMS = ['eat', 'hop', 'flick', 'blink', 'eat'];

export default function Squirrel({ mood = 'neutral', size = 130, interactive = true }) {
  const [intro, setIntro] = useState(true);
  const [anim, setAnim] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  function play() {
    if (!interactive) return;
    const pick = CLICK_ANIMS[Math.floor(Math.random() * CLICK_ANIMS.length)];
    setAnim(null);
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

  const happy = mood === 'happy';
  const sad = mood === 'sad';

  return (
    <span
      className={cls}
      style={{ width: size, height: size }}
      onClick={play}
      role={interactive ? 'button' : 'img'}
      aria-label="Fındık maskot"
    >
      <svg viewBox="0 0 220 230" width={size} height={size}>
        <defs>
          <radialGradient id="furG" cx="45%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffb066" />
            <stop offset="100%" stopColor="#f5893e" />
          </radialGradient>
          <linearGradient id="tailG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb268" />
            <stop offset="100%" stopColor="#ef8236" />
          </linearGradient>
          <radialGradient id="eyeG" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#7fe0a6" />
            <stop offset="60%" stopColor="#39b56b" />
            <stop offset="100%" stopColor="#1f8f4e" />
          </radialGradient>
        </defs>

        {/* ---------- Kuyruk (ponpon, kıvrık) ---------- */}
        <g className="sq-tail">
          <path
            d="M150 196
               C205 200 214 150 205 116
               C198 88 176 66 150 66
               C132 66 120 78 120 92
               C132 78 154 82 162 98
               C170 114 165 132 150 140
               C170 132 188 140 186 160
               C185 176 172 190 150 196 Z"
            fill="#d9702a"
          />
          <path
            d="M152 188
               C196 190 202 150 194 120
               C188 96 170 78 150 79
               C168 88 174 108 166 126
               C182 120 194 130 191 150
               C189 168 174 182 152 188 Z"
            fill="url(#tailG)"
          />
          <path
            d="M158 176 C186 172 190 146 183 126 C178 140 168 148 160 150 C172 150 178 160 174 170 Z"
            fill="#ffd0a0"
            opacity="0.7"
          />
        </g>

        {/* ---------- Gövde ---------- */}
        <g className="sq-body">
          <ellipse cx="100" cy="158" rx="52" ry="55" fill="url(#furG)" stroke="#d9702a" strokeWidth="3" />
          <ellipse cx="100" cy="168" rx="34" ry="42" fill="#fff6ec" />
          {/* ayaklar */}
          <ellipse className="sq-paw" cx="72" cy="205" rx="15" ry="10" fill="#f5893e" stroke="#d9702a" strokeWidth="2.5" />
          <ellipse className="sq-paw" cx="128" cy="205" rx="15" ry="10" fill="#f5893e" stroke="#d9702a" strokeWidth="2.5" />

          {/* Kitap (kırmızı) + kucaklayan kollar */}
          <g className="sq-book">
            <rect x="66" y="150" width="52" height="66" rx="5" transform="rotate(-8 92 183)" fill="#a12b22" />
            <rect x="70" y="150" width="48" height="66" rx="5" transform="rotate(-8 94 183)" fill="#c0392b" />
            <rect x="80" y="165" width="30" height="7" rx="2" transform="rotate(-8 95 168)" fill="#f7dfae" />
            <rect x="80" y="178" width="30" height="4" rx="2" transform="rotate(-8 95 180)" fill="#f7dfae" opacity="0.8" />
          </g>
          {/* kollar */}
          <path d="M60 150 q-8 22 14 34" fill="none" stroke="#d9702a" strokeWidth="3" />
          <ellipse cx="64" cy="150" rx="12" ry="9" fill="#f5893e" stroke="#d9702a" strokeWidth="2.5" transform="rotate(-20 64 150)" />
          <ellipse cx="126" cy="188" rx="12" ry="9" fill="#f5893e" stroke="#d9702a" strokeWidth="2.5" transform="rotate(30 126 188)" />
        </g>

        {/* ---------- Baş ---------- */}
        <g className="sq-head">
          {/* kulaklar + püsküller */}
          <g className="sq-ears">
            <path d="M58 24 q-6 -20 6 -20 q6 8 6 22 z" fill="#d9702a" />
            <path d="M46 22 q4 -18 12 -20 q-2 10 -6 22 z" fill="#d9702a" />
            <path d="M162 24 q6 -20 -6 -20 q-6 8 -6 22 z" fill="#d9702a" />
            <path d="M174 22 q-4 -18 -12 -20 q2 10 6 22 z" fill="#d9702a" />
            <path d="M50 62 C44 30 58 18 74 24 C86 30 90 52 82 70 Z" fill="url(#furG)" stroke="#d9702a" strokeWidth="3" />
            <path d="M170 62 C176 30 162 18 146 24 C134 30 130 52 138 70 Z" fill="url(#furG)" stroke="#d9702a" strokeWidth="3" />
            <path d="M58 56 C54 36 64 28 74 32 C80 40 80 52 74 62 Z" fill="#f6a9a0" />
            <path d="M162 56 C166 36 156 28 146 32 C140 40 140 52 146 62 Z" fill="#f6a9a0" />
          </g>

          {/* kafa */}
          <circle cx="110" cy="88" r="62" fill="url(#furG)" stroke="#d9702a" strokeWidth="3" />

          {/* beyaz yanak/ağız bölgesi */}
          <path d="M62 100 C62 78 158 78 158 100 C158 132 132 150 110 150 C88 150 62 132 62 100 Z" fill="#fff6ec" />
          <circle cx="80" cy="120" r="20" fill="#fff6ec" />
          <circle cx="140" cy="120" r="20" fill="#fff6ec" />

          {/* freckle noktaları */}
          <g fill="#e58a4e" opacity="0.65">
            <circle cx="70" cy="118" r="1.7" /><circle cx="76" cy="126" r="1.7" /><circle cx="66" cy="128" r="1.7" />
            <circle cx="150" cy="118" r="1.7" /><circle cx="144" cy="126" r="1.7" /><circle cx="154" cy="128" r="1.7" />
          </g>

          {/* gözler */}
          <g className="sq-eyes">
            {sad ? (
              <>
                <path d="M74 92 q10 -6 20 0" stroke="#3a2a1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M126 92 q10 -6 20 0" stroke="#3a2a1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </>
            ) : happy ? (
              <>
                <path d="M72 96 q12 -14 24 0" stroke="#2c2018" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M124 96 q12 -14 24 0" stroke="#2c2018" strokeWidth="4" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* sol göz */}
                <circle cx="84" cy="92" r="20" fill="#fff" />
                <circle cx="84" cy="92" r="15" fill="url(#eyeG)" />
                <circle cx="84" cy="93" r="8.5" fill="#20140f" />
                <circle cx="79" cy="86" r="4" fill="#fff" />
                <circle cx="89" cy="97" r="2" fill="#fff" opacity="0.8" />
                {/* sağ göz */}
                <circle cx="136" cy="92" r="20" fill="#fff" />
                <circle cx="136" cy="92" r="15" fill="url(#eyeG)" />
                <circle cx="136" cy="93" r="8.5" fill="#20140f" />
                <circle cx="131" cy="86" r="4" fill="#fff" />
                <circle cx="141" cy="97" r="2" fill="#fff" opacity="0.8" />
                {/* kirpikler */}
                <path d="M66 82 q-6 -3 -9 -7" stroke="#2c2018" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M154 82 q6 -3 9 -7" stroke="#2c2018" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* gözlük (yuvarlak kırmızı) */}
          {!sad && (
            <g className="sq-glasses" fill="none" stroke="#c0392b" strokeWidth="5">
              <circle cx="84" cy="92" r="24" />
              <circle cx="136" cy="92" r="24" />
              <path d="M108 90 q2 -4 4 0" strokeWidth="4.5" />
              <path d="M60 90 q-10 -6 -16 -3" strokeLinecap="round" />
              <path d="M160 90 q10 -6 16 -3" strokeLinecap="round" />
              <circle cx="84" cy="92" r="24" stroke="#e05a4c" strokeWidth="1.6" opacity="0.6" />
              <circle cx="136" cy="92" r="24" stroke="#e05a4c" strokeWidth="1.6" opacity="0.6" />
            </g>
          )}

          {/* burun */}
          <ellipse cx="110" cy="116" rx="7" ry="5" fill="#e87d8a" />
          <ellipse cx="107.5" cy="114" rx="2.2" ry="1.5" fill="#fff" opacity="0.7" />

          {/* ağız + dişler */}
          {sad ? (
            <path d="M100 138 q10 -7 20 0" stroke="#7a5038" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <>
              <path d="M110 121 v7" stroke="#7a5038" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M110 128 q-11 12 -20 3" stroke="#7a5038" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M110 128 q11 12 20 3" stroke="#7a5038" strokeWidth="3" fill="none" strokeLinecap="round" />
              <rect className="sq-teeth" x="104" y="129" width="12" height="9" rx="2" fill="#fff" stroke="#e5d9c8" strokeWidth="1" />
              <line x1="110" y1="129" x2="110" y2="138" stroke="#e5d9c8" strokeWidth="1" />
            </>
          )}
        </g>

        {/* Fındık — yeme animasyonunda görünür */}
        <g className="sq-nut">
          <ellipse cx="110" cy="150" rx="8" ry="9.5" fill="#c98a54" />
          <path d="M101 147 Q110 140 119 147 Q110 152 101 147 Z" fill="#7a4a22" />
        </g>
      </svg>
    </span>
  );
}
