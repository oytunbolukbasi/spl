// Fındık — sincap maskot. Self-contained SVG, harici asset yok.
// mood: 'neutral' | 'happy' | 'sad'
export default function Squirrel({ mood = 'neutral', size = 120 }) {
  const eyeMouth = {
    neutral: (
      <>
        <circle cx="42" cy="60" r="5" fill="#3c3c3c" />
        <circle cx="70" cy="60" r="5" fill="#3c3c3c" />
        <circle cx="43.5" cy="58.5" r="1.6" fill="#fff" />
        <circle cx="71.5" cy="58.5" r="1.6" fill="#fff" />
        <path d="M48 74 q8 6 16 0" stroke="#3c3c3c" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M37 60 q5 -7 10 0" stroke="#3c3c3c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M65 60 q5 -7 10 0" stroke="#3c3c3c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M45 72 q11 12 22 0" stroke="#3c3c3c" strokeWidth="3.5" fill="#fff" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <circle cx="42" cy="62" r="5" fill="#3c3c3c" />
        <circle cx="70" cy="62" r="5" fill="#3c3c3c" />
        <path d="M35 52 q7 -4 13 -1" stroke="#3c3c3c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M64 51 q6 -3 13 1" stroke="#3c3c3c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M48 78 q8 -6 16 0" stroke="#3c3c3c" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-label="Fındık maskot">
      {/* kuyruk */}
      <path
        d="M92 92 q28 -6 22 -40 q-4 -26 -26 -24 q18 8 16 30 q-2 22 -20 26 z"
        fill="#c05a1e"
      />
      <path
        d="M96 86 q18 -6 14 -30 q-3 -18 -18 -18 q11 8 10 24 q-1 16 -14 20 z"
        fill="#e07b3a"
      />
      {/* gövde */}
      <ellipse cx="56" cy="86" rx="30" ry="28" fill="#e07b3a" />
      <ellipse cx="56" cy="92" rx="19" ry="18" fill="#ffe0c2" />
      {/* ayaklar */}
      <ellipse cx="42" cy="112" rx="8" ry="5" fill="#c05a1e" />
      <ellipse cx="70" cy="112" rx="8" ry="5" fill="#c05a1e" />
      {/* baş */}
      <circle cx="56" cy="56" r="34" fill="#e07b3a" />
      {/* kulaklar */}
      <path d="M30 30 q-6 -16 8 -18 q8 6 6 18 z" fill="#e07b3a" />
      <path d="M82 30 q6 -16 -8 -18 q-8 6 -6 18 z" fill="#e07b3a" />
      <path d="M31 26 q-2 -8 5 -10 z" fill="#c05a1e" />
      <path d="M81 26 q2 -8 -5 -10 z" fill="#c05a1e" />
      {/* yüz açık ton */}
      <ellipse cx="56" cy="62" rx="24" ry="22" fill="#ffe0c2" />
      {/* yanaklar */}
      <circle cx="34" cy="70" r="6" fill="#ffb38a" opacity="0.7" />
      <circle cx="78" cy="70" r="6" fill="#ffb38a" opacity="0.7" />
      {/* burun */}
      <ellipse cx="56" cy="68" rx="4" ry="3" fill="#7a3b12" />
      {/* göz + ağız (mood) */}
      {eyeMouth[mood]}
      {/* ön dişler (happy/neutral) */}
      {mood !== 'sad' && <rect x="53" y="76" width="6" height="6" rx="1.5" fill="#fff" />}
    </svg>
  );
}
