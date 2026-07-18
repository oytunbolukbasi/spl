// Bir sorunun kaynağını gösteren modal: ünite, konu/bölüm, sayfa + "Notu Aç"
export default function SourceModal({ question, units, onClose }) {
  const unit = units.find((u) => u.code === question.unit);
  const src = question.source || {};
  const pdf = src.pdf || (unit && unit.notesPdf);
  const page = src.page;
  const pdfUrl = pdf ? `/pdfs/${pdf}${page ? '#page=' + page : ''}` : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>📚 Bu soru nereden?</h3>

        <div className="kv">
          <span className="k">Ünite</span>
          <span className="v">
            {question.unit} — {unit ? unit.title : ''}
          </span>
        </div>
        {src.section && (
          <div className="kv">
            <span className="k">Konu</span>
            <span className="v">{src.section}</span>
          </div>
        )}
        {page && (
          <div className="kv">
            <span className="k">Sayfa</span>
            <span className="v">{page}. sayfa (ders notu PDF)</span>
          </div>
        )}
        {question.flag && (
          <div className="flag-note" style={{ marginTop: 12 }}>
            ⚠️ {question.flag}
          </div>
        )}

        <div className="modal-actions">
          {pdfUrl && (
            <a
              className="btn blue"
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 Notu İlgili Sayfada Aç
            </a>
          )}
          <button className="btn ghost" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
