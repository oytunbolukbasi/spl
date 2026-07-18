# 🐿️ Fındık — SPL Düzey 1 Sınav Hazırlık

Sermaye Piyasası Faaliyetleri Düzey 1 Lisansı sınavına Duolingo tarzı, oyunlaştırılmış hazırlık uygulaması. Maskotumuz sincap **Fındık**.

- **Günlük 25 soru**, anında doğru/yanlış geri bildirim
- Her sorunun **hangi ünite / konu / ders notu sayfasına** dayandığını gösteren modal ("Notu Aç" ile PDF ilgili sayfada açılır)
- **Hatalarım** bölümü — yanlışları tekrar çöz
- XP + günlük seri (streak), ilerleme tarayıcıda (localStorage) tutulur
- Mobil öncelikli, responsive

> **Kritik kural:** Bir soru, doğru cevabı ilgili ünitenin ders notundan **doğrulanmadan** (`verified: true`) kullanıcıya gösterilmez. Doğrulanmamış sorular havuza girmez.

## Üniteler
| Kod | Ders | Soru bankası |
|-----|------|--------------|
| 1001 | Dar Kapsamlı Sermaye Piyasası Mevzuatı ve Meslek Kuralları | ✔ (515 soru + cevap anahtarı) |
| 1003 | Sermaye Piyasası Araçları 1 | ✔ |
| 1005 | Yatırım Kuruluşları | ✗ yok — sorular ders notundan üretilir |
| 1012 | Takas, Saklama ve Operasyon İşlemleri | ✔ |

## Çalıştırma (yerel)
```bash
npm install          # kök + client bağımlılıkları (postinstall client'ı kurar)
npm run build        # React client'ı client/dist'e derler
npm start            # Express sunucu :3000
# → http://localhost:3000
```
Geliştirme (hot reload) için iki terminal:
```bash
npm run dev:server   # Express :3000
npm run dev:client   # Vite :5173 (api/pdf isteklerini :3000'e proxy'ler)
```

## Proje yapısı
```
server/index.js        Express: /api/units, /api/questions (yalnız verified), /pdfs, statik client
client/                Vite + React uygulaması
content/units.json     Ünite metadata
content/questions/*.json  Doğrulanmış soru havuzu (unit bazlı)
pdfs/                  Ders notu + soru bankası PDF'leri (ascii slug)
scripts/render_page.swift      PDF sayfa → PNG (içerik doğrulama aracı, macOS)
scripts/validate_questions.mjs Soru JSON doğrulayıcı
```

## İçerik ekleme
Yeni soruların nasıl doğrulanıp eklendiği için bkz. **[CONTENT.md](CONTENT.md)**.
Ekledikten sonra: `node scripts/validate_questions.mjs`

## Railway deploy
Bkz. [CONTENT.md](CONTENT.md) sonundaki "Deploy" bölümü ve `railway.json`.
Özet: repoyu GitHub'a push et → Railway'de "Deploy from GitHub repo" → otomatik `npm install && npm run build` + `npm start`. Ortam değişkeni gerekmez (Railway `PORT`'u otomatik verir).
