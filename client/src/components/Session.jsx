import { useState } from 'react';
import Squirrel from './Squirrel.jsx';
import SourceModal from './SourceModal.jsx';
import { recordAnswer } from '../lib/storage.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function Session({ questions, title, units, progress, onAnswer, onExit }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const total = questions.length;
  const unit = units.find((u) => u.code === q?.unit);
  const isCorrect = checked && selected === q.answer;

  function check() {
    if (selected == null || checked) return;
    const correct = selected === q.answer;
    setChecked(true);
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
    }));
    const next = recordAnswer(progress, q, selected, correct);
    onAnswer(next);
  }

  function nextQuestion() {
    if (idx + 1 >= total) {
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setSelected(null);
    setChecked(false);
    setShowSource(false);
  }

  if (done) {
    const acc = total ? Math.round((stats.correct / total) * 100) : 0;
    return (
      <div className="session">
        <div className="result">
          <Squirrel size={130} mood={acc >= 60 ? 'happy' : 'sad'} />
          <h1>{acc >= 60 ? 'Harika iş!' : 'Devam et!'}</h1>
          <p style={{ color: '#777' }}>{title} oturumu tamamlandı</p>
          <div className="result-stats">
            <div className="rstat good">
              <div className="big">{stats.correct}</div>
              <div className="lbl">Doğru</div>
            </div>
            <div className="rstat bad">
              <div className="big">{stats.wrong}</div>
              <div className="lbl">Yanlış</div>
            </div>
            <div className="rstat">
              <div className="big">%{acc}</div>
              <div className="lbl">Başarı</div>
            </div>
          </div>
          <button className="btn" onClick={onExit}>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.round((idx / total) * 100);

  return (
    <div className="session">
      <div className="session-top">
        <button className="close-x" onClick={onExit} aria-label="Kapat">
          ✕
        </button>
        <div className="pbar-outer">
          <div className="pbar-inner" style={{ width: progressPct + '%' }} />
        </div>
        <span style={{ fontWeight: 800, color: '#777', fontSize: 14 }}>
          {idx + 1}/{total}
        </span>
      </div>

      <div className="q-area">
        <span className="q-unit-chip" style={unit ? { color: unit.color, background: unit.color + '22' } : {}}>
          {q.unit}{unit ? ' • ' + unit.shortTitle : ''}
        </span>
        <div className="q-text">{q.q}</div>

        <div className="options">
          {q.options.map((opt, i) => {
            let cls = 'opt';
            if (!checked && selected === i) cls += ' selected';
            if (checked && i === q.answer) cls += ' correct';
            if (checked && selected === i && i !== q.answer) cls += ' wrong';
            return (
              <button
                key={i}
                className={cls}
                disabled={checked}
                onClick={() => setSelected(i)}
              >
                <span className="key">{LETTERS[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={'footer-bar' + (checked ? (isCorrect ? ' correct' : ' wrong') : '')}>
        {checked && (
          <>
            <div className="fb-head">
              <span className={'fb-title ' + (isCorrect ? 'correct' : 'wrong')}>
                {isCorrect ? '✅ Doğru!' : '❌ Yanlış — Doğrusu: ' + LETTERS[q.answer]}
              </span>
            </div>
            {q.flag && <div className="flag-note">⚠️ {q.flag}</div>}
            {q.explanation && (
              <div className="fb-expl">
                {q.explanation}{' '}
                <button className="src-link" onClick={() => setShowSource(true)}>
                  Kaynağı Gör →
                </button>
              </div>
            )}
            {!q.explanation && (
              <div className="fb-expl">
                <button className="src-link" onClick={() => setShowSource(true)}>
                  Kaynağı Gör →
                </button>
              </div>
            )}
          </>
        )}

        {!checked ? (
          <button className="btn" onClick={check} disabled={selected == null}>
            Kontrol Et
          </button>
        ) : (
          <button
            className={'btn' + (isCorrect ? '' : ' blue')}
            onClick={nextQuestion}
          >
            {idx + 1 >= total ? 'Bitir' : 'Devam'}
          </button>
        )}
      </div>

      {showSource && (
        <SourceModal question={q} units={units} onClose={() => setShowSource(false)} />
      )}
    </div>
  );
}
