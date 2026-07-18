// Oturum için soru seçimi
export const DAILY_GOAL = 25;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Günlük karışık oturum: tüm doğrulanmış havuzdan, daha önce yanlış yapılanlara öncelik
export function buildDailySession(pool, seen, count = DAILY_GOAL) {
  if (!pool.length) return [];
  const wrong = pool.filter((q) => seen[q.id] === 'wrong');
  const rest = pool.filter((q) => seen[q.id] !== 'wrong');
  const ordered = [...shuffle(wrong), ...shuffle(rest)];
  return ordered.slice(0, Math.min(count, pool.length));
}

// Ünite bazlı pratik
export function buildUnitSession(pool, unitCode, count = DAILY_GOAL) {
  const unitQs = pool.filter((q) => q.unit === unitCode);
  return shuffle(unitQs).slice(0, Math.min(count, unitQs.length));
}

// Hatalardan tekrar oturumu
export function buildMistakeSession(mistakes) {
  return shuffle(mistakes);
}
