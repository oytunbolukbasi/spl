import { useState } from 'react';
import { RotateCcw, BookOpen, Check, X, PartyPopper } from 'lucide-react';
import SourceModal from './SourceModal.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function MistakesReview({ progress, units, onReview }) {
  const [srcQ, setSrcQ] = useState(null);
  const mistakes = progress.mistakes || [];

  return (
    <>
      <div className="section-title">Hatalarım</div>

      {mistakes.length === 0 ? (
        <div className="empty">
          <PartyPopper size={22} style={{ verticalAlign: '-5px', marginRight: 4 }} />
          Henüz hata yok. Doğru cevapladıkça buradan çıkarılır.
        </div>
      ) : (
        <>
          <button className="btn" onClick={onReview} style={{ marginBottom: 16 }}>
            <RotateCcw size={18} /> Hataları Tekrar Çöz ({mistakes.length})
          </button>
          {mistakes.map((m) => {
            const unit = units.find((u) => u.code === m.unit);
            return (
              <div className="mistake" key={m.id}>
                <div className="mq">{m.q}</div>
                <div className="ma right">
                  <Check size={15} /> Doğru: {LETTERS[m.answer]}) {m.options[m.answer]}
                </div>
                {m.chosen != null && m.chosen !== m.answer && (
                  <div className="ma you">
                    <X size={15} /> Senin cevabın: {LETTERS[m.chosen]}) {m.options[m.chosen]}
                  </div>
                )}
                <button
                  className="btn ghost small"
                  style={{ marginTop: 8 }}
                  onClick={() => setSrcQ(m)}
                >
                  <BookOpen size={15} /> Kaynağı Gör
                </button>
                <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
                  {m.unit}{unit ? ' • ' + unit.shortTitle : ''}
                </span>
              </div>
            );
          })}
        </>
      )}

      {srcQ && <SourceModal question={srcQ} units={units} onClose={() => setSrcQ(null)} />}
    </>
  );
}
