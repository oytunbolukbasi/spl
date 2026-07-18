const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const QUESTIONS_DIR = path.join(CONTENT_DIR, 'questions');
const PDF_DIR = path.join(ROOT, 'pdfs');
const CLIENT_DIST = path.join(ROOT, 'client', 'dist');

// ---- API ----

// Ünite metadata
app.get('/api/units', (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'units.json'), 'utf8'));
    res.json(units);
  } catch (e) {
    res.status(500).json({ error: 'units.json okunamadı' });
  }
});

// Tüm doğrulanmış sorular (birleştirilmiş havuz). Yalnızca verified === true olanlar döner.
app.get('/api/questions', (req, res) => {
  const pool = [];
  try {
    if (fs.existsSync(QUESTIONS_DIR)) {
      for (const file of fs.readdirSync(QUESTIONS_DIR)) {
        if (!file.endsWith('.json')) continue;
        const data = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
        const qs = (data.questions || []).filter((q) => q.verified === true);
        for (const q of qs) pool.push({ ...q, unit: q.unit || data.unit });
      }
    }
    res.json({ count: pool.length, questions: pool });
  } catch (e) {
    res.status(500).json({ error: 'Sorular okunamadı: ' + e.message });
  }
});

// PDF'leri statik sun (tarayıcı görüntüleyicisinde #page=N ile açmak için)
app.use('/pdfs', express.static(PDF_DIR, {
  setHeaders: (res) => res.setHeader('Content-Disposition', 'inline'),
}));

// ---- Statik client ----
app.use(express.static(CLIENT_DIST));

// SPA fallback (API ve pdf dışındaki her şey index.html'e)
app.get('*', (req, res) => {
  const indexFile = path.join(CLIENT_DIST, 'index.html');
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  res
    .status(200)
    .send('<h1>SPL Düzey 1</h1><p>İstemci henüz derlenmedi. <code>npm run build</code> çalıştırın.</p>');
});

app.listen(PORT, () => {
  console.log(`SPL server çalışıyor: http://localhost:${PORT}`);
});
