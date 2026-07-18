// Soru JSON'larını doğrular: zorunlu alanlar, answer indeksi, source, verified tipi.
// Kullanım: node scripts/validate_questions.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QDIR = path.join(__dirname, '..', 'content', 'questions');

let errors = 0;
let verifiedCount = 0;
let totalCount = 0;

for (const file of fs.readdirSync(QDIR).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(QDIR, file), 'utf8'));
  const qs = data.questions || [];
  for (const q of qs) {
    totalCount++;
    const where = `${file}#${q.id}`;
    if (!q.id) err(where, 'id yok');
    if (!q.q) err(where, 'soru metni (q) yok');
    if (!Array.isArray(q.options) || q.options.length < 2)
      err(where, 'options en az 2 olmalı');
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= (q.options?.length || 0))
      err(where, `answer indeksi geçersiz (${q.answer})`);
    if (q.verified === true) {
      verifiedCount++;
      if (!q.source || !q.source.pdf)
        err(where, 'verified soru için source.pdf zorunlu');
      if (!q.source?.page) err(where, 'verified soru için source.page zorunlu');
    }
    if (typeof q.verified !== 'boolean') err(where, 'verified boolean olmalı');
  }
}

function err(where, msg) {
  console.error(`  ✗ ${where}: ${msg}`);
  errors++;
}

console.log(`\nToplam soru: ${totalCount} | Doğrulanmış (kullanıcıya gösterilen): ${verifiedCount}`);
if (errors) {
  console.error(`\n${errors} hata bulundu.`);
  process.exit(1);
}
console.log('Tüm sorular geçerli. ✓\n');
