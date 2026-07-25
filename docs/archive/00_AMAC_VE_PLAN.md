# Project Ascend — Amaç ve Plan (Proje Anayasası)

**Sürüm 1.0 · 25 Temmuz 2026**

Bu doküman projenin *neden* var olduğunu ve *neyin* yapılıp neyin
yapılmayacağını sabitler. Bir özellik tartışmasına düştüğümüzde son söz
buradadır. Teknik detay için `01_YOL_HARITASI.md`, nerede kaldığımız için
`_CHECKPOINT.txt`.

---

## 1. Amaç — tek cümle

> **Bir insanı sıfırdan elit kalistenik seviyesine taşıyan, her adımı
> görünür ve kilitli-açık mantığıyla yönetilen, yıllar boyunca kullanılabilen
> bir ilerleme sistemi kurmak.**

Bu cümlenin her parçası kasıtlı:

**"Bir insanı"** — Önce bir kişi: sen. İkinci kullanıcı Faz 4'ün konusu. Tek
kullanıcı için işe yaramayan bir sistem bin kullanıcı için de yaramaz.

**"sıfırdan elit seviyeye"** — Ne başlangıç ne de tavan kesiliyor. Wall
push-up'tan Victorian'a kadar aynı sistem içinde. Bu yüzden 196 hareket ve 11
katmanlı bir ağaç var; "başlangıç uygulaması" yapıp sonra elit sürüm
eklemeye çalışmak iki farklı ürün demekti.

**"her adımı görünür"** — İnsanın vazgeçmesinin bir numaralı nedeni
ilerlemediğini sanmak. Halbuki ilerliyordur; sadece göremiyordur. Bu sistemin
asıl işi *görünürlük*.

**"kilitli-açık mantığıyla"** — Sırayı sistem tutuyor, motivasyon değil. Kötü
bir günde "bugün ne yapsam" diye düşünmek zorunda kalmıyorsun; ağaç sıradaki
şeyi söylüyor. İyi bir günde de sıranı atlamana izin vermiyor.

**"yıllar boyunca"** — Front lever 2 yıl, planche 4 yıl sürebilir. Aylık
düşünen bir mimari bu zaman ölçeğinde çöker. Bu yüzden veri şeması ve
`id` kalıcılığı en baştan sabitlendi.

---

## 2. Kim için

| Sıra | Kullanıcı | Ne zaman |
|---|---|---|
| 1 | **Kurucu (sen)** — haftada 4 gün, power tower + zemin + ip | Faz 1'den itibaren |
| 2 | **Başlangıç seviyesi biri** — sıfırdan, rehbersiz | Faz 4 |
| 3 | **İleri sporcu** — kendi programı var, ağacı harita olarak kullanır | Faz 4 |
| 4 | **Antrenör** — birden fazla sporcuyu izler | Faz 4+ |

Sıra önemli. Vizyon dokümanları dört kitleyi eşzamanlı hedefliyordu; bu,
hiçbirine yetmeyen bir ürün üretir. Antrenör modu için gereken çok kullanıcılı
veri modeli, tek kullanıcılı sistem çalışmadan tasarlanamaz.

---

## 3. Bu proje ne DEĞİL

- **Antrenman kaydedici değil.** Set/tekrar kaydı bir araç, ürün değil. Ürün
  ilerleme haritası.
- **Program yazılımı değil.** Sana "bugün 4×8 bench" demiyor; "şu beceriyi
  açmak için şu eşiği geçmen lazım" diyor.
- **Sosyal medya değil.** Liderlik tablosu, takip, beğeni yok. Karşılaştırma
  kalistenikte en hızlı sakatlanma yolu.
- **Sağlık/tıp uygulaması değil.** Hazırlık puanı bir karar desteği, teşhis
  değil. Ağrı varsa cevap uygulamada değil.
- **Bir yıl içinde bitecek bir proje değil.** Faz 5 muhtemelen 2029'da.

---

## 4. Pazarlık edilemezler

Bunlar özellik değil, kısıt. Bir özellik bunlarla çatışırsa özellik gider.

