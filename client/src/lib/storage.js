// İlerleme durumu — sunucuda (Neon Postgres) saklanır. Burada yalnızca saf iş mantığı var.
function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

const DEFAULT = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  daily: { day: null, answered: 0, correct: 0 },
  mistakes: [],
  seen: {},
};

// Sunucudan gelen (veya boş) ilerlemeyi varsayılanlarla birleştirir.
export function normalize(data) {
  data = data && typeof data === 'object' ? data : {};
  return {
    ...DEFAULT,
    ...data,
    daily: { ...DEFAULT.daily, ...(data.daily || {}) },
    mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
    seen: data.seen && typeof data.seen === 'object' ? data.seen : {},
  };
}

export function emptyProgress() {
  return normalize({});
}

// Günlük sayaç bugüne ait değilse sıfırla
export function ensureToday(state) {
  const t = todayStr();
  if (state.daily.day !== t) {
    state.daily = { day: t, answered: 0, correct: 0 };
  }
  return state;
}

const DAILY_GOAL = 25;

export function recordAnswer(state, question, chosenIndex, isCorrect) {
  ensureToday(state);
  const t = todayStr();

  state.daily.answered += 1;

  if (state.lastActiveDay !== t && state.daily.answered >= DAILY_GOAL) {
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak = state.lastActiveDay === y ? state.streak + 1 : 1;
    state.lastActiveDay = t;
  }
  if (isCorrect) {
    state.daily.correct += 1;
    state.xp += 10;
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
  return state;
}
