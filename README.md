# Project Ascend

> Kalistenik öğrenmenin haritası — her hareketin bir beceri düğümü olduğu,
> ön koşullarını tamamlamadan ilerleyemediğin, RPG mantığında bir gelişim sistemi.

**Bu bir antrenman kaydedici değil.** Kaydediciler geçmişi tutar; bu sistem
sıradaki adımı gösterir.

**▶ Canlı:** [kuurtali.github.io/project-ascend](https://kuurtali.github.io/project-ascend)
Telefonda aç, tarayıcı menüsünden "Ana ekrana ekle" — uygulama gibi çalışır,
internetsiz de açılır.

---

## Neden var

Kalistenikte insanların bıraktığı nokta neredeyse hiçbir zaman "yeteneğim yok"
değil. Üç şeyden biri:

1. **Sırayı bilmemek.** Planche istiyor, pseudo planche push-up'ı hiç duymamış.
2. **İlerlediğini görememek.** 8 haftada push-up'ı 12'den 16'ya çıkarmış — ciddi
   bir gelişme, ama hiçbir yerde yazılı olmadığı için hissedilmiyor.
3. **Ölçek körlüğü.** Front lever 2 yıllık bir iş. Bunu bilmeyen 3. ayda bırakıyor.

Üçü de bilgi ve görünürlük problemi, antrenman problemi değil.

---

## Şu an ne var

| | |
|---|---|
| **197 hareket** | Ön koşul grafı ile bağlanmış, 237 bağlantı, 11 katman derinlik |
| **22 boss** | Muscle-Up, Front Lever, Planche, Human Flag, Iron Cross… |
| **12 kategori** | Push, Pull, Core, Legs, Balance, Mobility, Elite… |
| **11 otomatik kontrol** | Kırık referans, döngü, yetim düğüm, erişilemez boss, ekipman kaskadı |
| **Doğrulama** | 0 hata, 0 uyarı |
| **35 motor testi** | Kilit, mastery, uyarlama, planner — hepsi geçiyor |
| **Uygulama** | Bugün · Ağaç · İlerleme · Ayarlar — telefonda çalışır |

```
197 hareket · 22 boss · 23 başlangıç düğümü · 50 aksesuar
237 bağlantı · maksimum derinlik 11 · toplam kazanılabilir XP 525.480
```

---

## Depo yapısı

```
.
├── docs/
│   ├── SECOND_BRAIN.md      ← projenin tamamı: amaç, mimari, kararlar (3.7k satır)
│   ├── CHECKPOINT.md        ← nerede kaldık
│   └── archive/             ← ilk vizyon notları, aşılmış dokümanlar
├── data/
│   ├── movements.json       ← TEK DOĞRULUK KAYNAĞI (197 hareket)
│   └── validation_report.txt
├── src/
│   ├── engine/              ← MOTOR: UI'sız, saf TypeScript, 35 test
│   │   ├── mastery.ts       kilit mantığı, kademe, yakınlık, denge puanı
│   │   ├── adaptation.ts    uyarlama kuralı — hedefi kayıttan hesaplar
│   │   ├── planner.ts       progression planner + slot atama
│   │   └── types.ts
│   ├── ui/                  ← Bugün · Ağaç · İlerleme · Ayarlar
│   ├── program.ts           haftalık şablon
│   └── storage.ts           yerel kayıt, dışa/içe aktarma
├── tools/
│   ├── movements_data.py    ← elle düzenlenen kaynak veri
│   ├── build_db.py          ← genişletici + doğrulayıcı (11 kontrol)
│   ├── make_layout.py       ← ağaç yerleşimi
│   └── test_prototype.js    ← prototip testleri
├── public/                  ← manifest, ikon, service worker
├── .github/workflows/       ← test + doğrulama + otomatik yayın
└── prototype/
    └── index.html           ← ilk deneme tahtası (arşiv)
```

### Motor katmanı neden ayrı

`src/engine/` DOM bilmez, React bilmez. Girdi `(movements, playerState)`,
çıktı yeni durum. Böylece oyun kuralları tek tek test edilebiliyor ve arayüz
baştan yazılsa bile mekanikler korunuyor.

Ayrıca uyarlama kuralı ve planner **deterministik** — dil modeli
gerektirmiyorlar. Uygulama kendi başına hedef ayarlıyor ve slot seçiyor.

---

## Nasıl çalıştırılır

**Uygulama:**

```bash
npm ci
npm run dev        # geliştirme sunucusu
npm test           # motor testleri
npm run build      # üretim derlemesi
```

**Veriyi yeniden üretmek için:**

```bash
cd tools
python3 build_db.py        # movements.json + doğrulama raporu — 0 hata vermeli
python3 make_layout.py     # ağaç yerleşimi + src/data/layout.json
```

`build_db.py` hata verirse değişiklik kabul edilmez. Bu bir kural, tavsiye
değil — CI de aynı kontrolü yapıyor ve veri güncel değilse derlemeyi kırıyor.

---

## Tasarım kararları

Tam liste ve gerekçeler: [`docs/SECOND_BRAIN.md`](docs/SECOND_BRAIN.md) bölüm 29
(51 karar kaydı). Öne çıkanlar:

- **Veri elle düzenlenmez.** `movements.json` script tarafından üretilir.
  197 düğüm elle tutarlı tutulamaz.
- **Ön koşullar VE mantığıyla çalışır.** Basit kural, akıllı kuraldan iyidir.
- **Kilit açmak için bronz kademe yeterli.** Master şartı ağacı tıkar.
- **Seri haftalık, günlük değil.** Günlük seri dinlenmeyi cezalandırır ve aşırı
  antrenmanı ödüllendirir.
- **Liderlik tablosu yok.** Kalistenikte acele = sakatlık; karşılaştırma aceleyi
  teşvik eder.
- **Mobilite gerçek bir ön koşul.** Bilek mobilitesi olmadan handstand,
  ayak bileği mobilitesi olmadan pistol açılmaz.

---

## Durum

**Faz 0 — Veri temeli:** tamamlandı · 197 hareket, 0 hata
**Faz 0.5 — Planlama:** tamamlandı · [`SECOND_BRAIN.md`](docs/SECOND_BRAIN.md), 51 karar kaydı
**Faz 1 — Uygulama:** dört ekran çalışıyor, gerçek kullanım bekleniyor

Sırada: seri takibi, günlük görev üreticisi, planner'ın Bugün ekranına bağlanması.

Yol haritası: [`docs/SECOND_BRAIN.md`](docs/SECOND_BRAIN.md) bölüm 22.

---

## Lisans

MIT — bkz. [LICENSE](LICENSE).

Hareket veritabanı serbestçe kullanılabilir. Bir hatası olduğunu düşünüyorsan
issue aç; kalistenik bilgisi tek kişinin yargısıyla doğrulanmaz.