1. **Temel atlanamaz.** Ön koşul zinciri kırılamaz. "Hızlı erişim" için
   kilit açma kısayolu eklenmez.
2. **Mobilite gerçek bir kapıdır.** Handstand `wrist-mobility` olmadan,
   pistol `ankle-mobility` olmadan açılmaz. Slogan değil, veri kısıtı.
3. **Oyunlaştırma sağlığa zarar veremez.** Günlük seri yok (dinlenmeyi
   cezalandırır). Deload seriyi kırmaz. "Bugün de yap" baskısı kurulmaz.
4. **Kalite tekrardan değerlidir.** XP her sette değil, mastery kademesi
   yükseldiğinde verilir. Sistem "daha çok yap" demez, "daha iyi yap" der.
5. **Kullanıcının verisi kullanıcınındır.** Her zaman tek tuşla dışa
   aktarılabilir. Kilitleme yok.
6. **Söylemeden önce test.** "Çalışıyor" demek için testin geçmiş olması
   gerekir. Bu dokümandaki her sayı bir simülasyondan geçti.

---

## 5. Başarı ölçütleri

**2 hafta (Faz 1 sonu):** Kağıt/telefon notu kullanmadan, iki hafta boyunca
tüm antrenmanlar bu sistemle kaydedilmiş. Ölçüt "güzel görünüyor" değil,
"başka bir şey kullanma ihtiyacı duymadım".

