require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, initSchema } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('UYARI: JWT_SECRET ayarlı değil, güvensiz varsayılan kullanılıyor. Railway\'de JWT_SECRET tanımlayın.');
}
if (!process.env.DATABASE_URL) {
  console.warn('UYARI: DATABASE_URL ayarlı değil. Kayıt/giriş çalışmayacak.');
}

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const QUESTIONS_DIR = path.join(CONTENT_DIR, 'questions');
const PDF_DIR = path.join(ROOT, 'pdfs');
const CLIENT_DIST = path.join(ROOT, 'client', 'dist');

app.use(express.json({ limit: '1mb' }));

// ---------- Auth yardımcıları ----------
function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '60d' });
}

function authRequired(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Oturum gerekli' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    req.username = payload.username;
    next();
  } catch {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş oturum' });
  }
}

function normUsername(u) {
  return String(u || '').trim().toLowerCase();
}

// ---------- Auth rotaları ----------
app.post('/api/auth/register', async (req, res) => {
  const username = normUsername(req.body.username);
  const password = String(req.body.password || '');
  if (username.length < 3 || username.length > 32) {
    return res.status(400).json({ error: 'Kullanıcı adı 3-32 karakter olmalı' });
  }
  if (!/^[a-z0-9_.]+$/.test(username)) {
    return res.status(400).json({ error: 'Kullanıcı adı yalnızca harf, rakam, _ ve . içerebilir' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, progress',
      [username, hash]
    );
    const user = rows[0];
    res.json({ token: signToken(user), username: user.username, progress: user.progress, avatarUrl: user.avatar_url || null });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış' });
    console.error('register error', e.message);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const username = normUsername(req.body.username);
  const password = String(req.body.password || '');
  try {
    const { rows } = await pool.query(
      'SELECT id, username, password_hash, progress, avatar_url FROM users WHERE username = $1',
      [username]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }
    res.json({ token: signToken(user), username: user.username, progress: user.progress, avatarUrl: user.avatar_url });
  } catch (e) {
    console.error('login error', e.message);
    res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
  }
});

// ---------- İlerleme rotaları ----------
app.get('/api/progress', authRequired, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT progress, avatar_url FROM users WHERE id = $1', [req.userId]);
    res.json({ progress: rows[0] ? rows[0].progress : {}, avatarUrl: rows[0]?.avatar_url || null });
  } catch (e) {
    res.status(500).json({ error: 'İlerleme okunamadı' });
  }
});

app.put('/api/progress', authRequired, async (req, res) => {
  const progress = req.body && typeof req.body === 'object' ? req.body : {};
  try {
    await pool.query('UPDATE users SET progress = $1, updated_at = now() WHERE id = $2', [progress, req.userId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'İlerleme kaydedilemedi' });
  }
});

// ---------- İçerik rotaları ----------
app.get('/api/units', (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'units.json'), 'utf8'));
    res.json(units);
  } catch (e) {
    res.status(500).json({ error: 'units.json okunamadı' });
  }
});

app.get('/api/questions', (req, res) => {
  const poolQ = [];
  try {
    if (fs.existsSync(QUESTIONS_DIR)) {
      for (const file of fs.readdirSync(QUESTIONS_DIR)) {
        if (!file.endsWith('.json')) continue;
        const data = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
        const qs = (data.questions || []).filter((q) => q.verified === true);
        for (const q of qs) poolQ.push({ ...q, unit: q.unit || data.unit });
      }
    }
    res.json({ count: poolQ.length, questions: poolQ });
  } catch (e) {
    res.status(500).json({ error: 'Sorular okunamadı: ' + e.message });
  }
});

// PDF'ler
app.use('/pdfs', express.static(PDF_DIR, {
  setHeaders: (res) => res.setHeader('Content-Disposition', 'inline'),
}));

// Statik client + SPA fallback
app.use(express.static(CLIENT_DIST));
app.get('*', (req, res) => {
  const indexFile = path.join(CLIENT_DIST, 'index.html');
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  res.status(200).send('<h1>SPL Düzey 1</h1><p>İstemci derlenmedi. <code>npm run build</code> çalıştırın.</p>');
});

// Başlat
(async () => {
  try {
    if (process.env.DATABASE_URL) {
      await initSchema();
      console.log('Veritabanı şeması hazır.');
    }
  } catch (e) {
    console.error('Şema oluşturma hatası:', e.message);
  }
  app.listen(PORT, () => console.log(`SPL server çalışıyor: http://localhost:${PORT}`));
})();
