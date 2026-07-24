# Fındık Design System

## Renk Paleti

### Ana Renkler
| Değişken | Değer | Kullanım |
|----------|-------|----------|
| `--green` | `#3F8F3F` | Brand yeşili, CTA butonları, aktif durumlar |
| `--green-dark` | `#2E7A2E` | Buton gölge, hover, koyu vurgu |
| `--green-light` | `#E8F5E8` | Açık yeşil arkaplan, aktif nav, doğru cevap bg |

### Ünite Renkleri
| Ünite | Renk | Kullanım |
|-------|------|----------|
| 1001 — Mevzuat | `#3F8F3F` | Badge, progress ring |
| 1003 — Araçlar | `#4A90D9` | Badge, progress ring |
| 1005 — Yatırım Kur. | `#9B6DC6` | Badge, progress ring |
| 1012 — Takas | `#E8832A` | Badge, progress ring |

### Durum Renkleri
| Değişken | Değer | Kullanım |
|----------|-------|----------|
| `--blue` | `#4A90D9` | Bilgi, link, soru ünitesi chip |
| `--purple` | `#9B6DC6` | Ünite 1005 |
| `--orange` | `#E8832A` | Streak badge, ünite 1012 |
| `--red` | `#D94444` | Hata, yanlış cevap |
| `--red-light` | `#FDECEC` | Yanlış cevap arka planı |
| `--gold` | `#E8A800` | XP badge |

### Nötr Tonlar
| Değişken | Değer | Kullanım |
|----------|-------|----------|
| `--ink` | `#1E2A1E` | Ana metin rengi |
| `--muted` | `#9AA093` | İkincil metin, etiketler |
| `--muted-dark` | `#6B8062` | Daha koyu ikincil metin |
| `--line` | `#E2DFD6` | Ayırıcı çizgiler (1px) |
| `--bg` | `#FFFFFF` | Kart arka planı |
| `--page-bg` | `#F7F6F1` | Sayfa arka planı (sıcak bej) |
| `--panel` | `#F2F0E8` | Panel arka planı |
| `--track` | `#EDEBE3` | Progress bar/ring track |

## Tipografi

| Aile | Ağırlıklar | Kullanım |
|------|-----------|----------|
| **Baloo 2** | 600, 700, 800 | Başlıklar, brand logosu, buton metinleri, ünite kartı başlıkları, soru metni |
| **Inter** | 400, 500, 600, 700, 800 | Gövde metni, etiketler, sayısal değerler, açıklamalar |

CSS değişkenleri:
- `--font-heading`: `'Baloo 2', 'Nunito', system-ui, sans-serif`
- `--font-body`: `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`

Google Fonts yüklemesi `client/index.html`'de `<link>` ile yapılır.

## Bileşen Stilleri

### Kartlar
- Arka plan: beyaz (`--bg`)
- Kenar: yok (border kaldırıldı)
- Gölge: `0 4px 20px rgba(30, 42, 30, 0.08)`
- Köşe yuvarlaklığı: `20px` (`--radius`)
- Hover: `translateY(-2px)` + güçlenmiş gölge

### Butonlar (.btn)
- Font: Baloo 2, 700 weight, uppercase
- Köşe: `--radius` (20px)
- Ana CTA: yeşil bg + koyu yeşil `box-shadow: 0 4px 0`
- `.btn.white`: beyaz bg, yeşil metin (günlük hedef kartındaki CTA)
- `.btn.ghost`: beyaz bg, border + gölge
- Active: `translateY(3px)` ile basma efekti

### Hero Banner (mobil)
- Rastgele renk teması (4 tema: yeşil, mavi, mor, turuncu tonlarında pale gradyan)
- Mascot sağ üstte 72px
- Genişletilebilir tip alanı (ChevronDown ile)
- Desktop (1024px+): arkaplan/gölge/mascot gizlenir, düz metin

### Günlük Hedef Kartı
- Yeşil gradyan arka plan
- Progress bar: altın sarısı (`--gold`) dolgu, yarı saydam track
- CTA: `.btn.white`

### Ünite Kartları
- Beyaz kart + gölge (border yok)
- 52x52 renkli badge (ünite rengi, 14px radius)
- Progress ring: 44x44, ünite renginde dolgu, `--track` renginde arka halka

### Navigasyon
- Aktif durum: yeşil arka plan (`--green-light`) + yeşil border
- Font: Baloo 2, uppercase
- Sidebar border: 1px (ince)

### Top Bar (mobil)
- Beyaz bg, 1px alt çizgi
- Sol: hamburger + brand logosu
- Sağ: streak badge + XP badge + avatar

## Tema Renkleri (meta)
- `theme-color`: `#3F8F3F` (tarayıcı çubuğu, PWA)
