# İçerik Doğrulama ve Ekleme Kılavuzu

Bu proje, soru bankalarındaki soruları **ders notuyla doğrulamadan** kullanıcıya göstermez. Bu belge doğrulama akışını ve soru ekleme kurallarını açıklar.

## Neden görsel okuma?
PDF'ler font ile render edilmiş ama özel encoding kullandığından **düz metin çıkarımı çöp verir**. Bu yüzden sayfalar görüntüye render edilip görsel olarak okunur.

## Sayfa render aracı (macOS)
```bash
swift scripts/render_page.swift <pdf-yolu> <pdf-sayfa-no> <cikti.png> [olcek]
# örnek:
swift scripts/render_page.swift pdfs/1001-notes.pdf 185 /tmp/p185.png 2.0
```
Kurulum gerektirmez (Swift + PDFKit macOS'ta hazırdır).

## Doğrulama akışı (her soru için)
1. **Soru bankası** sayfasını render et → soru metni + şıklar + son sayfadaki **cevap anahtarı** harfini oku.
2. İlgili **ders notu** bölümünü render et → doğru cevabı notla teyit et.
3. `content/questions/<unit>.json` içine kayıt ekle (aşağıdaki şema).
4. Anahtar notla çelişiyorsa **notu esas al**, `flag` alanına düzeltmeyi yaz.
5. Şık etiketleri bozuksa (bankada görülebiliyor) düzelt ve `flag`'e not düş.
6. `node scripts/validate_questions.mjs` çalıştır.

## Soru şeması
```jsonc
{
  "id": "1001-28",                // benzersiz: <unit>-<bankadaki soru no>
  "q": "Soru metni…",
  "options": ["A şıkkı", "B", "C", "D", "E"],
  "answer": 3,                    // doğru şıkkın 0-tabanlı indeksi (DOĞRULANMIŞ)
  "keyAnswer": "D",               // bankanın cevap anahtarındaki harf (yoksa null)
  "explanation": "Notla teyitli kısa açıklama.",
  "source": {
    "pdf": "1001-notes.pdf",      // ders notu dosyası
    "page": 185,                  // DERS NOTU PDF SAYFA NO (bkz. ofset)
    "section": "1.3.2.3.4 Sürekli Gelişim İlkesi"
  },
  "verified": true,               // false ise kullanıcıya GÖSTERİLMEZ
  "flag": null                    // düzeltme/uyarı notu (opsiyonel)
}
```
- `verified: true` → `source.pdf` ve `source.page` **zorunlu**.
- `source.page` tarayıcıda `#page=N` ile açılır; **basılı sayfa değil, PDF sayfa numarasıdır**.

## Sayfa ofseti (basılı → PDF sayfa)
Ön kapak/başlık sayfaları nedeniyle PDF sayfa numarası basılı numaradan farklıdır.

| Ünite | Ofset (PDF = basılı + ofset) |
|-------|------------------------------|
| 1001-notes | **+3** (doğrulandı: basılı 182 = PDF 185) |
| 1003-notes | +4 (basılı 6 = PDF 10) — teyit edilmeli |
| 1005-notes | teyit edilmeli |
| 1012-notes | teyit edilmeli |

## 1001 Ünitesi — bölüm → PDF sayfa haritası (ofset +3)
| Bölüm | Basılı | PDF sayfa |
|-------|--------|-----------|
| 1.1.1 Sermaye Piyasası Kavramı | 1 | 4 |
| 1.1.2 Sermaye Piyasasının Unsurları | 2 | 5 |
| 1.1.3 Sermaye Piyasasına İlişkin Düzenlemeler | 5 | 8 |
| 1.1.4 6362 sayılı SPKn | 7 | 10 |
| 1.2.1 Özel Durumlar Tebliği (II-15.1) | 81 | 84 |
| 1.2.2 Kurumsal Yönetim Tebliği (II-17.1) | 96 | 99 |
| 1.2.3 Yatırım Fonlarına İlişkin Esaslar Tebliği (III-52.1) | 140 | 143 |
| 1.3.1 TSPB Meslek Kuralları | 173 | 176 |
| 1.3.2 Etik İlkeler ve Davranış Kuralları | 181 | 184 |
| 1.3.2.3 TSPB Etik İlkeleri (6 ilke listesi) | 182 | 185 |
| 1.3.3 TSPB Disiplin Yönetmeliği | 220 | 223 |

## Cevap anahtarları (soru bankaları)
Her bankanın son sayfasında **CEVAP ANAHTARI** tablosu vardır (örn. 1001 bankası PDF sayfa 81'de 515 sorunun anahtarı). Bu anahtar `keyAnswer` için kullanılır; `answer` ise nottan teyit edilerek belirlenir.

## Mevcut durum (kapsam)
- **1001**: 4 soru doğrulandı ve yayında (etik ilkeler). 5 soru (`verified:false`) not teyidi bekliyor. Hedef: 515 sorunun tamamı — partiler halinde.
- **1003, 1012**: banka + not mevcut, doğrulama bekliyor.
- **1005**: banka yok; sorular ders notundan üretilecek (aynı şema, `source` nottaki bölüme işaret eder).

## Deploy (Railway)
1. `railway.json` mevcut: build `npm install && npm run build`, start `npm start`.
2. GitHub'a push → Railway → **New Project → Deploy from GitHub repo → spl**.
3. Railway Node'u otomatik algılar; ortam değişkeni gerekmez (`PORT` otomatik).
4. PDF'ler repoda (~36 MB) — sorun değil.
