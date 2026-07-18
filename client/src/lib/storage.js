// localStorage tabanlı tek-kullanıcı ilerleme deposu
const KEY = 'spl_progress_v1';

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

const DEFAULT = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  daily: { day: null, answered: 0, correct: 0 }, // günlük hedef takibi
  mistakes: [], // {id, q, options, answer, chosen, unit, source, explanation, flag}
  seen: {}, // id -> son doğru/yanlış (tekrar önceliklendirme için)
};

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const data = JSON.parse(raw);
    return { ...DEFAULT, ...data, daily: { ...DEFAULT.daily, ...(data.daily || {}) } };
  } catch {
    return { ...DEFAULT };
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* yoksay */
  }
}

// Günlük sayaç bugüne ait değilse sıfırla
export function ensureToday(state) {
  const t = todayStr();
  if (state.daily.day !== t) {
    state.daily = { day: t, answered: 0, correct: 0 };
  }
  return state;
}

// Bir soru cevaplandığında çağrılır
export function recordAnswer(state, question, chosenIndex, isCorrect) {
  ensureToday(state);
  const t = todayStr();

  // streak: bugün ilk aktivite ise gün serisini güncelle
  if (state.lastActiveDay !== t) {
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak = state.lastActiveDay === y ? state.streak + 1 : 1;
    state.lastActiveDay = t;
  }

  state.daily.answered += 1;
  if (isCorrect) {
    state.daily.correct += 1;
    state.xp += 10;
    // doğru cevaplanınca hata listesinden çıkar
    state.mistakes = state.mistakes.filter((m) => m.id !== question.id);
  } else {
    state.xp += 2;
    const entry = {
      id: question.id,
      q: question.q,
      options: question.options,
      answer: question.answer,
      chosen: chosenIndex,
      unit: question.unit,
      source: question.source,
      explanation: question.explanation,
      flag: question.flag || null,
    };
    state.mistakes = [entry, ...state.mistakes.filter((m) => m.id !== question.id)];
  }
  state.seen[question.id] = isCorrect ? 'correct' : 'wrong';
  save(state);
  return state;
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}
