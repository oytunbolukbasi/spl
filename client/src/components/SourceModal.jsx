import { BookOpen, FileText, TriangleAlert } from 'lucide-react';

function YoutubeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: '-3px' }}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.5v-7l6.3 3.5-6.3 3.5z"/>
    </svg>
  );
}

export default function SourceModal({ question, units, onClose }) {
  const unit = units.find((u) => u.code === question.unit);
  const src = question.source || {};
  const pdf = src.pdf || (unit && unit.notesPdf);
  const page = src.page;
  const pdfUrl = pdf ? `/pdfs/${pdf}${page ? '#page=' + page : ''}` : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3><BookOpen size={18} /> Bu soru nereden?</h3>

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
            <TriangleAlert size={14} /> {question.flag}
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
              <FileText size={18} /> Notu İlgili Sayfada Aç
            </a>
          )}
          {src.youtube && (
            <a
              className="btn yt-btn"
              href={src.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeIcon /> YouTube'da İzle
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