**5 ay (Aralık 2026 — elit temel):** Sistem kullanıldı (haftaların en az
%80'inde 4 antrenman) *ve* temel hareketlerde altın kademe civarı:
push-up 3×15, pull-up 3×10-12, dip 3×15, hollow hold 45s, aktif askı 45s,
duvar handstand 60s, ip 5 dakika kesintisiz. Bu, front lever ve muscle-up
çalışmasına *başlanabilir* eşiktir.

**3 yıl:** Muscle-up, freestanding handstand, front lever, HSPU'nun en az
üçü bronz kademede. Ve daha önemlisi: sistem hâlâ kullanılıyor.

**Projenin başarısızlığı** şu şekilde görünür: 3 ay sonra kimse açmıyor.
Bunun en olası nedeni ürünün kötü olması değil, kapsamın bitmemesi. Bu yüzden
bir sonraki bölüm var.

---

## 6. Kapsam kapısı — her fikir için 4 soru

Yeni bir fikir geldiğinde sırayla:

1. **Kurucu bunu bu ay kullanır mı?** Hayır → en az Faz 3.
2. **Mevcut veriyle yapılabilir mi?** Yeni içerik (video, lore, hareket)
   gerekiyorsa → Faz 5.
3. **Pazarlık edilemezlerden biriyle çatışıyor mu?** Evet → reddedilir.
4. **Bunun yerine yapılmayacak şey ne?** Cevap yoksa fikir henüz olgun değil.

---

## 7. Fikir havuzunun tasnifi

Vizyon dosyalarında **50'den fazla** sistem fikri var ve hepsi aynı
öncelikte yazılmış. Aşağıda hepsi tasnif edildi. Reddedilenler silinmiyor,
gerekçeleriyle duruyor.

### ✅ Zaten yapıldı (Faz 0-1)
| Fikir | Nerede |
|---|---|
| Skill Graph / Knowledge Graph / Skill Web | 196 node, 234 kenar — `movements.json` |
| Interactive Skill Map / Skill Atlas | Prototipteki zoom/pan'lı ağaç |
| Skill GPS / Reverse Skill Engine | "Bu hedefe giden yolu göster" |
| Evolution Tree | Ağacın kendisi zaten bu (soldan sağa evrim) |
| Missing Node Detector | `build_db.py` doğrulayıcısı (10 kontrol) |
| Balance Score | Hesaplanıyor, başlıkta gösteriliyor |
| Equipment Progression | Ekipman filtresi + node bazlı ekipman alanı |
| Boss Battles / Boss AI | 22 boss, HP göstergesi |
| Encyclopedia | Detay paneli (ipuçları, hatalar, kaslar, ekipman) |
| Difficulty Curve Simulator | XP/seviye simülasyonu testlerde koşuyor |

### Faz 2 — Oyun katmanı
Procedural Quest Generator · Skill Titles · Personal Records · Timeline ·
Heatmap · Movement History · Hall of Fame · Ascension Score · Global
Completion · Unknown Skills (gizli node'lar) · Patch Notes · Skill Calculator
· Build Generator (4 günlük program üretici) · Fatigue System (basit hacim
takibi)

### Faz 3 — Zeka katmanı
AI Weak Point Detector · Readiness Score · AI Progress Prediction (aralık
olarak, tek sayı değil) · Skill Radar · Skill Recommendation Engine ·
Failure Analytics · Alternative Paths · Skill Synergy · Injury Prevention
Tree · Road Generator · Future Predictor

### Faz 4 — Ölçek
Bulut senkronizasyonu · Antrenör modu · Skill Fossil System (içerik
versiyonlama — `schemaVersion` ile temeli atıldı) · Skill Certificates ·
Skill Packs · Project Brain (doküman + veri arama)

### Faz 5 — İçerik
Skill Lore / Skill Stories · Movement Combos · Replay System · Ghost Replay ·
Constellation Mode · World Tree · Character Evolution · Hall of Masters
(gerçek sporcular — izin/telif kontrolü gerekir) · Biomechanics · AI Form
Analysis (aşağıdaki uyarıyla) · Sezonlar · Ayrı Rings/Freestyle/Weighted/
Gymnastics ağaçları

### ⛔ Reddedildi — gerekçeli
| Fikir | Neden |
|---|---|
| **Prestige / New Game+** | Fiziksel gerçeklikte "sıfırla, baştan başla" anlamsız. Kazanılan güç sıfırlanmaz. Yerine: master kademesi + sezonluk hedefler. |
| **Skill Fusion** | Kalistenikte iki hareketi "birleştirip" üçüncüsünü elde etmek diye bir şey yok. Oyun mekaniğinin fiziğe zorla giydirilmesi. |
| **Endless Tree** | Sonsuz üretilen hareket = uydurulmuş hareket. Veri kalitesi ürünün temeli; uydurma hareket temeli çürütür. |
| **Genetics / Body Analysis** | Ölçüm imkanı yok, sözde-bilim riski yüksek. "Genetiğin planche'a uygun değil" demek zararlı ve kanıtsız. |
| **Inventory** | Envanterde ne duracak? Ekipman zaten node alanı. Ayrı sistem gereksiz karmaşa. |
| **Liderlik tablosu / sosyal karşılaştırma** | Pazarlık edilemez #3 ile çatışıyor. Kalistenikte acele = sakatlık. |
| **Dream Builder · AI Lab · AI Research Mode · Skill DNA · Skill Genome** | Tanımı yok. İsim var, davranış yok. Ne yapacağı bir cümleyle yazılabildiğinde tekrar değerlendirilir. |
| **Play Styles** | Ağaç zaten seçim sunuyor (hangi dalda ilerleyeceğin). Ayrı bir "stil" katmanı ikinci bir kısıt sistemi demek. |

**AI Form Analysis hakkında not:** Teknik olarak mümkün, ama bir sisteme
"formun doğru" dedirtmek sakatlık riski taşır ve bugünün video modelleri
kalistenik formunda güvenilir değil. Faz 5'e, yalnızca "şuna bak" tarzı
işaretleme yapan, onay vermeyen bir araç olarak konuldu.

---

## 8. Varsayılan olarak verilen kararlar

Bunları sana sormak yerine gerekçesiyle karara bağladım. Katılmadığın birini
söylersen değiştiririz; söylemezsen bunlar geçerli.

| # | Karar | Gerekçe |
|---|---|---|
| 1 | **Platform: web (TypeScript + React), yerel-öncelikli, sunucusuz** | Aynı kod telefonda ve masaüstünde çalışır; iterasyon en hızlı; maliyet sıfır. Mobil uygulama gerektiğinde aynı koddan paketlenir (Capacitor). |
| 2 | **Bulut senkronizasyonu Faz 4** | Tek cihazda çalışmayan şeyi iki cihaza yaymanın anlamı yok. Faz 1'de veri kaybına karşı dışa aktarma zorunlu. |
| 3 | **Antrenör modu Faz 4** | Çok kullanıcılı veri modeli, tek kullanıcılı model oturmadan tasarlanamaz. |
| 4 | **Arayüz Türkçe, hareket adları İngilizce** | "Ön kaldıraç" kimseye bir şey anlatmıyor; kalistenik terminolojisi uluslararası. |
| 5 | **Kilit açmak için bronz yeterli** | Master şartı ağacı tıkar ve insanı tek harekette aylarca tutar. Yetersiz temelle ilerleme riski Faz 3'teki zayıf halka tespitiyle yakalanacak. |
| 6 | **Mastery doğrulaması: 14 gün içinde 2 ayrı seans** | Tek seferlik iyi gün mastery sayılmaz; tesadüf ile kazanım ayrılmalı. |
| 7 | **Seri haftalık, günlük değil** | Günlük seri dinlenmeyi cezalandırır. Sağlık gerekçeli, pazarlık dışı. |

---

## 9. Plan — özet

| Faz | Ne | Bitti ölçütü | Durum |
|---|---|---|---|
| **0 · Veri** | 196 hareket, ön koşul grafı, XP/mastery sayıları, doğrulayıcı | 0 hata 0 uyarı | ✅ Bitti |
| **1 · MVP** | Skill tree, kayıt, XP/seviye, offline, dışa aktarma | 2 hafta gerçek kullanım | 🔨 Prototip çalışıyor |
| **2 · Oyun** | Görevler, unvanlar, istatistik, program üretici, zaman çizelgesi | "Tracker" değil "oyun" gibi hissettiriyor | ⏳ |
| **3 · Zeka** | Zayıf halka, hazırlık puanı, öneri motoru, tahmin | Öneriler kendi kararlarınla %80 örtüşüyor | ⏳ |
| **4 · Ölçek** | Bulut, çoklu cihaz, mobil paket, antrenör modu | İkinci kullanıcı sıfır destekle kullanıyor | ⏳ |
| **5 · İçerik** | Medya, lore, ayrı ağaçlar, sezonlar | — | ⏳ |

Detaylı mimari, formüller ve karar günlüğü: `01_YOL_HARITASI.md`.

---

## 10. Çalışma anlaşması

- **`_CHECKPOINT.txt` her oturum sonunda güncellenir.** Bir sonraki oturum
  (sen ya da başka bir AI) sadece o dosyayı okuyup devam edebilir.
- **Tek doğruluk kaynağı `data/movements.json`.** Eski `PROJECT_ASCEND_*.txt`
  dosyaları arşiv; niyeti anlatır, spesifikasyon değildir.
- **JSON elle düzenlenmez.** `build/movements_data.py` düzenlenir,
  `build_db.py` çalıştırılır. 0 hata vermezse değişiklik kabul edilmez.
- **Hareket `id`'leri kalıcıdır.** İsim değişebilir, id değişmez — tüm
  ilerleme kayıtları id'ye bağlı.
- **Test geçmeden "bitti" denmez.** `build/test_prototype.js` şu an 61 test
  koşuyor; yeni mekanik yeni test demektir.

---

## 11. Şu an nerede duruyoruz

Bugün üretilen:

- **196 hareketlik doğrulanmış ağaç** — 22 boss, 23 başlangıç node'u,
  11 katman derinlik, 234 bağlantı, 0 hata
- **Sayısallaştırılmış oyun mekanikleri** — XP, seviye, mastery, denge puanı,
  boss HP; hepsi simülasyonla doğrulandı
- **Çalışan prototip** — gerçek veriyle, tarayıcıda açılan tek dosya
- **61 otomatik test** — hepsi geçiyor; biri gerçek bir formül hatası
  yakaladı (denge puanı) ve düzeltildi

Sıradaki iş prototipe bakıp **ağacın kendisini eleştirmek**: yanlış
sıralanmış ön koşul, eksik ara adım, gereksiz kapı. Veri düzeltilmesi en
ucuz bu aşamada; üzerine kod bindikten sonra pahalılaşır.
