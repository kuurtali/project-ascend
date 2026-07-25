# Project Ascend

> Kalistenik öğrenmenin haritası — her hareketin bir beceri düğümü olduğu,
> ön koşullarını tamamlamadan ilerleyemediğin, RPG mantığında bir gelişim sistemi.

**Bu bir antrenman kaydedici değil.** Kaydediciler geçmişi tutar; bu sistem
sıradaki adımı gösterir.

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
| **196 hareket** | Ön koşul grafı ile bağlanmış, 234 bağlantı, 11 katman derinlik |
| **22 boss** | Muscle-Up, Front Lever, Planche, Human Flag, Iron Cross… |
| **12 kategori** | Push, Pull, Core, Legs, Balance, Mobility, Elite… |
| **11 otomatik kontrol** | Kırık referans, döngü, yetim düğüm, erişilemez boss, ekipman kaskadı |
| **Doğrulama** | 0 hata, 0 uyarı |
| **61 test** | Oyun mekaniklerinin tamamı, hepsi geçiyor |

```
196 hareket · 22 boss · 23 başlangıç düğümü · 49 aksesuar
234 bağlantı · maksimum derinlik 11 · toplam kazanılabilir XP 525.480
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
│   ├── movements.json       ← TEK DOĞRULUK KAYNAĞI (196 hareket)
│   └── validation_report.txt
├── tools/
│   ├── movements_data.py    ← elle düzenlenen kaynak veri
│   ├── build_db.py          ← genişletici + doğrulayıcı
│   ├── make_layout.py       ← ağaç yerleşimi
│   └── test_prototype.js    ← 61 fonksiyonel test
└── prototype/
    └── index.html           ← mekanikleri doğrulamak için tek dosya prototip
```

### `prototype/` hakkında dürüst not

Bu bir ürün değil, **deneme tahtası.** Oyun kurallarının gerçekten çalışıp
çalışmadığını görmek için yazıldı ve işini gördü: içindeki denge puanı
formülünün yanlış olduğunu ortaya çıkardı. Gerçek uygulama ayrı yazılacak.

---

## Nasıl çalıştırılır

**Prototipi görmek için:** `prototype/index.html` dosyasını tarayıcıda aç.
Kurulum yok, sunucu yok.

**Veriyi yeniden üretmek için:**

```bash
cd tools
python3 build_db.py        # movements.json + doğrulama raporu — 0 hata vermeli
python3 make_layout.py     # ağaç yerleşimi
node test_prototype.js     # 61 test — hepsi geçmeli
```

`build_db.py` hata verirse değişiklik kabul edilmez. Bu bir kural, tavsiye değil.

---

## Tasarım kararları

Tam liste ve gerekçeler: [`docs/SECOND_BRAIN.md`](docs/SECOND_BRAIN.md) bölüm 29
(40 karar kaydı). Öne çıkanlar:

- **Veri elle düzenlenmez.** `movements.json` script tarafından üretilir.
  196 düğüm elle tutarlı tutulamaz.
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

**Faz 0 — Veri temeli:** tamamlandı
**Faz 0.5 — Planlama:** devam ediyor
**Faz 1 — Uygulama:** planlama bitince başlar

Yol haritası: [`docs/SECOND_BRAIN.md`](docs/SECOND_BRAIN.md) bölüm 22.

---

## Lisans

MIT — bkz. [LICENSE](LICENSE).

Hareket veritabanı serbestçe kullanılabilir. Bir hatası olduğunu düşünüyorsan
issue aç; kalistenik bilgisi tek kişinin yargısıyla doğrulanmaz.
