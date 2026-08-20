# PROJECT ASCEND — SECOND BRAIN

**Projenin kurumsal hafızası · Sürüm 2.0 · 25 Temmuz 2026**

> *"Sadece bir fitness uygulaması yapma. Kalistenik öğrenmenin işletim
> sistemini yap — yıllarca büyüyebilecek bir sistem."*
> — MASTER_PROMPT, kapanış cümlesi

---

## v2.0'da ne değişti

v1.0 bir denetimden geçti: 9 kaynak dosyadan çıkarılan 67 kavram belgeye
karşı tarandı. **14'ü eksikti.** Sebep bilgi kaybı değil, **ikame**:
kurucunun yazdığı çerçeve okunmuş ama yerine yenisi konmuştu.

| Düzeltilen | Ne oldu |
|---|---|
| Kurucunun 8 proje ilkesi | Geri kondu, kendi First Principles'a eşlendi (`03`) |
| Ranks | Titles'tan ayrı sistem olarak eklendi (`18.12`) |
| Localization / Accessibility Ready | Mimari kontrol listesine eklendi (`16`) |
| Knowledge XP | Eklendi (`18.13`) |
| Custom Trees | Eklendi (`26`, Faz 5) |
| Marketplace | Eklendi (`23`) |
| "Operating system for learning" çerçevesi | Vizyona kondu (`01`) |
| **Charter tamamen yanlıştı** | Gerçek kullanıcı profiliyle yeniden yazıldı (`06`) |

Ayrıca **5 yeni sistem** tasarlandı (v1.0'da hiç yoktu ve en büyük
boşluklardı): Seans Nesnesi · Aktif Kadro · Node İçi İlerleme ·
Comeback Modeli · Yerleştirme. Hepsi `18`'de.

Ve **bir veri hatası düzeltildi**: `shoulder-mobility` yalnızca direnç
bandına bağlıydı; bantsız kullanıcı için 39 node ve 8 boss sessizce
erişilemez oluyordu. Doğrulayıcıya "ekipman kaskadı" kontrolü eklendi.
Kurucunun ekipmanıyla erişim **%72 → %93**'e çıktı.

---

## Bu dosya nedir

Bu dosyanın tek bir hedefi var:

> **Bir AI'a veya geliştiriciye sadece bu dosyayı verip "Project Ascend'i
> geliştirmeye devam et" demen yeterli olsun.** Hiç konuşmamış olsa bile
> projenin neden var olduğunu, nasıl düşündüğümüzü, hangi kararları neden
> aldığımızı ve gelecekte nasıl geliştirmesi gerektiğini anlayabilsin.

Bu bir özet değil. Fikirler burada madde işareti olarak listelenmez;
her konu **neden var olduğu, hangi kurallara tabi olduğu, nelere bağlı
olduğu, hangi sistemlerle ilişkili olduğu, nasıl gelişeceği ve neyin hâlâ
cevaplanmadığı** ile birlikte yazılır.

### Sıralama kuralı

**Önce plan biter, sonra uygulama başlar.** Bu dosya planın kendisidir.
Kod yazmaya bu dosya tamamlanmadan geçilmez. (Bu kural bir kez ihlal
edildi — bkz. `29_DecisionHistory`, D-019.)

### Belge durumu etiketleri

Her bölümde fikirlerin yanında şu etiketler kullanılır:

| Etiket | Anlamı |
|---|---|
| **[KESİN]** | Karara bağlandı. Değiştirmek için `29_DecisionHistory`'ye yeni kayıt gerekir. |
| **[TASARIM]** | Tanımı yapıldı, henüz uygulanmadı. |
| **[BRAINSTORM]** | Fikir aşamasında. Henüz taahhüt değil. |
| **[TODO]** | Yapılması gereken somut iş. |
| **[RESEARCH]** | Cevabı bilinmiyor, araştırma gerekiyor. |
| **[RED]** | Reddedildi. Gerekçesiyle duruyor, silinmez. |

---

## İçindekiler

### 📖 PART 1 — FOUNDATION (Temel)
| # | Bölüm | Soru |
|---|---|---|
| 01 | [Vision](#01_vision) | Nereye gidiyoruz? |
| 02 | [Mission](#02_mission) | Bunun için ne yapıyoruz? |
| 03 | [First Principles](#03_first_principles) | Hangi temel doğrulardan türetiyoruz? |
| 04 | [Constitution](#04_constitution) | Hangi kurallar değişmez? |
| 05 | [Manifesto](#05_manifesto) | Neye inanıyoruz? |
| 06 | [Charter](#06_charter) | Kim için, hangi yetkiyle? |
| 07 | [Non Goals](#07_nongoals) | Ne YAPMIYORUZ? |
| 08 | [Philosophy](#08_philosophy) | Nasıl düşünüyoruz? |

### 🏗️ PART 2 — ARCHITECTURE
| # | Bölüm | Soru |
|---|---|---|
| 09 | [Skill Tree Theory](#09_skilltreetheory) | Ağaç nasıl kurulur? |
| 10 | [Movement Database](#10_movementdatabase) | Veri nasıl saklanır? |
| 11 | [Skill Genome](#11_skillgenome) | Hareketler nasıl karşılaştırılır? |
| 12 | [Knowledge Graph](#12_knowledgegraph) | Bilgi nasıl bağlanır? |
| 13 | [AI Architecture](#13_aiarchitecture) | AI nereye takılır? |
| 16 | [Architecture](#16_architecture) | Sistem katmanları neler? |
| 17 | [Database](#17_database) | Kayıt modeli nasıl? |

### 🌳 PART 3 — CALISTHENICS BIBLE
| # | Bölüm | Soru |
|---|---|---|
| 19 | [Skill Trees](#19_skilltrees) | Hangi dallar var? |
| 20 | [Movement List](#20_movementlist) | Tam hareket listesi |

### 🎮 PART 4 — GAME DESIGN
| # | Bölüm | Soru |
|---|---|---|
| 18 | [Game Systems](#18_gamesystems) | Oyun mekanikleri nasıl çalışır? |

### 🤖 PART 5 — AI
| # | Bölüm | Soru |
|---|---|---|
| 14 | [AI Council](#14_aicouncil) | AI hangi rollerde çalışır? |
| 15 | [Governance](#15_governance) | Değişiklikler nasıl denetlenir? |
| 21 | [Research](#21_research) | Bilgi nasıl doğrulanır? |

### 📈 PART 6 — PRODUCT
| # | Bölüm | Soru |
|---|---|---|
| 22 | [Roadmap](#22_roadmap) | Hangi sırayla? |
| 23 | [Business](#23_business) | Para/sürdürülebilirlik? |
| 24 | [GitHub](#24_github) | Kod nasıl yönetilir? |
| 25 | [Documentation](#25_documentation) | Doküman nasıl yaşar? |
| 26 | [Backlog](#26_backlog) | Sıradaki işler |

### 🧠 PART 7 — BRAIN
| # | Bölüm | Soru |
|---|---|---|
| 27 | [Idea Vault](#27_ideavault) | Tüm fikirler ve tasnifi |
| 28 | [Timeline](#28_timeline) | Ne zaman ne oldu/olacak? |
| 29 | [Decision History](#29_decisionhistory) | Hangi karar neden alındı? |
| 30 | [Open Questions](#30_openquestions) | Neyi bilmiyoruz? |
| 31 | [Future Vision](#31_futurevision) | 10 yıl sonra? |

---
---

# 📖 PART 1 — FOUNDATION

---

<a name="01_vision"></a>
# 01 · VISION

## Vizyon cümlesi **[KESİN]**

> **Bir insanı sıfırdan elit kalistenik seviyesine taşıyan, her adımı
> görünür ve kilitli-açık mantığıyla yönetilen, on yıllarca yaşayabilen
> bir ilerleme sistemi.**

Kurucunun kendi ifadesiyle, daha kısası:

> **"Kalistenik öğrenmenin işletim sistemi."**
> *(MASTER_PROMPT: "Build an operating system for learning calisthenics
> that can grow for years.")*

Ve tek cümlelik konumlandırma:

> **"Duolingo dil öğrenmeyi nasıl oyunlaştırdıysa, biz de kalistenik
> öğrenmeyi oyunlaştırıyoruz. Kullanıcı kas değil, skill geliştiriyor."**

Bu cümle çerçeveyi doğru kuruyor: ürün bir egzersiz listesi değil, bir
**progression engine.** Duolingo benzetmesinin işlevsel tarafı da var —
Duolingo sana kelime listesi vermez, sıradaki dersi verir. Ascend de
hareket listesi vermez, **sıradaki 4 slotu** verir (`18.12`).

Bu benzetme iyi çünkü işletim sisteminin ne yaptığını doğru anlatıyor:
kendisi bir uygulama değildir, **üzerinde her şeyin çalıştığı zemindir.**
Ascend de antrenman yaptırmaz; antrenmanın üzerinde durduğu yapıyı verir.

## Neden?

Kalistenikte insanların bıraktığı nokta neredeyse hiçbir zaman "yeteneğim
yok" değildir. Üç şeyden biridir:

1. **Sırayı bilmemek.** Planche istiyor, pseudo planche push-up'ı hiç
   duymamış. Doğrudan denemeye kalkıyor, olmuyor, "bende olmuyor" diyor.
2. **İlerlediğini görememek.** 8 haftada push-up'ı 12'den 16'ya çıkarmış.
   Bu ciddi bir gelişme. Ama hiçbir yerde yazılı değil, o yüzden
   hissedilmiyor.
3. **Ölçek körlüğü.** Front lever 2 yıllık bir iş. Bunu bilmeyen insan
   3. ayda "hâlâ yapamıyorum" diye bırakıyor. Halbuki tam programında.

Bu üç sorunun tamamı **bilgi ve görünürlük** sorunudur, antrenman sorunu
değil. Ascend bu üçünü çözmek için var.

## Kurallar

- Vizyon cümlesi değiştirilemez. Genişletilebilir, daraltılamaz.
- Her özellik bu cümlenin bir parçasına hizmet etmek zorundadır.
  Hizmet ettiği parça söylenemiyorsa özellik gereksizdir.
- "Sıfırdan elit" ifadesi tavanı da tabanı da kapsar. Sadece başlangıç
  veya sadece elit hedefleyen bir sürüm üretilmez.

## Bağlantılar

- `02_Mission` — vizyonu eyleme çeviren şey
- `07_NonGoals` — vizyonun dışında kalanlar
- `31_FutureVision` — vizyonun 10 yıllık uzantısı

## İlgili Sistemler

Skill Tree (görünürlük), Unlock Engine (sıra), Timeline (ölçek algısı).

## Gelecekteki Geliştirmeler

- **[BRAINSTORM]** Vizyonun "bir insanı" kısmı ileride "bir topluluğu"
  olabilir. Ama bu Faz 4'ten önce tartışılmaz.

## Açık Sorular

- **[RESEARCH]** "Elit" ne demek, ölçülebilir tanımı ne? Şu anki çalışma
  tanımı: `20_MovementList`'teki 22 boss'un en az 5'i bronz kademede.
  Bu tanım keyfi; daha iyi bir tanım aranıyor.

---

<a name="02_mission"></a>
# 02 · MISSION

## Misyon **[KESİN]**

> Her hareketi bir **skill node**'a çeviren, node'ları ön koşul zinciriyle
> bağlayan, ilerlemeyi XP-mastery-seviye ile ölçen ve bunu bir oyun gibi
> hissettiren bir sistem inşa etmek.

## Neden?

Vizyon "ne olacak"ı söyler, misyon "nasıl"ı söyler. Buradaki "nasıl"ın
özü tek bir dönüşümdür:

```
Antrenman kaydı                    Skill node
─────────────                      ──────────
"Bugün 3×12 push-up yaptım"   →   "Standard Push-up: Gümüş (12/15 Altın'a)"
Geçmişe bakar                      Geleceği gösterir
Ne yaptığını söyler                Ne yapabileceğini söyler
Biriktirir                         Kilidi açar
```

Bu dönüşüm projenin tamamıdır. Geri kalan her şey bunun sonucudur.

## Kurallar

- **Her hareket bir node'dur.** İstisna yok. Mobilite rutini de node,
  ip atlama da node, uyku protokolü de node.
- **Her node ölçülebilir olmalı.** Ölçülemeyen bir şey node olamaz.
  Ölçü birimi 5 türden biri: `reps`, `reps_side`, `hold`, `count`, `dist`.
- **Her node bir yere bağlanır.** Yetim node yasaktır (bkz. `15_Governance`,
  No Orphan Rule).
- **Hiçbir ileri hareket ön koşulları olmadan açılmaz.**

## Bağlantılar

- `09_SkillTreeTheory` — node'ların nasıl bağlandığı
- `18_GameSystems` — XP/mastery/seviye mekanikleri
- `10_MovementDatabase` — node'ların saklanma biçimi

## İlgili Sistemler

Unlock Engine, XP Engine, Mastery Engine.

## Gelecekteki Geliştirmeler

- **[TASARIM]** Node'lara "progress test" alanı: mastery hedefi var ama
  "nasıl ölçülür" protokolü henüz yok. Örn. hold süresi hangi form
  kriteriyle sayılır?

## Açık Sorular

- **[RESEARCH]** Ölçülemeyen ama önemli şeyler var mı? Örnek: "handstand'de
  rahat hissetmek". Bunu node yapamıyoruz. Kaybediyor muyuz?

---

<a name="03_first_principles"></a>
# 03 · FIRST PRINCIPLES

## Önce: kurucunun 8 proje ilkesi **[KESİN]**

Bunlar `MASTER_PROMPT.txt`'te yazılı ve **projenin kendi ilkeleridir.**
Aşağıdaki First Principles bunların türevi, yerine geçen şey değil.

| İlke | Ne demek | Nerede uygulanıyor |
|---|---|---|
| **Beginner First** | Sistem önce yeni başlayana hizmet eder. İleri özellik, başlangıç deneyimini bozamaz | 23 kök node, yerleştirme (`18.16`), ekipman filtresi |
| **Mastery Before Difficulty** | Zorluğu artırmadan önce mevcut hareketi ustalaş | Node içi ilerleme (`18.14`) — zorluk atlamadan önce tempo/duraklama |
| **Visible Progress** | İlerleme her zaman görünür olmalı | Skill tree, mastery kademeleri, XP, Ascension Score |
| **Quality Before Quantity** | Kalite tekrardan değerli | XP her sette değil kademede verilir (`M-4`) |
| **Consistency Wins** | İstikrar yoğunluktan değerli | Haftalık seri (`M-3`), Consistency ekseni (`18.8`) |
| **Science Before Ego** | Kanıt egodan önce gelir | `21_Research` — kaynaksız sayı `[RESEARCH]` etiketli |
| **Expand Forever** | Veritabanı asla tamamlanmış sayılmaz | `10` üretim zinciri, doğrulayıcı, Custom Trees (`26`) |
| **Game First** | Oyun hissi bir süs değil, ana tasarım kısıtı | `18_GameSystems`'in tamamı |

**Kural:** Bu 8 ilke ile aşağıdaki 9 First Principle çelişirse **8 ilke
kazanır.** Aşağıdakiler bunları açıklamak için var.

---

## Temel doğrular **[KESİN]**

Bu proje aşağıdaki 9 önermeden türetilmiştir. Bir tasarım kararı
tartışmalıysa cevap bunlardan birindedir.

### FP-1 · Vücut tek bir sistemdir, bağımsız kaslar toplamı değil
Planche'ı omuz gücü yapmaz; omuz + kürek kontrolü + core + bilek + doğru
ağırlık aktarımı yapar. Bu yüzden bir hareketin ön koşulları farklı
kategorilerden gelebilir (`full-planche` ← `straddle-planche`, ama
`freestanding-handstand` ← `wrist-mobility` + `wall-handstand` + `headstand`).

### FP-2 · Adaptasyon zamanla olur, iradeyle olmaz
Tendon kastan yavaş uyum sağlar. Bu yüzden "daha çok istemek" ilerlemeyi
hızlandırmaz, sakatlanmayı hızlandırır. Sistemin görevi frenlemektir,
hızlandırmak değil.

### FP-3 · Ölçülmeyen şey yönetilemez
Bir insanın "güçlendim" hissi güvenilmezdir. 14 haftalık kayıt güvenilirdir.
Bu yüzden her node ölçülebilir.

### FP-4 · Görünür ilerleme motivasyonun kendisidir
Motivasyon bir kişilik özelliği değil, geri bildirim döngüsünün sonucudur.
İlerleme görünürse motivasyon üretilir; görünmezse tükenir.

### FP-5 · Sıra bilgisi, çabadan değerlidir
Yanlış sırada 6 ay çalışan biri, doğru sırada 3 ay çalışandan geride
kalır. Ascend'in sattığı şey çaba değil, sıra.

### FP-6 · Basit kural, akıllı kuraldan iyidir
"Tüm ön koşullar bronz olmalı" (AND) kuralı, karmaşık bir puanlama
sisteminden daha iyidir: tahmin edilebilir, açıklanabilir, hata ayıklanabilir.

### FP-7 · Veri koddan uzun yaşar
Arayüz 5 kez baştan yazılacak. Hareket veritabanı aynı kalacak. Bu yüzden
veri şeması ve `id` kalıcılığı en kritik tasarım kararıdır.

### FP-8 · Bir kişi için çalışmayan şey bin kişi için de çalışmaz
Ölçeklenme, çalışan bir şeyin çoğaltılmasıdır. Çalışmayan bir şeyin
çoğaltılması değil.

### FP-9 · Kapsam, yetenekten daha sık öldürür
Bu projenin en olası ölüm nedeni teknik zorluk değil, hiçbir şeyin
bitmemesidir. Bu yüzden `07_NonGoals` ve `15_Governance` var.

## Bağlantılar

- `04_Constitution` — bu ilkelerin kural haline gelmiş biçimi
- `29_DecisionHistory` — her kararın hangi FP'den türediği

## Açık Sorular

- **[RESEARCH]** FP-2 ile oyunlaştırma arasında yapısal bir gerilim var:
  oyun "daha çok oyna" der, fizyoloji "dinlen" der. Şu anki çözüm haftalık
  seri ve deload node'ları. Yeterli mi bilinmiyor.

---

<a name="04_constitution"></a>
# 04 · CONSTITUTION

## Anayasa **[KESİN]**

Aşağıdaki 8 madde **pazarlık edilemez**. Bir özellik bunlarla çatışırsa
özellik gider, madde kalmaz.

### M-1 · Temel atlanamaz
Ön koşul zinciri kırılamaz. "Hızlı erişim", "deneyimli kullanıcı modu",
"kilitleri aç" gibi kısayollar eklenmez. *Kaynak: FP-5*

### M-2 · Mobilite gerçek bir kapıdır
`wrist-mobility` olmadan handstand, `ankle-mobility` olmadan pistol,
`shoulder-mobility` olmadan back lever açılmaz. Bu bir tavsiye değil,
veri kısıtıdır. *Kaynak: FP-1*

### M-3 · Oyunlaştırma sağlığa zarar veremez
Günlük seri yok. Deload seriyi kırmaz. "Bugün de yap" baskısı kurulmaz.
Aşırı antrenman ödüllendirilmez. *Kaynak: FP-2*

### M-4 · Kalite tekrardan değerlidir
XP her sette değil, mastery kademesi yükseldiğinde verilir. Sistem
"daha çok yap" demez, "daha iyi yap" der. *Kaynak: FP-2, FP-3*

### M-5 · Karşılaştırma yoktur
Liderlik tablosu, takipçi, beğeni, başkasının ilerlemesi görünmez.
Karşılaştırma aceleyi, acele sakatlığı üretir. *Kaynak: FP-2*

### M-6 · Kullanıcının verisi kullanıcınındır
Her zaman tek tuşla dışa aktarılabilir, standart bir formatta.
Veri kilitleme yoktur. *Kaynak: FP-7*

### M-7 · Tek doğruluk kaynağı vardır
Hareket verisi tek yerde tutulur (`data/movements.json`). Çelişen ikinci
bir kaynak oluşursa biri arşive kaldırılır. *Kaynak: FP-7*

### M-8 · Söylemeden önce test
"Çalışıyor" demek için testin geçmiş olması gerekir. Doğrulanmamış sayı
belgeye yazılmaz. *Kaynak: FP-3*

## Anayasa değişikliği

Bir maddeyi değiştirmek için:
1. Hangi First Principle'ın yanlış olduğu gösterilmeli
2. `29_DecisionHistory`'ye gerekçeli kayıt girilmeli
3. Etkilenen tüm bölümler güncellenmeli

Madde silinmez, "yürürlükten kaldırıldı" olarak işaretlenir.

## Bağlantılar

- `03_First_Principles` — maddelerin kaynağı
- `15_Governance` — maddelerin nasıl denetlendiği
- `07_NonGoals` — maddelerin doğal sonuçları

## Açık Sorular

- **[RESEARCH]** M-5 mutlak mı? "Kendi 6 ay önceki halinle karşılaştırma"
  sosyal karşılaştırma değil ve motive edici. Şu an izinli sayılıyor.
  Sınır nerede?

---

<a name="05_manifesto"></a>
# 05 · MANIFESTO

## Neye inanıyoruz **[KESİN]**

**Biz antrenman kaydedici yapmıyoruz.**
Kaydedici geçmişi tutar. Biz geleceği gösteriyoruz.

**Biz program satmıyoruz.**
Program 12 haftada biter. Ağaç 10 yıl sürer.

**Biz motivasyon satmıyoruz.**
Motivasyon bir duygu değil, geri bildirimin sonucudur. Biz geri bildirim
kuruyoruz; motivasyon kendiliğinden gelir.

**Biz acele ettirmiyoruz.**
Kalistenikte acelenin bedeli sakatlıktır ve sakatlık aylar kaybettirir.
Sistemin frenlemesi, hızlandırmasından değerlidir.

**Biz kimseyi kimseyle karşılaştırmıyoruz.**
Senin rakibin 6 ay önceki halin. Başkasının front lever'ı senin işine
yaramaz.

**Biz "yapamazsın" demiyoruz.**
"Henüz sıra sende değil" diyoruz. İkisi çok farklı şeydir. Birincisi
kapatır, ikincisi yol gösterir.

**Biz kısa yol satmıyoruz.**
Kısa yol yok. Doğru yol var, ve doğru yol kısa yollardan hızlıdır.

**Biz veriyi ciddiye alıyoruz.**
196 hareketin ön koşul zinciri elle uydurulmuş bir liste değil,
doğrulanmış bir graf. Uydurma hareket eklenmez.

**Biz bitirmeye inanıyoruz.**
50 yarım özellik, 5 tam özellikten kötüdür. Fikir üretmek kolay,
reddetmek zordur. Biz reddetmeyi de işin parçası sayıyoruz.

## Bağlantılar

- `04_Constitution` — manifestonun kural hali
- `27_IdeaVault` — reddedilen fikirler ve gerekçeleri

---

<a name="06_charter"></a>
# 06 · CHARTER

> **v2.0 NOTU:** Bu bölüm tamamen yeniden yazıldı. v1.0'daki kurucu
> profili yanlıştı — "haftada 4 gün antrenman yapan, 5 ayda elit temele
> ulaşacak kişi" varsayılmıştı. Gerçek profil farklı ve bu, hedefleri,
> yerleştirmeyi ve ikinci kullanıcı tanımını değiştiriyor.

## Projenin iki amacı **[KESİN]**

Bu proje **tek amaçlı değil.** İkisi de gerçek ve ikisi birbirini
destekliyor:

### Amaç 1 — Kişisel araç
Kurucunun kendi antrenmanını yöneteceği sistem. Birincil ve vazgeçilmez.
Kullanılmayan bir sistem portfolyo olarak da değersizdir.

### Amaç 2 — Açık geliştirme
Proje herkese açık geliştirilir. Kararlar, gerekçeler ve çıkmaz sokaklar
dahil her şey görünür.

Bu bir vitrin kaygısı değil, bir **disiplin aracı.** Görünür yazılan şey
daha dikkatli yazılır; belgelenmemiş bir karar, alınmamış karardır
(`25_Documentation`).

### Bunun tasarıma yansıması **[KESİN]**

| Karar | Neden |
|---|---|
| **Bitmişlik > teknik gösteriş** | Yarım kalmış karmaşık proje, biten sade projeden kötüdür |
| **Belgeleme birinci sınıf çıktı** | Bu dosya kodun kendisi kadar değerli. Ayırt edici olan mühendislik hacmi değil, **düşünme disiplini** |
| **Veri/modelleme katmanı öne çıkar** | 196 düğümlük graf, XP eğrileri, denge puanı, ilerleme modellemesi — projenin asıl işi burada, arayüz kodunda değil |
| **Repo okunabilir olmalı** | README, temiz commit geçmişi, testler, lisans. Bunlar "ürünün parçası" |
| **Basit ve tanıdık stack** | Egzotik teknoloji seçimi kimseyi etkilemez, bakımı zorlaştırır |

## Kim için, hangi sırayla **[KESİN]**

| Sıra | Kullanıcı | Tanım | Ne zaman |
|---|---|---|---|
| 1 | **Kurucu** | Antrenman geçmişi var, **ara vermiş**, yeniden başlıyor | Faz 1 |
| 2 | **"Benim gibi insanlar"** | Geçmişi olan ama ara vermiş, doğru şekilde yeniden başlamak isteyen | Faz 2-3 |
| 3 | **Mutlak başlangıç** | Hiç geçmiş yok, rehbersiz | Faz 4 |
| 4 | **İleri sporcu** | Kendi programı var, ağacı harita olarak kullanır | Faz 4 |
| 5 | **Antrenör** | Birden fazla sporcuyu izler | Faz 4+ |

**v2.0'daki en önemli değişiklik burada.** v1.0 ikinci kullanıcıyı
"mutlak başlangıç" diye tanımlamıştı ve Faz 4'e atmıştı. Gerçek ikinci
kullanıcı çok daha spesifik: **ara vermiş ve yeniden başlayan kişi.**

Bu iyi haber, çünkü:
- Kurucuyla **aynı** kullanıcı → tek kişi için yapılan şey ikisine de yarar
- Daha net bir problem: "sıfırdan nasıl başlanır" değil, **"nereden devam edilir"**
- Ve bu, sistemin cevabı olmayan bir soru: `18.16 Yerleştirme` ve
  `18.15 Comeback Modeli` bu yüzden eklendi

## Birincil kullanıcı profili **[KESİN]**

> **Kişisel veri bu dosyada tutulmaz.** Kurucunun ölçüleri, sağlık
> kısıtları ve kimlik bilgileri depo dışındaki yerel bir profil dosyasında
> durur. Burada yalnızca **tasarımı etkileyen kategoriler** yazar.
>
> *Gerekçe: `D-014` — içerik ve kullanıcı verisi asla karışmaz. Bir
> sistemin tasarım dokümanı, o sistemi kullanan kişinin sağlık kaydını
> içermemeli.*

```
Antrenman geçmişi : VAR — ama ara verilmiş, şu an formda değil
Başlangıç noktası : ağacın en solu değil; "yeniden giriş" noktası
Ekipman           : power tower (barfiks + dip), zemin, duvar, ip, sehpa
                    -> ağacın %93'ü (182/196 düğüm, 17/22 boss) erişilebilir
                    -> erişilemeyen 5 boss halka/parallettes gerektiriyor
Uzun vadeli hedef : Handstand, HSPU, Muscle-Up, Front Lever, Back Lever,
                    Planche, Human Flag, One Arm Push-up, One Arm Pull-up
Teknik durum      : kod yazmıyor — yönlendiriyor, kodu AI yazıyor
```

**Fiziksel değişkenlerin tasarıma yansıması [TASARIM]:**

Sistem üç değişkeni **kategori olarak** modeller, mutlak sayı olarak değil:

| Değişken | Sistem için anlamı |
|---|---|
| **Yaş** | Genç kullanıcıda toparlanma hızlı, tendon uyumu iyi → sıklık üst sınırı yüksek tutulabilir |
| **Boy** | Uzun kol/bacak = uzun kaldıraç. Statik tutuşlar (front lever, planche) fizik gereği daha zor. Engel değil, **takvim** meselesi |
| **Vücut ağırlığı** | Kalistenikte her tekrar vücut ağırlığını kaldırmak demek. Çekme hareketlerinde en çok hissedilir |

**Kural [KESİN]:** Sistem **kilo hedefi koymaz, kilo takibi yapmaz.**
Ölçtüğümüz şey performans. Antrenman ilerledikçe kuvvet/ağırlık oranı
zaten iyileşir; hangi yoldan iyileştiği sistemin işi değil.

*Gerekçe:* Bu bir spor ilerleme sistemi, kilo uygulaması değil
(`07_NonGoals`). Ayrıca kilo hedefi koymak `M-5`'in ruhuna aykırı —
rakamla kendini yargılatma mekanizması kurmuyoruz.

**Not:** Statik elit becerilerin (planche, front lever) uzun sürmesi
kilodan çok **kaldıraç fiziğinden** kaynaklanır ve bu herkes için
geçerlidir. Muscle-up, handstand, HSPU, dip, pistol normal bir yapıyla
tamamen ulaşılabilir.

## ⭐ Kullanıcı Kısıtları (Contraindications) **[TASARIM]** — v2.1'de eklendi

### Neden bu sistem gerekli

Kalistenikte **el, yük taşıyan ana yapıdır** ve handstand uzun vadeli
hedeflerden biri. El, bilek, omuz, dirsek, diz veya belde geçmiş
sakatlığı olan bir kullanıcı için "hangi hareket riskli" sorusu gerçek
bir sorudur ve sistemin cevabı olması gerekir.

Bu, tek bir kullanıcının ihtiyacından çıktı ama **genel bir sistem
özelliği** oldu — `06_Charter`'daki "benim gibi insanlar" ilkesinin somut
örneği.

> Kurucunun kendi kısıtları depo dışındaki yerel profil dosyasında
> tutulur. Sağlık verisi tasarım dokümanına yazılmaz.

### Örnek: el/bilek kısıtı olan kullanıcı

| Risk | Hareketler | Neden |
|---|---|---|
| 🔴 **Yüksek** | Knuckle Push-up, Finger Push-up, Fingertip Push-up | Yük doğrudan metakarp başlarına biner |
| 🟠 **Orta** | Handstand zinciri (wall walk → freestanding → one arm) | Tüm vücut ağırlığı avuç içinden geçer, ulnar tarafa yüklenme yüksek |
| 🟠 **Orta** | Planche zinciri (lean, tuck, straddle) | Bilek ekstansiyonu + el yükü maksimum |
| 🟡 **Düşük** | Fingertip Hang, Towel Hang | Kavrama yükü, ama kapalı el |
| 🟢 **Güvenli alternatif** | Parallettes / dip barı üzerinde aynı hareketler | Nötr kavrama, yük avuç içine değil el boyunca dağılır |

**Önemli tasarım sonucu:** Böyle bir kullanıcı için parallettes "isteğe
bağlı ekipman" değil, **erişilebilirlik ekipmanı.** Handstand ve L-sit
çalışmasını el için çok daha güvenli hale getiriyor. Ekipman
önerilerinde bu ayrım yapılmalı.

### Sistem gereksinimi **[TASARIM]**

Kullanıcı profilinde bir **kısıt listesi** olmalı:

```
constraints: [
  { area: "wrist" | "hand" | "shoulder" | "elbow" | "knee" | "lowBack",
    side: "left" | "right" | "both",
    type: "hardware" | "history" | "chronic",
    flaggedMovements: [...],       // kırmızı işaretli hareketler
    preferredAlternatives: [...],  // güvenli varyantlar
    clearedByProfessional: false } // SAĞLIK PROFESYONELİ ONAYI VAR MI
]
```

**Not:** `clearedByProfessional: true` kısıtın kaldırıldığı anlamına
gelmez, sadece ilgili zincirlerin **açılabildiği** anlamına gelir. Yüksek
riskli hareketler onaydan bağımsız olarak listede kalmaya devam eder —
çünkü aynı kazanımı daha güvenli bir yoldan elde etmek mümkünse, riskli
yol gereksizdir.

### Kurallar **[KESİN]**

1. **Sistem hareketi yasaklamaz, işaretler.** Karar kullanıcınındır.
   Kırmızı işaretli hareket açılabilir ama uyarı gösterilir.
2. **`clearedByProfessional: false` iken** el yükü taşıyan zincirlerde
   sistem hacmi otomatik yükseltmez ve "doktoruna danış" notunu gösterir.
3. **Sistem teşhis koymaz, tedavi önermez.** *Kaynak: `07_NonGoals`,
   `21_Research` K-4.*
4. Kısıtlar `18.17 Yerleştirme` sırasında sorulur.

**[TODO]** 196 hareketin `handLoad` (el yükü) seviyesi etiketlenmeli:
`none` / `low` / `moderate` / `high`. Bu, herhangi bir el-bilek kısıtı
olan tüm kullanıcılar için otomatik filtreleme sağlar — sadece kurucu
için değil.

*Bu, "benim gibi insanlar" ilkesinin (`06_Charter`) somut bir örneği:
tek kişinin kısıtı, genel bir sistem özelliğine dönüşüyor.*

---

**"Ara vermiş" olmanın tasarım sonuçları:**

1. **Sıfırdan başlamıyor.** Wall push-up'tan başlatmak hem yanlış hem
   moral bozucu. Yerleştirme mekanizması gerekli (`18.16`).
2. **Geri kazanım, ilk kazanımdan hızlıdır.** Kas hafızası gerçek bir
   olgudur. Sistem bunu modellemezse ilk 6-8 hafta boyunca sürekli
   "beklenenden hızlı" ilerleme olur ve eşikler anlamsızlaşır (`18.15`).
3. **En riskli dönem ilk ay.** Sinir sistemi eski seviyeyi "hatırlar" ama
   tendon ve eklem hatırlamaz. Eski performansa hızlı dönüş = sakatlık.
   Sistemin frenlemesi gereken tek yer burası. *Kaynak: FP-2*

## Başarı ölçütleri **[KESİN]**

> v1.0'daki 5 aylık hedefler (3×15 push-up, 3×10-12 pull-up) sabit
> sayılardı ve "ara vermiş" profiline uymuyordu. Artık **göreli** hedefler
> kullanılıyor: başlangıç noktası yerleştirme ile ölçülür, hedef ona göre
> belirlenir.

### 2 hafta — Faz 1 sonu
Kâğıt/telefon notu kullanmadan, iki hafta boyunca tüm antrenmanlar bu
sistemle kaydedilmiş. Ölçüt "güzel görünüyor" değil, **"başka bir şey
kullanma ihtiyacı duymadım"**.

### 5 ay — Aralık 2026
Üç ölçüt birden:

| Ölçüt | Hedef |
|---|---|
| **Kullanım** | Haftaların en az %80'inde haftalık hedef tutulmuş |
| **Geri kazanım** | Yerleştirme seviyesinin üstüne çıkılmış, en az 3 kategoride kademe atlanmış |
| **Yeni toprak** | Ara vermeden önce yapılamayan **en az bir** hareket kazanılmış |

Üçüncüsü en önemlisi: "eski halime döndüm" bir hedef değil, başlangıç
çizgisi. **Yeni bir şey kazanmak** projenin işe yaradığının kanıtı.

### Portfolyo ölçütü — Şubat 2027
- Repo public, README'si bir yabancının 2 dakikada anlayacağı netlikte
- Uygulama çalışır durumda ve erişilebilir (canlı link)
- Bu belge okunabilir halde — projenin düşünce süreci görünüyor
- **Kurucu projeyi 5 dakikada anlatabiliyor** (mülakat testi)

### 3 yıl
Muscle-Up, Freestanding Handstand, Front Lever, HSPU'nun en az üçü bronz
kademede. Ve daha önemlisi: sistem hâlâ kullanılıyor.

## Başarısızlık tanımı

Proje şöyle başarısız olur: **3 ay sonra kimse açmıyor.** En olası nedeni
ürünün kötü olması değil, hiçbir şeyin bitmemesidir. *Kaynak: FP-9*

Portfolyo açısından ikinci bir başarısızlık biçimi var: **etkileyici ama
bitmemiş.** 40 özellik başlatılıp hiçbiri tamamlanmamış bir repo, 6
özelliği tam çalışan bir repodan kötü sinyal verir.

## Bağlantılar

- `22_Roadmap` — fazların bitti ölçütleri
- `07_NonGoals` — kapsam dışı

---

<a name="07_nongoals"></a>
# 07 · NON GOALS

## Bu proje ne DEĞİL **[KESİN]**

Bu bölüm projenin en değerli bölümüdür. Bir projeyi ne yaptığı değil,
ne yapmadığı bitirir. *Kaynak: FP-9*

### Antrenman kaydedici değil
Set/tekrar kaydı bir **araç**, ürün değil. Ürün ilerleme haritası.
Kayıt özelliği sadece mastery'yi besleyen bir girdi olarak vardır.

### Program yazılımı değil
Sistem "bugün 4×8 şunu yap" demez. "Şu beceriyi açmak için şu eşiği
geçmen lazım" der. Program üretici (Faz 2) bile bir *öneri* katmanıdır,
zorunlu bir takvim değil.

### Sosyal ağ değil
Liderlik tablosu, takip, beğeni, paylaşım, arkadaş listesi yok.
*Kaynak: M-5*

### Sağlık/tıp uygulaması değil
Hazırlık puanı bir karar desteğidir, teşhis değil. Ağrı varsa cevap
uygulamada değil. Sakatlık teşhisi, rehabilitasyon protokolü,
beslenme planı kapsam dışı.

### Beslenme uygulaması değil
Kalori, makro, öğün takibi yok. Kalistenik ilerlemesi için beslenme
önemlidir ama bu ayrı bir üründür ve iyi yapılmış alternatifleri var.

### Ağırlık antrenmanı platformu değil
Weighted calisthenics (yelek/kemer) destekleniyor — ekipman olarak.
Ama barbell/dumbbell programlama kapsam dışı.

### Video platformu değil
Faz 5'te medya gelecek, ama içerik üretim/barındırma altyapısı kurmuyoruz.
Harici video bağlantısı yeterli.

### Bir yılda bitecek bir proje değil
Faz 5 muhtemelen 2029'da. Bu bir kusur değil, tasarım kararı.
*Kaynak: FP-7*

## Kapsam kapısı — her fikir için 4 soru **[KESİN]**

Yeni bir fikir geldiğinde sırayla:

1. **Kurucu bunu bu ay kullanır mı?** Hayır → en az Faz 3.
2. **Mevcut veriyle yapılabilir mi?** Yeni içerik (video, lore, hareket)
   gerekiyorsa → Faz 5.
3. **Anayasa maddeleriyle çatışıyor mu?** Evet → reddedilir.
4. **Bunun yerine yapılmayacak şey ne?** Cevap yoksa fikir olgun değil.

Dördüncü soru en önemlisi. Kapasitenin sabit olduğunu kabul etmeyen bir
öncelik listesi öncelik listesi değildir.

## Bağlantılar

- `27_IdeaVault` — 60+ fikrin tam tasnifi ve red gerekçeleri
- `15_Governance` — Feature Gravity, Delete Test

## Açık Sorular

- **[RESEARCH]** Beslenme gerçekten kapsam dışı mı? İlerlemenin en büyük
  engeli bazen yetersiz beslenmedir. Bir "uyarı" seviyesinde bile olmasın mı?

---

<a name="08_philosophy"></a>
# 08 · PHILOSOPHY

## Nasıl düşünüyoruz

### Ağaç bir kısıt sistemidir, bir menü değil
Skill tree'nin işi seçenek sunmak değil, **seçenekleri azaltmak**. 196
hareketin hepsi teoride yapılabilir; sistemin değeri bugün yapılabilir
olan 6 tanesini göstermesindedir.

### Kilit bir ceza değil, bir cevaptır
"Front Lever kilitli" cümlesi "yapamazsın" demiyor. "Şu 15 şeyi
tamamlamadan bu olmaz, ve şu an 3'ünde eksiğin var" diyor. Kilit,
sorunun cevabıdır.

### Yavaşlık bir özelliktir
Bir hareketi bronzdan altına çıkarmak haftalar sürüyorsa bu sistemin
hatası değil, gerçeğin kendisidir. Sistemin işi bu gerçeği gizlemek
değil, ölçeklenmiş halde göstermek.

### Bilgi, iradeden ucuzdur
"Daha disiplinli ol" pahalı bir tavsiye. "Sıradaki hareketin şu" bedava
ve daha etkili. Ascend disiplin satmıyor, bilgi satıyor.

### Belge de üründür
Bu dosya bir yan çıktı değil. Projenin kurumsal hafızası; kod kaybolsa
bile buradan yeniden inşa edilebilir. *Kaynak: FP-7*

### Reddetmek üretmektir
Bir fikri gerekçesiyle reddetmek, yarım yapmaktan değerlidir. `27_IdeaVault`
bu yüzden red gerekçelerini saklıyor — aynı fikir 6 ay sonra tekrar
gelmesin diye.

## Karar prensipleri **[KESİN]**

Bunlar tekrarlanan karar kalıplarıdır. Vizyon notlarında isimleri geçiyordu;
burada tanımları yapılıyor.

| Prensip | Tanım | Nasıl uygulanır |
|---|---|---|
| **Lighthouse Principle** | Bir karar verilirken en uzun vadeli kullanıcı (10 yıl sonra hâlâ kullanan) referans alınır | "Bu, 10 yıl kullanacak birine ne yapar?" |
| **Rule of Regret** | İki seçenek arasında kalınca "hangisini yapmamış olmaktan pişman olurum" sorulur | Pişmanlığı büyük olan yapılır |
| **Delete Test** | Bir özellik silinse kullanıcı fark eder mi? | Fark etmiyorsa silinir |
| **10 Year Test** | Bu karar 10 yıl sonra hâlâ mantıklı mı? | Hayırsa geçici çözüm olarak işaretlenir |
| **Old Developer Test** | 2 yıl sonra bu kodu/veriyi gören biri anlar mı? | Anlamıyorsa belgelenir |
| **Feature Gravity** | Her özellik kendine bakım, hata, doküman çeker | Yeni özellik = kalıcı maliyet |
| **First Principles Check** | Bir tartışma çözülmezse `03_First_Principles`'a inilir | Türetilemiyorsa fikir zayıftır |
| **Tree Integrity** | Ağaç her değişiklikten sonra doğrulanır | `build_db.py` 0 hata vermeli |
| **No Orphan Rule** | Hiçbir node bağlantısız kalamaz | Yaprak olacaksa `ACCESSORY` işaretlenir |
| **Canon Review** | Yeni bilgi eklenirken mevcut belgeyle çelişip çelişmediği kontrol edilir | Çelişki varsa biri güncellenir |
| **Single Source of Truth** | Aynı bilgi iki yerde tutulmaz | Kopya varsa biri arşive |

## Bağlantılar

- `15_Governance` — bu prensiplerin denetim mekanizması
- `29_DecisionHistory` — prensiplerin uygulandığı kararlar

## Açık Sorular

- **[RESEARCH]** Delete Test'i kim uygular? Kurucu kendi özelliğini
  silmekte objektif olamaz. Faz 3'te AI Red Team rolüne verilebilir
  (bkz. `14_AICouncil`).

---
---

# 🏗️ PART 2 — ARCHITECTURE

---

<a name="09_skilltreetheory"></a>
# 09 · SKILL TREE THEORY

## Ağaç nedir **[KESİN]**

Ascend'in "skill tree"si teknik olarak **ağaç değil, yönlü çevrimsiz graf
(DAG — Directed Acyclic Graph)**. Bu ayrım önemli:

```
AĞAÇ                              DAG (bizim yapımız)
────                              ───────────────────
Her node'un 1 ebeveyni var        Bir node'un N ön koşulu olabilir
Dallar birleşmez                  Dallar birleşir
Front Lever ← Straddle FL         Front Lever ← Straddle FL
                                  Handstand ← Wall HS + Shoulder Tap
                                              + Wrist Mobility + Headstand
```

Neden DAG: FP-1 (vücut tek sistemdir). Bir beceri birden fazla yetkinliğin
kesişiminde durur. Tek ebeveynli ağaç bu gerçeği modelleyemez.

## Kurallar **[KESİN]**

### K-1 · Ön koşullar AND mantığıyla çalışır
Tüm ön koşullar sağlanmalı, biri yetmez. OR gerekirse ara node açılır.
*Gerekçe: FP-6 — basit kural, akıllı kuraldan iyidir.*

### K-2 · Kilit açmak için bronz yeterlidir
Ön koşulun bronz kademesine ulaşmak alt node'u açar. Gold/master
gerekmiyor. *Gerekçe: master şartı ağacı tıkar, insanı tek harekette
aylarca tutar. Bronz "yapabiliyorum", master "tükettim" demek.*

### K-3 · Döngü yasaktır
A → B → A imkânsız. `build_db.py` Kahn algoritmasıyla kontrol eder.

### K-4 · Tier monotonluğu
Bir hareketin ön koşulu kendisinden zor olamaz (`tier(ön koşul) ≤ tier(node)`).
Doğrulayıcı ihlalde uyarır.

### K-5 · No Orphan Rule
Hiçbir node bağlantısız kalamaz. İki istisna:
- **Kök node** (tier ≤ 1, ön koşulu yok) — 23 tane
- **Aksesuar node** (`isAccessory`) — bilinçli yaprak, 49 tane

Bu ikisi dışında yaprak node bir veri eksikliğidir.

### K-6 · Her boss erişilebilir olmalı
Her boss node'undan en az bir kök node'a giden yol bulunmalı.
Doğrulanmış: 22 boss'un tamamı erişilebilir, sadece bronz kademelerle
ilerleyerek 196 node'un tamamı 5 iterasyonda açılıyor.

## Yerleşim (görsel model) **[KESİN]**

```
x ekseni (soldan sağa)  = graf derinliği (depth)
                          depth = köke olan EN UZUN mesafe
y ekseni (yukarıdan aşağı) = kategori bandı
```

Derinlik "en uzun mesafe" olarak hesaplanır, en kısa değil. Neden: bir
hareket 2 farklı yoldan erişilebiliyorsa, gerçek zorluğu uzun yolun
belirlediği yerdedir.

Ölçüler: 12 kategori bandı, maksimum derinlik 11, tuval 2720×3314 px.

## Bağlantılar

- `10_MovementDatabase` — grafın saklanma biçimi
- `11_SkillGenome` — node'lar arası isim dışı benzerlik
- `18_GameSystems` — mastery kademeleri ve XP

## İlgili Sistemler

Unlock Engine, layout hesaplayıcı (`make_layout.py`), doğrulayıcı (`build_db.py`).

## Gelecekteki Geliştirmeler

- **[TASARIM]** Alternative Paths: aynı hedefe giden farklı yollar
  (örn. Muscle-Up'a bar veya ring üzerinden). Şu an tek zincir modelliyor.
- **[BRAINSTORM]** Skill Web görünümü: ağaç yerine örümcek ağı. Aynı veriden
  farklı bir görselleştirme, veri değişikliği gerekmiyor.

## Açık Sorular

- **[RESEARCH]** K-2 (bronz yeterli) yetersiz temelle ilerlemeye izin
  veriyor. Faz 3'te zayıf halka tespiti bunu yakalayacak — ama yakalamak
  yeterli mi, yoksa bazı kritik geçişlerde gold şartı mı gerekli?
  Aday: front-lever ve planche zincirleri.

---

<a name="10_movementdatabase"></a>
# 10 · MOVEMENT DATABASE

## Tek doğruluk kaynağı **[KESİN]**

```
data/movements.json     ← TEK KAYNAK (196 hareket, 238 KB)
```

Eski `PROJECT_ASCEND_*.txt` dosyaları **arşivdir**. Niyeti anlatır,
spesifikasyon değildir. İki hareket listesi (`Master_Movement_List` ve
`V2_Master_Movement_Database`) birbiriyle çelişiyordu; bu yüzden
`07_NonGoals`/M-7 kuralı kondu.

## Üretim zinciri **[KESİN]**

JSON **elle düzenlenmez.** 196 node elle tutarlı tutulamaz.

```
build/movements_data.py      ← ELLE DÜZENLENEN YER (her hareket 1 tuple)
        │
        ▼  python3 build_db.py
data/movements.json          ← üretilen tam şema + doğrulama raporu
        │
        ▼  python3 make_layout.py
build/ascend_data.js         ← kompakt + yerleşim koordinatlı (64 KB)
```

`build_db.py` 0 hata vermezse değişiklik kabul edilmez. *Kaynak: M-8*

## Şema **[KESİN]**

| Alan | Tip | Not |
|---|---|---|
| `id` | slug | **KALICI KİMLİK — asla değişmez.** Tüm ilerleme kayıtları buna bağlı |
| `name` | string | İngilizce hareket adı |
| `category` | enum | 12 kategoriden biri |
| `tier` | 0-9 | Zorluk |
| `isBoss` | bool | 22 tane |
| `isAccessory` | bool | Bilinçli yaprak, 49 tane |
| `measure.type` | enum | `reps` / `reps_side` / `hold` / `count` / `dist` |
| `measure.unit` | string | tekrar / tekrar-taraf / saniye / adet / metre |
| `measure.sets` | int | Önerilen set sayısı (hold/count/dist için 1) |
| `equipment[]` | enum[] | 11 ekipmandan |
| `prerequisites[]` | id[] | AND mantığı |
| `unlocks[]` | id[] | **TÜRETİLMİŞ** — prerequisites'in tersi |
| `mastery` | obj | bronze/silver/gold/master → `{target, sets, xp}` |
| `xp` | obj | `{base, total}` |
| `muscles[]` | string[] | Çalışan bölgeler |
| `family` | string | İpucu/hata metinlerinin kaynağı (26 aile) |
| `tips[]` | string[] | Aileden gelen koçlama ipuçları |
| `commonMistakes[]` | string[] | Aileden gelen sık hatalar |
| `media` | obj | `{icon, video, animation}` — hepsi şu an `null` |
| `lore` | string\|null | Hareket hikayesi — şu an `null` |
| `depth` | int | **TÜRETİLMİŞ** — köke en uzun mesafe |

Dosya kökünde ayrıca: `categories`, `equipment`, `masteryTiers`,
`masteryXpMultipliers`, `levelCurve` (1-100), `stats`, `schemaVersion`.

## Doğrulama — 10 otomatik kontrol **[KESİN]**

1. Kırık ön koşul referansı
2. Döngü (Kahn algoritması)
3. Derinlik hesabı
4. Tier monotonluğu
5. Yetim node (tier > 1 ama ön koşul yok)
6. Yaprak node (boss veya aksesuar değilse uyar)
7. Aksesuar listesi tutarlılığı (aksesuar işaretli ama bir şey açıyor mu)
8. Her boss'un kök node'dan erişilebilirliği
9. Ekipman ve kategori geçerliliği
10. Mastery eşiklerinin artan olması

**Mevcut durum: 0 hata, 0 uyarı.**

## İstatistikler

```
196 hareket · 22 boss · 23 kök node · 49 aksesuar
234 bağlantı · maksimum derinlik 11 · maksimum tier 9
Toplam kazanılabilir XP: 525.480
```

| Kategori | Hareket |
|---|---|
| Push | 25 |
| Vertical Push | 12 |
| Explosive | 8 |
| Dips | 10 |
| Pull | 43 |
| Core | 25 |
| Legs | 20 |
| Balance | 16 |
| Mobility | 11 |
| Conditioning | 11 |
| Elite | 11 |
| Recovery | 4 |

## Bağlantılar

- `09_SkillTreeTheory` — graf kuralları
- `17_Database` — kullanıcı kaydı (ayrı tutulur)
- `20_MovementList` — tam liste

## Gelecekteki Geliştirmeler

- **[TODO]** `media` alanları boş (196 hareket × ikon/video) → Faz 5
- **[TODO]** `lore` alanları boş → Faz 5
- **[TODO]** `progressTest` alanı yok: mastery hedefi var ama "nasıl
  ölçülür" protokolü tanımlı değil
- **[TASARIM]** `genome` alanı eklenecek (bkz. `11_SkillGenome`)
- **[TODO]** Rings / Parallettes / Street Workout / Freestyle / Weighted /
  Gymnastics ağaçları şu an ayrı kategori değil, mevcut ağaçlara ekipman
  etiketiyle dağıtılmış. Vizyon dosyaları ayrı ağaç istiyordu → Faz 5'te
  ayrılabilir

## Açık Sorular

- **[RESEARCH]** İpuçları aile bazında (26 aile). Hareket-özel incelik
  kayboluyor. Hareket bazlı override alanı gerekli mi, gerekliyse hangi
  hareketler için?
- **[RESEARCH]** Mastery eşikleri (örn. push-up bronz 5, master 25) tek
  kişinin yargısıyla belirlendi. Doğrulama kaynağı ne olacak?

---

<a name="11_skillgenome"></a>
# 11 · SKILL GENOME

## Fikir **[TASARIM]**

Bu, vizyon notlarındaki en güçlü fikir ve tek bir veri eklemesiyle
**beş ayrı sistemi** birden mümkün kılıyor.

Her hareketin bir **öznitelik vektörü** (genom) olur: o hareketin hangi
yetkinlikleri ne oranda gerektirdiği.

```
Full Planche · genom
─────────────────────────────
straight_arm_strength   95
scapular_control        92
core_extension          88
shoulder_load           90
wrist_load              85
balance                 60
grip                    30
bent_arm_strength       15
vertical_pull            0
leg_strength             0
```

## Neden?

Şu anda sistem hareketleri **sadece isim ve ön koşul zinciriyle** biliyor.
Yani "Front Lever ile Planche birbirine benziyor mu?" sorusunu
cevaplayamıyor — çünkü graf onları farklı dallara koymuş.

Genom bunu çözer. Ve çözdüğü anda şu beş fikir birden uygulanabilir hale
gelir:

| Fikir | Genomla nasıl çalışır |
|---|---|
| **Skill Radar** | Hedefin genomu vs kullanıcının tahmini yetkinlik profili → eksik öznitelikler |
| **Weak Point Detector** | Kullanıcının en düşük öznitelikleri = zayıf halka |
| **Skill Synergy** | İki hareketin genom kesişimi yüksekse biri diğerini besliyor |
| **Recommendation Engine** | "Bunu yapanlar bunları da öğrendi" → genom komşuluğu |
| **Failure Analytics** | Bir hedefte tıkanan kullanıcıların ortak düşük özniteliği |

Beş fikir, bir veri eklemesi. Bu yüzden Faz 3'ün merkezinde bu var.

## Öznitelik listesi **[TASARIM]**

18 öznitelik, her biri 0-100:

**Güç ekseni**
`bent_arm_strength` · `straight_arm_strength` · `vertical_push` ·
`horizontal_push` · `vertical_pull` · `horizontal_pull`

**Kontrol ekseni**
`scapular_control` · `core_compression` · `core_extension` · `balance`

**Kapasite ekseni**
`grip` · `wrist_load` · `shoulder_load` · `explosiveness` · `endurance`

**Hareketlilik ekseni**
`shoulder_mobility` · `hip_mobility` · `unilateral`

## Kurallar **[TASARIM]**

1. **Genom ön koşulu değiştirmez.** Kilit mantığı graf üzerinden çalışmaya
   devam eder. Genom bir *öneri ve teşhis* katmanıdır.
   *Gerekçe: FP-6 — kilit mantığı basit ve tahmin edilebilir kalmalı.*
2. **Kullanıcının yetkinlik profili türetilir, sorulmaz.**
   `kullanıcı_özniteliği_i = max(genom_i × mastery_oranı)` ustalaşılan
   hareketler üzerinden.
3. **Benzerlik kosinüs benzerliğidir.**
   `benzerlik(A,B) = cos(genom_A, genom_B)`
4. **Genom elle yazılır, üretilmez.** 196 × 18 = 3528 değer. Aile bazında
   şablon + hareket bazında düzeltme ile yazılır.

## Örnek: eksik halka tespiti

```
Hedef: Freestanding Handstand
─────────────────────────────
Gereken            Sende      Durum
balance      85      40       ✗ EKSİK  (en büyük fark)
wrist_load   80      75       ~ sınırda
scapular     70      72       ✓
core_ext     65      68       ✓
shoulder     60      70       ✓

Öneri: balance özniteliğini besleyen ve şu an ACIK olan node'lar:
       Frog Stand, Crow Pose, Tripod Headstand
```

Bu çıktı, vizyon notlarındaki Skill Radar'ın tam olarak istediği şey.

## Bağlantılar

- `10_MovementDatabase` — `genome` alanı eklenecek
- `13_AIArchitecture` — CoachEngine bunu kullanır
- `12_KnowledgeGraph` — genom benzerliği graf kenarı üretir

## Gelecekteki Geliştirmeler

- **[BRAINSTORM]** Genom benzerliğinden **otomatik ön koşul önerisi**:
  "Bu iki hareket %83 benziyor ama graf'ta bağlantısız — bağlantı eksik mi?"
  Bu, No Orphan Rule'un akıllı versiyonu olur.

## Açık Sorular

- **[RESEARCH]** 18 öznitelik doğru sayı mı? Çok azsa ayrım yapamaz,
  çok fazlaysa elle yazılamaz ve gürültülü olur.
- **[RESEARCH]** Öznitelik değerleri neye göre atanacak? Biyomekanik
  literatür mü, koç yargısı mı, ikisinin karışımı mı? Şu an plan: koç
  yargısı + aile şablonu, sonra veriyle düzeltme.
- **[RESEARCH]** Kullanıcı profili türetmesi (`max` kuralı) fazla iyimser
  olabilir. Bir kez gold yaptığı hareketin özniteliğini kalıcı sayıyor.
  Zamanla azalma (decay) gerekli mi?

---

<a name="12_knowledgegraph"></a>
# 12 · KNOWLEDGE GRAPH

## Fikir **[TASARIM]**

Skill graph hareketleri **ön koşul** ilişkisiyle bağlar. Knowledge graph
aynı hareketleri **çok tipli** ilişkilerle bağlar:

| İlişki tipi | Anlamı | Kaynak |
|---|---|---|
| `requires` | Ön koşul | `prerequisites[]` — mevcut |
| `unlocks` | Açtığı node | türetilmiş — mevcut |
| `regression_of` | Kolaylaştırılmış hali | **[TODO]** eksik |
| `variation_of` | Aynı zorlukta varyasyon | **[TODO]** eksik |
| `similar_to` | Genom benzerliği > 0.8 | `11_SkillGenome`'dan türetilir |
| `antagonist_of` | Karşıt hareket (push↔pull dengesi) | **[TODO]** eksik |
| `works` | Çalıştırdığı öznitelik | `genome`'dan türetilir |
| `needs_equipment` | Ekipman | `equipment[]` — mevcut |
| `common_mistake` | Sık hata | `commonMistakes[]` — mevcut |

## Neden?

Şu anki graf tek tipli: sadece "gerekir". Bu, şu soruları
cevaplayamıyor demek:

- "Bu hareketi yapamıyorum, kolayı ne?" → `regression_of` gerekli
- "Sıkıldım, aynı zorlukta alternatifi ne?" → `variation_of` gerekli
- "Push çok yaptım, dengelemek için ne?" → `antagonist_of` gerekli

Bu üçü eksik ve hepsi kullanıcının gerçekten sorduğu sorular.

## Kurallar **[TASARIM]**

1. İlişkiler **tek yönlü tanımlanır, ters yönü türetilir.**
   (`regression_of` yazılır, `progression_of` üretilir.)
2. Türetilebilen ilişki elle yazılmaz. *Kaynak: Single Source of Truth*
3. Knowledge graph ön koşul mantığını **etkilemez.** Sadece keşif ve
   öneri katmanı.

## Bağlantılar

- `11_SkillGenome` — `similar_to` ve `works` ilişkilerinin kaynağı
- `09_SkillTreeTheory` — `requires`/`unlocks` zaten burada

## Gelecekteki Geliştirmeler

- **[BRAINSTORM]** Skill Web görünümü: bir node'a tıklayınca tüm ilişki
  tiplerinin aynı anda görüldüğü örümcek ağı.

## Açık Sorular

- **[RESEARCH]** `regression_of` ile `prerequisites` arasındaki fark
  bulanık. Knee Push-up, Standard Push-up'ın hem ön koşulu hem
  regresyonu. İkisi aynı şey mi, değilse sınır nerede?

---

<a name="13_aiarchitecture"></a>
# 13 · AI ARCHITECTURE

## AI nereye takılır **[TASARIM]**

AI bu projede **iki ayrı yerde** var ve karıştırılmamalı:

### 1. Geliştirme zamanı AI (bugün aktif)
Projeyi inşa eden AI. Kod yazar, veri üretir, doküman tutar, denetler.
Kullanıcı kod yazmadığı için **bu birincil geliştirme aracıdır.**
Rolleri `14_AICouncil`'da tanımlı.

### 2. Çalışma zamanı AI (Faz 3)
Uygulamanın içindeki koç. Öneri verir, zayıf halka bulur, tahmin yapar.

Bu ayrım kritik: geliştirme zamanı AI'ın gücü ürüne bağımlılık yaratmaz.
Çalışma zamanı AI ise bir ürün özelliğidir ve maliyeti/güvenilirliği
tartışılmalıdır.

## Çalışma zamanı AI — katman tasarımı **[TASARIM]**

```
CoachEngine (saf TypeScript, LLM YOK)
├── WeakPointDetector    genom farkı → eksik öznitelik
├── NextStepRecommender   açık node'lar + zayıf halka → sıradaki 3 iş
├── ReadinessScorer       uyku/ağrı/tazelik/moral → 0-100
├── ProgressPredictor     mastery hızı → tahmini tarih ARALIĞI
└── BalanceScorer         kategori dağılımı → 0-100
```

**Kritik karar [KESİN]:** Faz 3'ün tamamı **LLM olmadan** yapılır.
Yukarıdaki beş modülün hepsi deterministik hesaplama.

*Gerekçe:*
- LLM her çağrıda para ve gecikme demek; offline çalışmaz (M-6 ile gerilim)
- Aynı girdiye farklı cevap veren bir koç güven kaybettirir
- Bu beş şey zaten matematikle çözülebiliyor; LLM'e ihtiyaç yok

LLM sadece **açıklama üretiminde** kullanılabilir (Faz 4+): hesabı sistem
yapar, LLM cümleye çevirir. Karar LLM'e bırakılmaz.

## Kurallar **[KESİN]**

1. **AI karar vermez, öneri verir.** Kilit mantığı deterministiktir.
2. **AI tahminleri aralık olarak sunulur.** "18 gün sonra HSPU" değil,
   "bu tempoyla 3-6 hafta". *Gerekçe: yanlış tek sayı motivasyon kırar.*
3. **AI form onayı vermez.** Bkz. `27_IdeaVault`, AI Form Analysis notu.
4. **AI hareket uydurmaz.** Yeni hareket ekleme insan onayından geçer.

## Bağlantılar

- `11_SkillGenome` — CoachEngine'in girdi verisi
- `14_AICouncil` — geliştirme zamanı AI rolleri
- `16_Architecture` — motor katmanının yeri

## Açık Sorular

- **[RESEARCH]** ProgressPredictor ne kadar veriyle anlamlı olur?
  4 haftalık kayıtla tahmin gürültülü olur. Minimum veri eşiği ne?

---

<a name="16_architecture"></a>
# 16 · ARCHITECTURE

## Platform kararı **[KESİN]**

**Web öncelikli, yerel-öncelikli (local-first), sunucusuz.**

| Katman | Seçim | Gerekçe |
|---|---|---|
| Dil | TypeScript | 196 node'lu grafta tip hatası en sık hata kaynağı |
| UI | React + Vite | Geniş ekosistem, hızlı yeniden derleme |
| Stil | Tailwind CSS | Tema kategori renklerinden beslenir |
| Graf | SVG + kendi yerleşim kodumuz | Hazır graf kütüphaneleri katmanlı skill tree için fazla genel |
| İçerik verisi | Statik `movements.json` | Sunucu gerekmez, sürümlenebilir, offline |
| Kullanıcı kaydı | IndexedDB (Dexie.js) | Offline, büyük kota, spor salonunda internet gerekmez |
| Dağıtım | Statik hosting | Ücretsiz, bakım yok |
| Mobil | Sonradan Capacitor | Aynı koddan mağazaya çıkar |

**Neden native değil:** Native'in tek gerçek avantajı bildirim ve mağaza
dağıtımı; ikisi de Faz 1 sorusu değil. Web ile aynı kod hem telefonda hem
masaüstünde çalışır ve iterasyon 5-10 kat hızlı. Kodu AI yazdığı için
iterasyon hızı en değerli kaynak (bkz. `06_Charter`).

**Neden backend yok:** Tek kullanıcı için sunucu + veritabanı + kimlik
doğrulama + aylık maliyet demek. Senkronizasyon Faz 4'te, gerçekten
birden fazla cihaz olduğunda.

### v2.0 · App Store kararı netleşti **[KESİN]**

Kurucu App Store'u "şimdilik sadece fikir" olarak tanımladı. Bu, en büyük
mimari çatalı **kapatıyor**:

- ❌ React Native / Expo ile başlamak — gereksiz karmaşa
- ✅ Web, tek platform, tam odak

Mobil gerekirse yol açık: aynı koddan Capacitor ile paketlenir. Ama bu
karar **bugün alınmıyor** ve bugünkü hiçbir seçimi kısıtlamıyor.

*Gerekçe:* Portfolyo hedefi (bkz. `06_Charter`) **bitmişliği** ödüllendiriyor.
İki platformu birden hedeflemek bitirme olasılığını düşürür.

### v2.0 · Portfolyo gereksinimleri **[KESİN]**

Kod artık sadece araç değil, **vitrinin parçası** (`06_Charter`, Amaç 2).
Bunun somut karşılığı:

| Gereksinim | Neden |
|---|---|
| `README.md` — 2 dakikada anlaşılır | Repoya bakan ilk şeyi görür |
| Canlı demo linki | Çalışmayan proje portfolyo değil |
| Motor katmanı için birim testleri | "Test yazıyor" sinyali + gerçek fayda |
| Anlamlı commit geçmişi | Süreç görünür olur |
| Lisans dosyası | Profesyonellik işareti |
| Ekran görüntüleri / GIF | Kimse kurup denemez |

**Not:** Bu liste `07_NonGoals`'a tabidir — portfolyo için özellik
eklenmez. Sadece var olanın **görünür ve anlaşılır** olması sağlanır.

---

## Mimari kontrol listesi **[KESİN]**

> `MISSING_SYSTEMS_AUDIT.txt`'te yazılıydı; v1.0'da son iki madde
> atlanmıştı. Geri kondu.

| Madde | Durum | Nasıl |
|---|---|---|
| **Modular** | ✅ | Motor / UI / veri katmanları ayrı |
| **Data Driven** | ✅ | Hiçbir hareket ağacı kodda gömülü değil |
| **Expandable** | ✅ | Yeni node = bir satır veri |
| **Versioned** | ✅ | `schemaVersion`, veri ve uygulama ayrı sürümlenir |
| **Offline Friendly** | ✅ | IndexedDB, sunucu yok |
| **Cloud Ready** | 🔨 | Kayıt katmanı soyut; Faz 4'te arkasına senkron takılır |
| **AI Ready** | 🔨 | `genome` alanı ve CoachEngine arayüzü planlandı |
| **Localization Ready** | ⏳ **[TODO]** | Aşağıya bak |
| **Accessibility Ready** | ⏳ **[TODO]** | Aşağıya bak |

### Localization Ready **[TASARIM]**

Şu an arayüz Türkçe, hareket adları İngilizce (`D-011`). Ama metinler
koda gömülü olursa ikinci dil imkânsızlaşır.

**Kural [KESİN]:** Arayüz metni koda **gömülmez**, anahtar üzerinden
çağrılır.

```
t("mastery.bronze")  →  "Bronz"
```

`movements.json` tarafında: `name` İngilizce kalır (uluslararası
terminoloji), ama `tips`, `commonMistakes`, `muscles` **çevrilebilir
alanlardır** ve dil kodlu tutulmalı:

```
tips: { tr: [...], en: [...] }
```

**[TODO]** Şu anki veri düz Türkçe metin tutuyor. Faz 2'de dil sarmalayıcı
eklenmeli — şimdi yapılmazsa 196 node'u sonradan dönüştürmek pahalı olur.

*Gerekçe:* Bu, portfolyo hedefiyle de uyumlu — İngilizce arayüz seçeneği
projeyi uluslararası okunur yapar.

### Accessibility Ready **[TASARIM]**

Skill tree bir SVG grafiği. Bu, erişilebilirlik açısından en zor bileşen
türü: ekran okuyucu bir SVG'de ne olduğunu anlayamaz.

**Minimum hedefler [TASARIM]:**

| Konu | Gereksinim |
|---|---|
| Klavye | Ağaçta tab ile gezinme, Enter ile node açma |
| Ekran okuyucu | Her node'un `aria-label`'ı: ad + durum + tier |
| Alternatif görünüm | Ağacın **liste** karşılığı — SVG'ye bağımlı olmayan |
| Kontrast | Kilitli node'lar okunabilir kalmalı (şu an çok soluk) |
| Renk körlüğü | Durum sadece renkle değil, **şekil/ikonla** da anlatılmalı |

Son madde şu an ihlal ediliyor: mastery kademeleri yalnızca renkle
(bronz/gümüş/altın/mor) ayırt ediliyor. Madalya ikonu veya kademe sayısı
eklenmeli.

**[TODO]** Alternatif liste görünümü Faz 2'de. Klavye + aria Faz 1'de.

## Katmanlar **[KESİN]**

```
┌──────────────────────────────────────────────────────┐
│  UI KATMANI (React)                                  │
│  Skill Tree · Hareket Detayı · Antrenman · İstatistik │
└────────────────────────┬─────────────────────────────┘
                         │  okuma + aksiyon çağrısı
┌────────────────────────▼─────────────────────────────┐
│  MOTOR (saf TypeScript, UI'dan bağımsız, test edilir) │
│  UnlockEngine · XPEngine · QuestEngine · CoachEngine  │
└────────┬──────────────────────────────┬──────────────┘
         │                              │
┌────────▼──────────┐        ┌──────────▼──────────────┐
│ İÇERİK (salt oku) │        │ KAYIT (okuma-yazma)     │
│ movements.json    │        │ IndexedDB               │
└───────────────────┘        └─────────────────────────┘
```

### Değişmez kural 1 **[KESİN]**
Motor katmanı DOM bilmez, React bilmez. Girdi `(movements, playerState)`,
çıktı yeni durum. Sonuç: her oyun kuralı ayrı test edilebilir ve UI baştan
yazılsa bile mekanikler korunur. *Kaynak: Old Developer Test*

### Değişmez kural 2 **[KESİN]**
İçerik ve kayıt asla karışmaz. `movements.json` güncellendiğinde (yeni
hareket, düzeltilmiş ön koşul) kullanıcı ilerlemesi bozulmaz — çünkü kayıt
sadece `id`'ye referans verir. *Kaynak: FP-7*

## Veri akışı örneği

```
Kullanıcı "Pull-up 3×8 yaptım" der
   ↓
SetLog IndexedDB'ye yazılır
   ↓
XPEngine mastery kademesi değişti mi bakar (8 ≥ silver eşiği?)
   ↓
Değiştiyse XP verir, seviye kontrolü yapar
   ↓
UnlockEngine bronza ulaşılan node'ların çocuklarını açar
   ↓
UI yeni açılan node'ları animasyonla gösterir
```

## Bağlantılar

- `17_Database` — kayıt modeli detayı
- `13_AIArchitecture` — CoachEngine'in yeri
- `22_Roadmap` — hangi katman hangi fazda

## Gelecekteki Geliştirmeler

- **[TASARIM]** Plugin System: Faz 5'te ayrı ağaçlar (Rings, Freestyle)
  birer "skill pack" olarak yüklenebilir olmalı. Şema `schemaVersion`
  taşıyor, temeli atıldı.

## Açık Sorular

- **[RESEARCH]** IndexedDB tek kaynak → cihaz kaybı = veri kaybı.
  Faz 1'de dışa aktarma zorunlu, ama kullanıcı düzenli yedek alır mı?
  Otomatik hatırlatma gerekli mi?

---

<a name="17_database"></a>
# 17 · DATABASE

## İki ayrı depo **[KESİN]**

| | İçerik | Kayıt |
|---|---|---|
| Ne | Hareket tanımları | Kullanıcı ilerlemesi |
| Nerede | `movements.json` (statik dosya) | IndexedDB (tarayıcı) |
| Yazma | Sadece build zamanı | Sürekli |
| Sürüm | `schemaVersion` | `v` alanı |
| Bağ | — | Sadece hareket `id`'sine referans |

## Kayıt şeması **[TASARIM]**

```
setLogs        { id, movementId, date, value, sets, notes }
masteryState   { movementId, tier, achievedAt, verifiedSessions[] }
playerState    { xp, level, streakWeeks, lastDeload, equipment[] }
sessions       { id, date, movementIds[], durationMin, readiness }
measurements   { date, sleep, soreness, mood }      // Faz 3
```

### `verifiedSessions[]` neden var
Anayasa kuralı: mastery kademesi **14 gün içinde 2 ayrı seansta**
tutulmalı. Tek seferlik iyi gün mastery sayılmaz. Bu yüzden kademe
"ulaşıldı" değil, "doğrulandı" durumunu taşır.

**[TODO]** Bu kural prototipte henüz uygulanmadı — prototip tek kayıtla
kademe veriyor. Gerçek MVP'de seans tarihi tutulacak.

## Kurallar **[KESİN]**

1. **Hareket `id`'leri kalıcıdır.** İsim değişebilir, id değişmez.
2. **Silme yok, arşivleme var.** Bir hareket veritabanından çıkarılırsa
   kullanıcının o hareketteki kaydı korunur (Skill Fossil fikrinin temeli).
3. **Dışa aktarma standart JSON.** Kilitleme yok. *Kaynak: M-6*
4. **Şema sürümü taşınır.** İleri sürümde göç (migration) yazılabilsin.

## Bağlantılar

- `10_MovementDatabase` — içerik tarafı
- `16_Architecture` — katman ayrımı
- `27_IdeaVault` — Skill Fossil System

## Açık Sorular

- **[RESEARCH]** Faz 4 senkronizasyonunda çakışma stratejisi: "son yazan
  kazanır" + uyarı planlanıyor. İki cihazda aynı gün farklı kayıt
  girilirse ne olur?

---
---

# 🌳 PART 3 — CALISTHENICS BIBLE

Bu bölüm projenin fiziksel gerçekliğidir. Yukarıdaki her mimari karar
buradaki veriyi taşımak için var.

---

<a name="19_skilltrees"></a>
# 19 · SKILL TREES

## 12 kategori **[KESİN]**

| Kategori | Hareket | Rol |
|---|---|---|
| **Push** | 25 | Yatay itme — göğüs/triceps temeli, planche zincirinin girişi |
| **Vertical Push** | 12 | Dikey itme — pike'tan HSPU'ya, handstand'e bağımlı |
| **Explosive** | 8 | Patlayıcı güç — clap'ten aztec'e, muscle-up'ı besler |
| **Dips** | 10 | Dip zinciri — muscle-up geçişinin itme yarısı |
| **Pull** | 43 | En büyük ağaç. Askı → row → pull-up → lever → muscle-up → OAP |
| **Core** | 25 | Hollow/arch temeli, L-sit zinciri, dragon flag, manna |
| **Legs** | 20 | Squat zinciri, tek bacak, nordic, patlayıcı sıçrama |
| **Balance** | 16 | Frog stand → handstand → one arm handstand, human flag |
| **Mobility** | 11 | **Kapı görevi görür.** Bilek/omuz/kalça/ayak bileği/pancake |
| **Conditioning** | 11 | İp, koşu, burpee — kondisyon tabanı |
| **Elite** | 11 | Planche zinciri + halka elitleri (iron cross, maltese, victorian) |
| **Recovery** | 4 | Uyku, deload, esneme, doku çalışması |

## Neden bu 12?

Vizyon dosyaları 17 ağaç istiyordu (Leg, Mobility, Grip, Balance,
Conditioning, Explosive, Rings, Parallettes, Street Workout, Freestyle,
Weighted, Gymnastics, Recovery, Push, Vertical Push, Pull, Core).

12'ye indirildi. Gerekçeler:

| İstenen ağaç | Ne oldu | Neden |
|---|---|---|
| Grip | Pull içinde `grip` ailesi | 6 hareket ayrı ağaç olmayı hak etmiyor; hepsi askıdan türüyor |
| Rings | Ekipman etiketi (`rings`) | Halka bir *ekipman*, bir beceri dalı değil. Ring dip zaten Dips'te |
| Parallettes | Ekipman etiketi (`parallettes`) | Aynı gerekçe |
| Street Workout | Dağıtıldı | Tanımı belirsiz; içindeki hareketler zaten Pull/Explosive'de |
| Freestyle | **[RED]** | Hareket seti tanımsız, ölçülemez |
| Weighted | Ekipman etiketi (`vest`) | Weighted pull-up/dip mevcut node'ların varyantı |
| Gymnastics | Elite + Balance'a dağıtıldı | Manna, iron cross, victorian zaten var |

**Karar gerekçesi:** Ekipman bir kategori değildir. Aynı hareket farklı
ekipmanla yapılabilir; kategoriyi *hareket kalıbı* belirler, alet değil.
Bu, `10_MovementDatabase` şemasında `equipment[]` alanının ayrı durmasının
sebebi. *Kaynak: FP-6*

**[TODO]** Faz 5'te bunlar "skill pack" olarak ayrılabilir — ama kategori
olarak değil, filtre/görünüm olarak.

## Ana zincirler **[KESİN]**

### Push zinciri
```
Wall Push-up → Incline/Knee → Standard Push-up
   ├→ Wide → Archer → Typewriter ─┐
   ├→ Offset → Uneven → Archer     ├→ Assisted OAP → Negative OAP
   ├→ Close Grip → Diamond ────────┘        └→ ONE ARM PUSH-UP ★
   └→ Decline + Diamond → Pseudo Planche Push-up → Planche Lean
```

### Vertical push zinciri
```
Standard Push-up + Shoulder Mobility → Pike Push-up
   → Elevated Pike → Box Pike ─┐
                                ├→ Wall HSPU → Negative → Partial
Wall Walk → Wall Handstand ─────┘         → HANDSTAND PUSH-UP ★
                                              ├→ Tiger Bend
                                              └→ + Full Planche → 90° PUSH-UP ★
```

### Pull zinciri (en büyük)
```
Passive Hang → Active Hang → Scapular Pull-up → Negative Pull-up
Australian Row → Inverted Row ────────────────┘
   → Chin-up → PULL-UP
        ├→ Wide → Archer → Typewriter → OAP Progression → ONE ARM PULL-UP ★
        ├→ Explosive → High Pull-up → BAR MUSCLE-UP ★ → RING MUSCLE-UP ★
        ├→ Chest-to-Bar → Ice Cream Maker
        └→ + Hollow Hold → Tuck FL → Adv Tuck → One Leg → Straddle → FRONT LEVER ★
```

### Back lever zinciri
```
Active Hang + Shoulder Mobility → German Hang → Skin the Cat
   → Tuck BL → Adv Tuck BL → Straddle BL → BACK LEVER ★
                                    └→ (+ Side Plank) → Clutch Flag
                                        → Human Flag Prog → HUMAN FLAG ★
```

### Planche zinciri
```
Pseudo Planche Push-up → Planche Lean ─┐
Frog Stand ────────────────────────────┴→ Tuck Planche
   → Adv Tuck → Straddle → FULL PLANCHE ★
        ├→ PLANCHE PUSH-UP ★
        ├→ MALTESE ★
        └→ (+ HSPU) → 90° PUSH-UP ★
```

### Balance zinciri
```
Bear Crawl + Wrist Mobility → Frog Stand
   ├→ Crow → Crane
   ├→ Elbow Lever
   └→ Tripod Headstand → Headstand ─┐
Wall Walk + Wrist Mobility ─────────┴→ Wall Handstand
   → Shoulder Tap → FREESTANDING HANDSTAND ★
        ├→ Handstand Walk ─┐
        └→ Press to HS ────┴→ ONE ARM HANDSTAND ★ → ONE ARM HSPU ★
```

### Core zinciri
```
Dead Bug + Plank → Hollow Hold
   ├→ Hollow Rocks / Boat Hold / Reverse Hollow
   ├→ + Reverse Hollow → Dragon Flag Negative → DRAGON FLAG ★
   └→ Tuck L-Sit ─┐
Pike Stretch → Compression Hold ─┴→ L-SIT → Adv L-Sit
                                      → (+ Pancake) → V-Sit → MANNA ★
Active Hang → Hanging Knee Raise → Hanging Leg Raise → Toes to Bar
   → Windshield Wipers
```

### Legs zinciri
```
Bodyweight Squat
   ├→ Split Squat → Bulgarian Split Squat
   │      ├→ Assisted Pistol → PISTOL SQUAT ★ ─┐
   │      └→ (+ Ankle Mob) → Shrimp Squat ─────┼→ Dragon Squat
   │   Cossack Squat ──────────────────────────┘
   ├→ Jump Squat → Box/Tuck/Broad Jump
   └→ Reverse Lunge + SL RDL → Nordic Negative → NORDIC CURL ★
```

### Mobilite kapıları **[KESİN]**
```
wrist-mobility     → frog-stand, wall-handstand, pseudo-planche-pushup
shoulder-mobility  → parallel-bar-dip, pike-pushup, german-hang, korean-dip
ankle-mobility     → pistol-squat, shrimp-squat
hip-mobility       → cossack-squat, pancake-stretch
hamstring-mobility → pike-stretch → compression-hold → l-sit
thoracic-mobility  → bridge → bridge-pushup
finger-mobility    → fingertip-pushup, fingertip-hang
pancake-stretch    → v-sit, press-to-handstand
```

Bu tablo M-2'nin (mobilite gerçek bir kapıdır) somut hali. Slogan değil,
8 gerçek bağımlılık.

## 22 boss **[KESİN]**

| Boss | Tier | Derinlik | Kategori |
|---|---|---|---|
| Nordic Curl | 6 | 3 | Legs |
| Pistol Squat | 5 | 4 | Legs |
| Dragon Flag | 6 | 4 | Core |
| Manna | 9 | 6 | Core |
| Freestanding Handstand | 5 | 7 | Balance |
| Back Lever | 7 | 7 | Pull |
| One Arm Push-up | 7 | 8 | Push |
| Bar Muscle-Up | 7 | 8 | Pull |
| Human Flag | 8 | 8 | Balance |
| Hefesto | 9 | 8 | Elite |
| Handstand Push-up | 7 | 9 | Vertical Push |
| Ring Muscle-Up | 7 | 9 | Pull |
| One Arm Handstand | 9 | 9 | Balance |
| One Arm HSPU | 9 | 10 | Vertical Push |
| One Arm Pull-up | 9 | 10 | Pull |
| Front Lever | 8 | 10 | Pull |
| Full Planche | 9 | 10 | Elite |
| Iron Cross | 9 | 10 | Elite |
| 90 Degree Push-up | 9 | 11 | Vertical Push |
| Planche Push-up | 9 | 11 | Elite |
| Maltese | 9 | 11 | Elite |
| Victorian Cross | 9 | 11 | Elite |

## Beginner → Legendary haritası

| Aşama | Tier | Ne demek | Örnek |
|---|---|---|---|
| **Beginner** | 0-1 | Temel kalıpları öğreniyor | Wall push-up, passive hang, squat |
| **Novice** | 2 | Standart hareketleri yapabiliyor | Push-up, dip, inverted row |
| **Intermediate** | 3-4 | İlk gerçek beceriler | Pull-up, pike push-up, tuck BL, L-sit |
| **Advanced** | 5-6 | Statik ve tek taraflı işler | Handstand, front lever tuck, pistol |
| **Elite** | 7-8 | Boss seviyesi | Muscle-up, HSPU, front lever, back lever |
| **Legendary** | 9 | Halka elitleri ve tek kol | Planche, iron cross, OAP, manna, victorian |

## Bağlantılar

- `20_MovementList` — tam liste, eşiklerle
- `09_SkillTreeTheory` — graf kuralları
- `11_SkillGenome` — isim dışı benzerlik

## Açık Sorular

- **[RESEARCH]** Freestyle ağacı gerçekten reddedilmeli mi? Street workout
  kültürünün büyük parçası. Ama ölçülebilir node'a çevrilemiyor.
- **[RESEARCH]** Nordic Curl derinlik 3'te ama tier 6 — yani çok erken
  erişilebilir bir boss. Ön koşul zinciri çok mu kısa?

---

<a name="20_movementlist"></a>
# 20 · MOVEMENT LIST

Aşağıdaki liste `data/movements.json`'dan **otomatik üretilmiştir.**
Elle düzenlenmez; kaynak değişirse yeniden üretilir.

**Okuma biçimi:**

```
Hareket Adı · T<tier> · <ölçü> · bronz/gümüş/altın/master · ← ön koşullar
★ = boss   ○ = aksesuar/varyasyon (bilinçli yaprak)
```


## Push  (25 hareket)


**Derinlik 0**

- **Wall Push-up** · T0 · 3×tekrar · 8/12/15/20 · ← —

**Derinlik 1**

- **Incline Push-up** · T0 · 3×tekrar · 8/12/15/20 · ← Wall Push-up
- **Knee Push-up** · T0 · 3×tekrar · 8/12/15/20 · ← Wall Push-up

**Derinlik 2**

- **Standard Push-up** · T1 · 3×tekrar · 5/10/15/25 · ← Incline Push-up, Knee Push-up

**Derinlik 3**

- **Wide Push-up** · T1 · 3×tekrar · 5/10/15/20 · ← Standard Push-up
- **Close Grip Push-up** · T2 · 3×tekrar · 5/8/12/18 · ← Standard Push-up
- **Decline Push-up** · T2 · 3×tekrar · 5/8/12/18 · ← Standard Push-up
- ○ **Deep Push-up** · T2 · 3×tekrar · 5/8/12/18 · ← Standard Push-up
- **Hindu Push-up** · T2 · 3×tekrar · 5/8/12/15 · ← Standard Push-up
- **Knuckle Push-up** · T2 · 3×tekrar · 5/8/12/18 · ← Standard Push-up
- **Offset Push-up** · T2 · 3×tekrar/taraf · 5/8/12/15 · ← Standard Push-up
- ○ **Mike Tyson Push-up** · T4 · 3×tekrar · 3/6/10/15 · ← Standard Push-up, Hollow Hold

**Derinlik 4**

- **Diamond Push-up** · T2 · 3×tekrar · 5/8/12/18 · ← Close Grip Push-up
- ○ **Dive Bomber Push-up** · T3 · 3×tekrar · 5/8/12/15 · ← Hindu Push-up
- **Fingertip Push-up** · T3 · 3×tekrar · 3/6/10/15 · ← Knuckle Push-up, Finger Mobility Routine
- **Uneven Push-up** · T3 · 3×tekrar/taraf · 5/8/12/15 · ← Offset Push-up

**Derinlik 5**

- **Sphinx Push-up** · T3 · 3×tekrar · 3/6/10/15 · ← Diamond Push-up
- **Archer Push-up** · T4 · 3×tekrar/taraf · 3/6/10/12 · ← Uneven Push-up, Wide Push-up
- **Pseudo Planche Push-up** · T4 · 3×tekrar · 3/6/10/15 · ← Diamond Push-up, Decline Push-up, Wrist Mobility Routine
- ○ **Finger Push-up** · T5 · 3×tekrar · 1/3/5/8 · ← Fingertip Push-up

**Derinlik 6**

- **Assisted One Arm Push-up** · T5 · 3×tekrar/taraf · 3/5/8/10 · ← Archer Push-up
- ○ **Russian Push-up** · T5 · 3×tekrar · 3/5/8/12 · ← Diamond Push-up, Sphinx Push-up
- **Typewriter Push-up** · T5 · 3×tekrar/taraf · 3/5/8/10 · ← Archer Push-up

**Derinlik 7**

- **Negative One Arm Push-up** · T6 · 3×tekrar/taraf · 2/3/5/8 · ← Assisted One Arm Push-up

**Derinlik 8**

- ★ **One Arm Push-up** · T7 · 3×tekrar/taraf · 1/3/5/8 · ← Negative One Arm Push-up, Typewriter Push-up

## Vertical Push  (12 hareket)


**Derinlik 3**

- **Pike Push-up** · T2 · 3×tekrar · 5/8/12/18 · ← Standard Push-up, Shoulder Mobility Routine

**Derinlik 4**

- **Elevated Pike Push-up** · T3 · 3×tekrar · 5/8/12/15 · ← Pike Push-up
- ○ **V Push-up** · T3 · 3×tekrar · 5/8/12/15 · ← Pike Push-up
- **Wall Walk** · T3 · 3×tekrar · 3/5/8/10 · ← Pike Push-up, Wrist Mobility Routine

**Derinlik 5**

- **Box Pike Push-up** · T4 · 3×tekrar · 3/6/10/12 · ← Elevated Pike Push-up

**Derinlik 6**

- **Wall Handstand Push-up** · T5 · 3×tekrar · 2/5/8/12 · ← Box Pike Push-up, Wall Handstand

**Derinlik 7**

- **Negative Handstand Push-up** · T6 · 3×tekrar · 2/4/6/8 · ← Wall Handstand Push-up

**Derinlik 8**

- **Partial Handstand Push-up** · T6 · 3×tekrar · 2/4/6/8 · ← Negative Handstand Push-up

**Derinlik 9**

- ★ **Handstand Push-up** · T7 · 3×tekrar · 1/3/5/8 · ← Partial Handstand Push-up, Freestanding Handstand

**Derinlik 10**

- ○ **Tiger Bend Push-up** · T8 · 3×tekrar · 1/2/4/6 · ← Handstand Push-up
- ★ **One Arm Handstand Push-up** · T9 · 3×tekrar/taraf · 1/1/2/3 · ← Handstand Push-up, One Arm Handstand

**Derinlik 11**

- ★ **90 Degree Push-up** · T9 · 3×tekrar · 1/2/3/5 · ← Handstand Push-up, Full Planche

## Explosive  (8 hareket)


**Derinlik 2**

- ○ **Plyometric Dip** · T4 · 3×tekrar · 3/5/8/12 · ← Parallel Bar Dip

**Derinlik 3**

- **Dynamic Push-up** · T3 · 3×tekrar · 5/8/12/15 · ← Standard Push-up

**Derinlik 4**

- **Explosive Push-up** · T3 · 3×tekrar · 5/8/10/15 · ← Dynamic Push-up

**Derinlik 5**

- **Clap Push-up** · T4 · 3×tekrar · 3/6/10/15 · ← Explosive Push-up

**Derinlik 6**

- **Double Clap Push-up** · T6 · 3×tekrar · 1/3/5/8 · ← Clap Push-up
- **Superman Push-up** · T7 · 3×tekrar · 1/2/4/6 · ← Clap Push-up, Hollow Rocks

**Derinlik 7**

- ○ **Behind the Back Clap Push-up** · T7 · 3×tekrar · 1/2/3/5 · ← Double Clap Push-up
- ○ **Aztec Push-up** · T8 · 3×tekrar · 1/2/3/5 · ← Superman Push-up

## Dips  (10 hareket)


**Derinlik 0**

- **Bench Dip** · T1 · 3×tekrar · 8/12/18/25 · ← —

**Derinlik 1**

- **Parallel Bar Dip** · T2 · 3×tekrar · 5/10/15/25 · ← Bench Dip, Shoulder Mobility Routine

**Derinlik 2**

- **Deep Dip** · T3 · 3×tekrar · 5/8/12/20 · ← Parallel Bar Dip
- **Straight Bar Dip** · T3 · 3×tekrar · 5/8/12/20 · ← Parallel Bar Dip
- **Ring Dip** · T4 · 3×tekrar · 3/6/10/15 · ← Parallel Bar Dip
- ○ **Weighted Dip** · T5 · 3×tekrar · 5/8/10/12 · ← Parallel Bar Dip

**Derinlik 3**

- ○ **Archer Dip** · T5 · 3×tekrar/taraf · 3/5/8/10 · ← Deep Dip
- **Korean Dip** · T5 · 3×tekrar · 3/5/8/12 · ← Straight Bar Dip, Shoulder Mobility Routine
- **Ring Turned Out Dip** · T5 · 3×tekrar · 3/5/8/12 · ← Ring Dip

**Derinlik 4**

- ○ **Impossible Dip** · T8 · 3×tekrar · 1/2/3/5 · ← Korean Dip, Straight Bar Dip

## Pull  (43 hareket)


**Derinlik 0**

- **Passive Hang** · T0 · saniye · 20/40/60/90 · ← —
- **Australian Row** · T1 · 3×tekrar · 8/12/18/25 · ← —

**Derinlik 1**

- **Active Hang** · T1 · saniye · 15/30/45/60 · ← Passive Hang
- **Inverted Row** · T2 · 3×tekrar · 8/12/15/20 · ← Australian Row
- **Ring Row** · T2 · 3×tekrar · 8/12/15/20 · ← Australian Row

**Derinlik 2**

- **Scapular Pull-up** · T1 · 3×tekrar · 5/10/15/20 · ← Active Hang
- **False Grip Hang** · T3 · saniye · 10/20/30/45 · ← Active Hang
- **German Hang** · T3 · saniye · 10/20/30/45 · ← Active Hang, Shoulder Mobility Routine
- **Towel Hang** · T4 · saniye · 15/25/40/60 · ← Active Hang
- ○ **Fingertip Hang** · T5 · saniye · 10/20/30/45 · ← Active Hang, Finger Mobility Routine

**Derinlik 3**

- **Negative Pull-up** · T2 · 3×tekrar · 3/5/8/10 · ← Scapular Pull-up
- **Skin the Cat** · T4 · 3×tekrar · 3/5/8/10 · ← German Hang
- ○ **One Arm Hang** · T6 · saniye · 10/20/30/45 · ← Towel Hang
- **Pelican Curl** · T7 · 3×tekrar · 1/3/5/8 · ← Ring Row, German Hang

**Derinlik 4**

- **Chin-up** · T3 · 3×tekrar · 3/6/10/15 · ← Negative Pull-up, Inverted Row
- ○ **Neutral Grip Pull-up** · T3 · 3×tekrar · 3/6/10/15 · ← Negative Pull-up
- **Tuck Back Lever** · T4 · saniye · 5/10/20/30 · ← Skin the Cat

**Derinlik 5**

- **Pull-up** · T3 · 3×tekrar · 3/8/12/20 · ← Chin-up
- **Advanced Tuck Back Lever** · T5 · saniye · 5/10/15/25 · ← Tuck Back Lever

**Derinlik 6**

- ○ **Close Grip Pull-up** · T4 · 3×tekrar · 3/6/10/15 · ← Pull-up
- ○ **Commando Pull-up** · T4 · 3×tekrar/taraf · 3/5/8/12 · ← Pull-up
- ○ **Mixed Grip Pull-up** · T4 · 3×tekrar · 3/6/10/12 · ← Pull-up
- **Wide Pull-up** · T4 · 3×tekrar · 3/6/10/15 · ← Pull-up
- **Chest-to-Bar Pull-up** · T5 · 3×tekrar · 2/4/6/10 · ← Pull-up
- **Explosive Pull-up** · T5 · 3×tekrar · 3/5/8/10 · ← Pull-up
- ○ **L-Sit Pull-up** · T5 · 3×tekrar · 3/5/8/12 · ← Pull-up, L-Sit
- **Tuck Front Lever** · T5 · saniye · 5/10/20/30 · ← Pull-up, Hollow Hold
- ○ **Weighted Pull-up** · T5 · 3×tekrar · 3/5/8/10 · ← Pull-up
- **Straddle Back Lever** · T6 · saniye · 5/10/15/20 · ← Advanced Tuck Back Lever

**Derinlik 7**

- **Advanced Tuck Front Lever** · T6 · saniye · 5/10/15/25 · ← Tuck Front Lever
- **Archer Pull-up** · T6 · 3×tekrar/taraf · 2/4/6/10 · ← Wide Pull-up
- **High Pull-up** · T6 · 3×tekrar · 2/3/5/8 · ← Explosive Pull-up, Chest-to-Bar Pull-up
- ★ **Back Lever** · T7 · saniye · 3/8/15/20 · ← Straddle Back Lever
- ○ **Ice Cream Maker** · T7 · 3×tekrar · 1/3/5/8 · ← Chest-to-Bar Pull-up, Tuck Front Lever

**Derinlik 8**

- ★ **Bar Muscle-Up** · T7 · 3×tekrar · 1/3/5/10 · ← High Pull-up, Straight Bar Dip
- **One Leg Front Lever** · T7 · saniye · 5/8/12/20 · ← Advanced Tuck Front Lever
- **Typewriter Pull-up** · T7 · 3×tekrar/taraf · 1/3/5/8 · ← Archer Pull-up

**Derinlik 9**

- ★ **Ring Muscle-Up** · T7 · 3×tekrar · 1/3/5/8 · ← Bar Muscle-Up, False Grip Hang, Ring Dip
- **Straddle Front Lever** · T7 · saniye · 3/8/12/20 · ← One Leg Front Lever
- **One Arm Pull-up Progression** · T8 · 3×tekrar/taraf · 1/2/3/5 · ← Archer Pull-up, Typewriter Pull-up

**Derinlik 10**

- ★ **Front Lever** · T8 · saniye · 3/8/15/20 · ← Straddle Front Lever
- ★ **One Arm Pull-up** · T9 · 3×tekrar/taraf · 1/1/2/3 · ← One Arm Pull-up Progression

**Derinlik 11**

- ○ **Front Lever Row** · T9 · 3×tekrar · 1/2/3/5 · ← Front Lever

## Core  (25 hareket)


**Derinlik 0**

- **Dead Bug** · T0 · 3×tekrar · 8/12/16/20 · ← —
- **Plank** · T0 · saniye · 20/40/60/90 · ← —

**Derinlik 1**

- **Arch Hold** · T1 · saniye · 15/30/45/60 · ← Plank
- **Hollow Hold** · T1 · saniye · 15/30/45/60 · ← Dead Bug, Plank
- **Reverse Crunch** · T1 · 3×tekrar · 8/12/18/25 · ← Dead Bug
- ○ **Reverse Plank** · T1 · saniye · 20/30/45/60 · ← Plank
- **Side Plank** · T1 · saniye · 20/30/45/60 · ← Plank

**Derinlik 2**

- ○ **Boat Hold** · T1 · saniye · 20/30/45/60 · ← Hollow Hold
- **Hanging Knee Raise** · T2 · 3×tekrar · 5/10/15/20 · ← Active Hang
- **Hollow Rocks** · T2 · 3×tekrar · 10/20/30/40 · ← Hollow Hold
- **Reverse Hollow Hold** · T2 · saniye · 15/30/45/60 · ← Hollow Hold, Arch Hold
- **Tuck L-Sit** · T2 · saniye · 10/20/30/45 · ← Hollow Hold
- ○ **V-Up** · T2 · 3×tekrar · 8/12/18/25 · ← Reverse Crunch, Hollow Hold
- **Compression Hold** · T3 · saniye · 10/20/30/45 · ← Pike Stretch
- ○ **Copenhagen Plank** · T3 · saniye · 10/20/30/45 · ← Side Plank

**Derinlik 3**

- **Hanging Leg Raise** · T3 · 3×tekrar · 5/10/15/20 · ← Hanging Knee Raise
- **Compression Lift** · T4 · 3×tekrar · 3/6/10/15 · ← Compression Hold
- **L-Sit** · T4 · saniye · 10/20/30/45 · ← Tuck L-Sit, Compression Hold
- **Dragon Flag Negative** · T5 · 3×tekrar · 3/5/8/12 · ← Hollow Hold, Reverse Hollow Hold

**Derinlik 4**

- **Toes to Bar** · T4 · 3×tekrar · 3/8/12/18 · ← Hanging Leg Raise, Pike Stretch
- **Advanced L-Sit** · T5 · saniye · 5/15/25/35 · ← L-Sit
- ★ **Dragon Flag** · T6 · 3×tekrar · 3/5/8/12 · ← Dragon Flag Negative

**Derinlik 5**

- ○ **Windshield Wipers** · T6 · 3×tekrar · 3/5/8/12 · ← Toes to Bar
- **V-Sit** · T7 · saniye · 3/8/15/20 · ← Advanced L-Sit, Pancake Stretch

**Derinlik 6**

- ★ **Manna** · T9 · saniye · 2/5/8/12 · ← V-Sit

## Legs  (20 hareket)


**Derinlik 0**

- **Bodyweight Squat** · T0 · 3×tekrar · 15/25/40/60 · ← —
- **Calf Raise** · T0 · 3×tekrar · 15/25/40/60 · ← —

**Derinlik 1**

- **Reverse Lunge** · T1 · 3×tekrar/taraf · 10/15/20/30 · ← Bodyweight Squat
- ○ **Single Leg Calf Raise** · T1 · 3×tekrar/taraf · 10/15/25/35 · ← Calf Raise
- **Split Squat** · T1 · 3×tekrar/taraf · 10/15/20/25 · ← Bodyweight Squat
- ○ **Walking Lunge** · T1 · 3×tekrar/taraf · 10/15/20/30 · ← Bodyweight Squat
- **Jump Squat** · T2 · 3×tekrar · 10/15/20/30 · ← Bodyweight Squat
- **Single Leg Romanian Deadlift** · T2 · 3×tekrar/taraf · 8/12/18/25 · ← Bodyweight Squat
- **Cossack Squat** · T3 · 3×tekrar/taraf · 5/10/15/20 · ← Bodyweight Squat, Hip Mobility Routine
- ○ **Sissy Squat** · T4 · 3×tekrar · 5/10/15/20 · ← Bodyweight Squat

**Derinlik 2**

- ○ **Box Jump** · T2 · 3×tekrar · 8/12/18/25 · ← Jump Squat
- **Bulgarian Split Squat** · T2 · 3×tekrar/taraf · 8/12/18/25 · ← Split Squat
- ○ **Broad Jump** · T3 · 3×tekrar · 5/8/12/18 · ← Jump Squat
- ○ **Tuck Jump** · T3 · 3×tekrar · 8/12/18/25 · ← Jump Squat
- **Nordic Curl Negative** · T4 · 3×tekrar · 3/5/8/10 · ← Reverse Lunge, Single Leg Romanian Deadlift

**Derinlik 3**

- **Assisted Pistol Squat** · T3 · 3×tekrar/taraf · 5/8/12/18 · ← Bulgarian Split Squat
- **Shrimp Squat** · T4 · 3×tekrar/taraf · 3/6/10/15 · ← Bulgarian Split Squat, Ankle Mobility Routine
- ★ **Nordic Curl** · T6 · 3×tekrar · 1/3/5/8 · ← Nordic Curl Negative

**Derinlik 4**

- ★ **Pistol Squat** · T5 · 3×tekrar/taraf · 3/6/10/15 · ← Assisted Pistol Squat, Ankle Mobility Routine

**Derinlik 5**

- ○ **Dragon Squat** · T7 · 3×tekrar/taraf · 1/3/5/8 · ← Pistol Squat, Shrimp Squat, Cossack Squat

## Balance  (16 hareket)


**Derinlik 0**

- **Bear Crawl** · T0 · metre · 10/20/30/50 · ← —

**Derinlik 1**

- **Frog Stand** · T2 · saniye · 10/20/30/45 · ← Bear Crawl, Wrist Mobility Routine

**Derinlik 2**

- **Tripod Headstand** · T2 · saniye · 15/30/45/60 · ← Frog Stand
- **Crow Pose** · T3 · saniye · 10/20/30/45 · ← Frog Stand
- ○ **Elbow Lever** · T4 · saniye · 10/15/25/40 · ← Frog Stand

**Derinlik 3**

- **Headstand** · T3 · saniye · 20/40/60/90 · ← Tripod Headstand
- ○ **Crane Pose** · T4 · saniye · 10/15/25/40 · ← Crow Pose

**Derinlik 5**

- **Wall Handstand** · T3 · saniye · 20/40/60/90 · ← Wall Walk, Wrist Mobility Routine, Headstand
- **Clutch Flag** · T6 · saniye · 5/10/15/25 · ← Side Plank, Tuck Back Lever

**Derinlik 6**

- **Handstand Shoulder Tap** · T4 · 3×tekrar · 5/10/15/20 · ← Wall Handstand

**Derinlik 7**

- ★ **Freestanding Handstand** · T5 · saniye · 5/15/30/60 · ← Wall Handstand, Handstand Shoulder Tap
- **Human Flag Progression** · T7 · saniye · 3/8/12/20 · ← Clutch Flag, Straddle Back Lever

**Derinlik 8**

- **Handstand Walk** · T6 · metre · 3/5/10/20 · ← Freestanding Handstand
- **Press to Handstand** · T7 · 3×tekrar · 1/3/5/8 · ← Freestanding Handstand, Compression Lift, Pancake Stretch
- ★ **Human Flag** · T8 · saniye · 3/8/12/20 · ← Human Flag Progression

**Derinlik 9**

- ★ **One Arm Handstand** · T9 · saniye · 2/5/10/15 · ← Handstand Walk, Press to Handstand

## Mobility  (11 hareket)


**Derinlik 0**

- **Ankle Mobility Routine** · T0 · 3×tekrar · 10/15/20/30 · ← —
- **Finger Mobility Routine** · T0 · saniye · 30/60/90/120 · ← —
- **Hamstring Mobility Routine** · T0 · saniye · 30/60/90/120 · ← —
- **Hip Mobility Routine** · T0 · 3×tekrar · 10/15/20/30 · ← —
- **Shoulder Mobility Routine** · T0 · 3×tekrar · 10/15/20/30 · ← —
- **Thoracic Mobility Routine** · T0 · 3×tekrar · 10/15/20/30 · ← —
- **Wrist Mobility Routine** · T0 · saniye · 30/60/90/120 · ← —

**Derinlik 1**

- **Pike Stretch** · T1 · saniye · 20/40/60/90 · ← Hamstring Mobility Routine
- **Bridge** · T2 · saniye · 15/30/45/60 · ← Thoracic Mobility Routine, Shoulder Mobility Routine

**Derinlik 2**

- **Pancake Stretch** · T3 · saniye · 20/40/60/90 · ← Pike Stretch, Hip Mobility Routine
- ○ **Bridge Push-up** · T4 · 3×tekrar · 3/6/10/15 · ← Bridge

## Conditioning  (11 hareket)


**Derinlik 0**

- **Jump Rope - Basic Bounce** · T0 · adet · 50/100/200/300 · ← —
- **Running** · T1 · metre · 1000/3000/5000/10000 · ← —
- ○ **Shuttle Run** · T1 · metre · 100/200/400/800 · ← —

**Derinlik 1**

- **Jump Rope - Alternate Foot** · T1 · adet · 50/100/200/300 · ← Jump Rope - Basic Bounce
- ○ **Mountain Climber** · T1 · 3×tekrar · 20/30/50/80 · ← Plank
- ○ **Jump Rope - Crossover** · T3 · adet · 5/15/30/50 · ← Jump Rope - Basic Bounce
- ○ **Sprint Interval** · T3 · adet · 4/6/8/12 · ← Running
- **Double Under** · T4 · adet · 5/15/30/50 · ← Jump Rope - Basic Bounce

**Derinlik 2**

- ○ **Jump Rope - High Knees** · T2 · adet · 30/60/100/150 · ← Jump Rope - Alternate Foot
- ○ **Triple Under** · T7 · adet · 1/3/5/10 · ← Double Under

**Derinlik 3**

- ○ **Burpee** · T2 · 3×tekrar · 10/20/30/50 · ← Standard Push-up, Jump Squat

## Elite  (11 hareket)


**Derinlik 6**

- **Planche Lean** · T4 · saniye · 10/20/30/45 · ← Pseudo Planche Push-up

**Derinlik 7**

- **Tuck Planche** · T6 · saniye · 5/10/20/30 · ← Planche Lean, Frog Stand

**Derinlik 8**

- **Advanced Tuck Planche** · T7 · saniye · 5/10/15/25 · ← Tuck Planche
- ○ **Tuck Planche Push-up** · T8 · 3×tekrar · 1/3/5/8 · ← Tuck Planche, Pseudo Planche Push-up
- ★ **Hefesto** · T9 · 3×tekrar · 1/1/2/3 · ← Pelican Curl, Back Lever

**Derinlik 9**

- **Straddle Planche** · T8 · saniye · 3/8/12/20 · ← Advanced Tuck Planche

**Derinlik 10**

- ★ **Full Planche** · T9 · saniye · 2/5/10/15 · ← Straddle Planche
- ★ **Iron Cross** · T9 · saniye · 2/5/8/12 · ← Ring Muscle-Up, Ring Turned Out Dip

**Derinlik 11**

- ★ **Maltese** · T9 · saniye · 1/3/5/8 · ← Full Planche
- ★ **Planche Push-up** · T9 · 3×tekrar · 1/2/3/5 · ← Full Planche
- ★ **Victorian Cross** · T9 · saniye · 1/2/3/5 · ← Back Lever, Front Lever, Iron Cross

## Recovery  (4 hareket)


**Derinlik 0**

- **Daily Stretch Routine** · T0 · adet · 3/5/7/7 · ← —
- **Deload Week** · T0 · adet · 1/2/4/6 · ← —
- **Sleep Protocol (7-9h)** · T0 · adet · 3/5/7/7 · ← —
- **Soft Tissue Work** · T0 · adet · 2/3/5/7 · ← —

---
---

# 🎮 PART 4 — GAME DESIGN

---

<a name="18_gamesystems"></a>
# 18 · GAME SYSTEMS

## Neden oyunlaştırma?

Oyunlaştırma bir süs değil, FP-4'ün (görünür ilerleme motivasyonun kendisidir)
uygulama biçimi. Ama tek başına oyunlaştırma zararlı olabilir — bu yüzden
M-3 (oyunlaştırma sağlığa zarar veremez) anayasada.

Aşağıdaki her mekanik iki soruya cevap verir: *neyi görünür kılıyor* ve
*hangi davranışı ödüllendiriyor.*

---

## 18.1 · XP **[KESİN]**

```
base_xp(tier)  = round_5( 30 × 1.53^tier )
mastery_xp(t)  = round_5( base_xp × çarpan[t] )
çarpan         = bronze 1.0 · silver 1.6 · gold 2.6 · master 4.2
```

| Tier | Base XP | Bronz | Gümüş | Altın | Master | Toplam |
|---|---|---|---|---|---|---|
| 0 | 30 | 30 | 50 | 80 | 125 | 285 |
| 3 | 105 | 105 | 170 | 275 | 440 | 990 |
| 6 | 380 | 380 | 610 | 990 | 1600 | 3580 |
| 9 | 1300 | 1300 | 2080 | 3380 | 5460 | 12220 |

**Kritik kural:** XP her sette değil, **mastery kademesine ilk
ulaşıldığında** verilir.

*Gerekçe:* Her set XP verirse oyun "çok tekrar yap" oyununa döner. Bizim
felsefemiz "kaliteyi yükselt". *Kaynak: M-4*

Toplam kazanılabilir XP: **525.480**

**Ödüllendirdiği davranış:** Zor hareketi zorlamak, kolay hareketi
tekrarlamaktan değerli. Tier 9 bir kademe = tier 0'ın tüm kademelerinin
40 katı.

---

## 18.2 · Seviye **[KESİN]**

```
seviye N için kümülatif XP = round_10( 100 × (N-1)^1.6 )
```

| Seviye | Gereken XP |
|---|---|
| 2 | 100 |
| 5 | 970 |
| 10 | 3.800 |
| 25 | 19.000 |
| 50 | 46.900 |
| 100 | 156.700 |

525.480 toplam XP ile seviye 100 ulaşılabilir — ama **her hareketin master
kademesini** gerektirir. Yani tavan var ve kolay değil.

**Neden 1.6 üssü:** Erken seviyeler hızlı geçer (motivasyon), sonra yavaşlar
(uzun vade). Doğrusal olsa seviye anlamsızlaşır, karesel olsa erken
seviyeler de yavaş olur.

---

## 18.3 · Mastery **[KESİN]**

4 kademe: **bronze → silver → gold → master**

| Kademe | Anlamı |
|---|---|
| Bronz | "Bu hareketi yapabiliyorum" — **kilit açar** |
| Gümüş | "Rahatça yapıyorum" |
| Altın | "Hakimim" |
| Master | "Bu hareketi tükettim" |

### Doğrulama kuralı **[KESİN]** **[TODO uygulanacak]**
Bir kademe doğrulanmış sayılır: hedef değer **son 14 gün içinde iki ayrı
seansta** tutulmalı.

*Gerekçe:* Tek seferlik iyi gün mastery değildir. Tesadüf ile kalıcı
kazanım ayrılmalı. *Kaynak: FP-3*

**Not:** Bu kural prototipte uygulanmadı (tek kayıtla kademe veriyor).
Gerçek MVP'de `verifiedSessions[]` ile gelecek — bkz. `17_Database`.

---

## 18.4 · Boss savaşı **[KESİN]**

```
boss_HP   = 100 × (1 − ilerleme)
ilerleme  = min(1, mevcut_en_iyi / bronz_hedef)
```

Mekanik olarak normal node ile aynı; **sunum** farklı. Tamamen psikolojik.

Ama vizyon notlarının haklı olduğu yer tam burası: bir hedefi "boss" diye
adlandırmak motivasyonu ölçülebilir biçimde değiştiriyor. Maliyeti sıfır,
etkisi yüksek — Feature Gravity testinden geçen nadir özellik.

**[BRAINSTORM]** Boss AI: her seansın HP'yi düşürdüğünü göstermek yerine,
boss'un "karşılık vermesi" (uzun ara verilince HP yenilenmesi). Reddedilmeye
yakın — M-3 ile gerilim yaratıyor, ceza mekaniği.

---

## 18.5 · Seri (Streak) **[KESİN]**

```
seri            = kesintisiz haftalık hedefi tutulan hafta sayısı
haftalık hedef  = 4 antrenman (kullanıcı ayarlayabilir)
```

Seri **haftalık, günlük değil.**

*Gerekçe:* Günlük seri dinlenme gününü cezalandırır ve aşırı antrenmanı
ödüllendirir. Bu kullanıcı sağlığına zarar veren bir oyunlaştırma
kalıbıdır ve bilinçli olarak reddedilmiştir. *Kaynak: M-3, FP-2*

**Deload haftası seriyi kırmaz.** `recovery` kategorisi tamamlandıysa
hafta geçerli sayılır.

---

## 18.6 · Denge Puanı **[KESİN]**

```
kazanılan_pay_i = kazanılan_XP_i / toplam_kazanılan_XP
beklenen_pay_i  = kategoride_mevcut_XP_i / toplam_mevcut_XP
sapma           = Σ | kazanılan_pay_i − beklenen_pay_i |
denge           = 100 × (1 − sapma / 2)
```

Bir kategoride yığılmayı görünür kılar. Kalistenikte en sık sakatlık nedeni
push/pull dengesizliğidir; ölçmek uyarmanın ilk adımı.

### Bu formül bir hatanın düzeltilmiş halidir
İlk tanım "her kategori eşit pay almalı" (1/N) diyordu. Ama Pull ağacında
43, Explosive'de 8 hareket var — eşit pay beklemek Pull'da **doğru şekilde**
ilerleyen kullanıcıyı cezalandırıyordu.

Simülasyonda her hareket bronza çıkarıldığında puan 100 değil **62** geldi.
Bu, formülün yanlış olduğunun kanıtıydı. Yeni tanımla: her şey
tamamlandığında **96-100**, tek dalda yığıldığında düşük.

*Bu, `M-8` (söylemeden önce test) kuralının işe yaradığı ilk vaka.*
*Kayıt: `29_DecisionHistory`, D-016.*

---

## 18.7 · Günlük görevler **[TASARIM]**

Her gün 3 görev, **kurallı** üretilir (rastgele değil):

| # | Kural | Amacı |
|---|---|---|
| 1 | **Aktif progression** — bronza en yakın kilitli/açık node | İlerleme |
| 2 | **En zayıf kategori** — denge puanına göre en geride kalan kategoriden açık bir node | Dengeleme |
| 3 | **Bakım** — bir mobilite veya aksesuar node'u | Sakatlık önleme |

*Gerekçe:* Rastgele görev "bugün ne çıkarsa" hissi verir. Kurallı görev
zayıf halkayı kapatır. *Kaynak: FP-5*

**[TASARIM]** Haftalık görev: bir boss'a odaklı 3 seans.
**[TASARIM]** Aylık meydan okuma: bir kategoride belirli sayıda kademe atlama.

---

## 18.8 · Ascension Score **[TASARIM]**

XP "ne kadar yaptığını" gösterir. Ascension Score "ne kadar geliştiğini"
gösterir. Altı eksende tek puan:

```
Strength     = güç kategorilerindeki (push/vpush/pull/dips/legs) mastery ortalaması
Mobility     = mobility kategorisi + kapı hareketlerinin kademesi
Balance      = balance kategorisi
Control      = statik holdler (lever, planche, l-sit) kademesi
Recovery     = recovery node'ları + deload düzenliliği
Consistency  = son 12 haftada haftalık hedefi tutma oranı

Ascension = ağırlıklı ortalama, her eksen 0-100
```

**Neden ayrı bir puan:** XP birikimlidir, düşmez. Ascension Score
**düşebilir** — 6 hafta antrenman yapmazsan Consistency düşer, Recovery
düşer. Bu, mevcut durumu gösteren tek sayı.

**[RESEARCH]** Ağırlıklar ne olmalı? Eşit mi, Consistency daha ağır mı?

---

## 18.9 · Unvanlar (Titles) **[TASARIM]**

Unvanlar başarıya değil, **karakterine** verilir:

| Unvan | Koşul |
|---|---|
| *Temelci* | 10 tier-0/1 node master |
| *Askıda Kalan* | Tüm grip ailesi altın |
| *Baş Aşağı* | Freestanding handstand 60 sn |
| *Sabırlı* | Bir node'da 12+ hafta çalışıp master |
| *Dengeli* | Denge puanı 12 hafta boyunca 80+ |
| *Deloadçu* | 6 deload haftası tamamlandı |
| *Zincir Kırıcı* | Bir boss'un tüm ata zincirini master |
| *Mobilite Delisi* | Tüm mobilite node'ları altın |

**Tasarım niyeti:** Unvanların yarısı **güç değil, disiplin** ödüllendirir
(*Sabırlı*, *Dengeli*, *Deloadçu*). Bu, M-3'ün pozitif tarafı: sadece
"yasak" koymuyoruz, doğru davranışı ödüllendiriyoruz.

---

## 18.10 · Skill GPS **[KESİN — uygulandı]**

Bir hedef seçilir, sistem o hedefe giden **tüm ata zincirini** vurgular.

```
Front Lever seçildi
→ 15 ön hareket · ağaç derinliği 10
→ Zincir: Passive Hang → Active Hang → Scapular → Negative Pull-up
          → Chin-up → Pull-up → (+ Dead Bug + Plank → Hollow Hold)
          → Tuck FL → Adv Tuck → One Leg → Straddle → FRONT LEVER
```

Bu, vizyon notlarındaki "Reverse Skill Engine" fikrinin uygulanmış hali.
Prototipte çalışıyor.

---

## 18.11 · Seans Nesnesi **[TASARIM]** ⭐ v2.0'da eklendi

### Neden — v1.0'ın en büyük boşluğu

v1.0'da güzel bir **harita** vardı. Ama harita, önümüzdeki 45 dakikada ne
yapacağını söylemez.

Salı akşamı 19:00, uygulamayı açtın. Ne görüyorsun? v1.0'da cevap yoktu.
182 erişilebilir node'un göründüğü bir ağaç — bu yardım değil, felç.

Sorunun kökü şu: **veri modeli hareket-merkezli, antrenman ise
seans-merkezli.** İki model arasında köprü yoktu.

### Seans yapısı **[TASARIM]**

```
SEANS (45-60 dk)
├── 1. Isınma            5-8 dk   · mobilite node'ları, eklem hazırlığı
├── 2. Beceri çalışması  10-15 dk · DİNLENMİŞKEN. Handstand, denge, teknik
├── 3. Ana iş            20-25 dk · aktif kadrodaki güç node'ları
├── 4. Aksesuar          5-10 dk  · zayıf halka, tek taraflı, core
└── 5. Soğuma            5 dk     · esneme, nefes
```

### Kural: sıra tesadüfi değil **[KESİN]**

Beceri çalışması (handstand, denge, lever) **yorgunluktan önce** gelir.
Yorgun sinir sistemiyle denge çalışmak hem işe yaramaz hem risklidir.

Bu, veri modeline yeni bir alan gerektiriyor: her node'un seans içinde
**hangi bloğa ait olduğu**.

```
sessionBlock: "warmup" | "skill" | "strength" | "accessory" | "cooldown"
```

**[TODO]** 196 hareketin tamamına `sessionBlock` atanmalı. Çoğu kategoriden
türetilebilir (mobility→warmup, balance→skill, elite statik→skill,
push/pull/legs→strength) ama elle gözden geçirilmeli.

### 4 günlük hafta şablonu **[TASARIM]**

| Gün | Odak | Beceri bloğu | Ana iş |
|---|---|---|---|
| 1 | Push | Handstand | Push + Vertical Push |
| 2 | Pull | Front/Back lever | Pull + Grip |
| 3 | Legs + Core | Denge (frog/crow) | Legs + Core |
| 4 | Karma | Handstand | Zayıf kategori + kondisyon |

Bu şablon **öneri**, zorunluluk değil. *Kaynak: `07_NonGoals` — program
yazılımı değiliz.*

### Açık Sorular
- **[RESEARCH]** Seans süresi kullanıcıdan mı alınır, node sayısından mı
  tahmin edilir?
- **[RESEARCH]** Bir node aynı hafta kaç kez tekrarlanmalı? Beceri için
  sıklık (günde kısa), güç için toparlanma (48 saat) gerekiyor — çelişki.

---

## 18.12 · SKILL SLOT — rol tabanlı kadro **[TASARIM]** ⭐⭐ v2.1'de yeniden tasarlandı

> **v2.0'daki tasarım yanlıştı.** "8 serbest slot" diye modellemiştim:
> kullanıcı 8 hareket seçer, hepsi eşit statüde. Kurucu daha iyi bir model
> getirdi ve o model doğru: **slotların rolü var, hareketler roller
> arasında dolaşıyor.**

### Model

Her ağaçta **4 slot** var ve slotlar **rol**, hareket değil:

```
1. MAIN SKILL       — ana iş. Ağaçta ilerleyen hareket
2. SECONDARY SKILL  — hacim. Genelde eski Main
3. TECHNIQUE SKILL  — beceri/motor öğrenme. Az tekrar, taze yapılır
4. FINISHER         — kapasite. Yüksek tekrar, seansı kapatır
```

Zaman içinde hareketler **yukarı kayar**, slot yapısı sabit kalır:

```
                MAIN            SECONDARY      TECHNIQUE     FINISHER
Ay 1    Normal Push-up      Incline         Scapular      Normal (yüksek tekrar)
Ay 2    Diamond             Normal          Pike          Normal
Ay 3    Pseudo Planche      Diamond         Pike          Normal
Ay 4    Pike Push-up        Pseudo Planche  Wall Walk     Diamond
Ay 5    Elevated Pike       Pike            Wall Handstand Normal
Ay 6    Wall HSPU           Elevated Pike   Handstand     Pike
```

**Normal şınav hiçbir zaman gitmiyor. Rolü değişiyor.** Bu psikolojik
olarak kritik: kazandığın şeyi kaybetmiyorsun, terfi ettiriyorsun.

### Neden bu model doğru — 4 slot 4 farklı NİTELİK

Slotların asıl anlamı "4 egzersiz" değil, **4 antrenman niteliği**:

| Slot | Nitelik | Hedef | Tekrar aralığı |
|---|---|---|---|
| Main | **Yoğunluk / beceri ilerlemesi** | Ağaçta bir üst basamak | 3-8 |
| Secondary | **Hacim / hipertrofi** | Kas ve dayanıklılık | 8-15 |
| Technique | **Motor öğrenme** | Sinir sistemi, koordinasyon | 3-6, taze |
| Finisher | **Kapasite** | Metabolik, yüksek tekrar | 15+ |

Bu, "Volume RPG vs Skill Tree" tartışmasının **çözümü**. İkisini seçmek
zorunda değilsin:

- **Volume RPG hatası:** sadece tekrar artırmak. 6 ay sonra 45 şınav
  çekersin ama ilk pike şınavda zorlanırsın.
- **Saf skill tree hatası:** sürekli yeni harekete atlamak. Hacim
  kaybedersin, temel erir.
- **Doğrusu:** hacim `Secondary` ve `Finisher` slotlarında yaşar, beceri
  `Main`'de ilerler. Hareket rol değiştirdikçe hem hacmi hem beceriyi
  korursun.

### Kurallar **[TASARIM]**

**S-1 · Terfi mastery ile olur, takvimle olmaz.**
Kurucunun taslağı "ay 1, ay 2" diyordu. Takvim keyfi. Doğrusu: **Main,
ALTIN kademeye ulaşınca terfi eder.** Eski Main → Secondary'ye iner,
ağaçtaki bir üst node Main olur.
*Gerekçe: sistemde zaten mastery var (`18.3`); ikinci bir zaman ölçüsü
uydurmak gereksiz. Ve bazı insan 3 haftada, bazısı 3 ayda geçer.*

**S-2 · Slot şablonu ağaca göre değişir.** 4 slot her ağaç için doğru değil:

| Ağaç | Slot yapısı |
|---|---|
| Push · Pull · Legs | Main · Secondary · Technique · Finisher (4) |
| Core | Main · Secondary (2) — technique/finisher anlamsız |
| Balance | Technique · Technique (2) — hepsi beceri işi, hacim yok |
| Mobility | tek sürekli slot — rotasyon yok, her gün aynı |
| Conditioning | Main · Finisher (2) — ip kendi progression'ında |
| Recovery | slot yok — takvim işi |

**S-3 · Slot ≠ seans. Slotlar günlere dağıtılır.**
Push 4 + Pull 4 + Legs 4 + Core 2 = 14 slot. 14 hareketi her seans
yapamazsın. Slotlar **hafta içine** dağıtılır:

```
Gün 1  Push (4 slot) + Core (1)
Gün 2  Pull (4 slot) + Legs (2)
Gün 3  Balance (2) + Mobility + hafif Push Finisher
Gün 4  Pull (2) + Legs (2) + Core (1) + Conditioning
```

**S-4 · Seans içi sıra rol hiyerarşisi DEĞİL.**
Rol sırası `Main → Secondary → Technique → Finisher` ama seans sırası
farklı:

```
SEANS SIRASI:  Technique → Main → Secondary → Finisher
```
Technique taze sinir sistemiyle yapılır, yorulunca öğrenme olmaz.
*Kaynak: `18.11` Seans Nesnesi — beceri bloğu yorgunluktan önce gelir.*

**S-5 · Finisher tanımı:** eski, hakim olunan bir hareketin yüksek tekrarlı
seti. **Maksimum denemesi değil.** Amaç kapasite ve kan akışı, rekor değil.

**S-6 · Aktif hareket sayısı üst sınırı ~14-16.** Slot şablonları bunu
zaten sağlıyor. Kullanıcı elle slot ekleyemez.

### Bu neyi çözüyor

- **Seçim felci:** 197 node yerine 14 slot
- **"Ne kadar yapacağım" sorusu:** slot rolü tekrar aralığını belirliyor
- **Temel kaybı korkusu:** hareket silinmiyor, rolü değişiyor
- **Terfi anı:** Main'in yükselmesi görünür bir olay — oyunun en iyi
  ödül anı. `18.4` Boss mekaniğinden daha güçlü, çünkü her ay oluyor

### Açık Sorular
- **[RESEARCH]** Terfi eşiği ALTIN mı, GÜMÜŞ mü? Altın yavaş olabilir.
- **[RESEARCH]** Aynı hareket iki ağaçta slot tutabilir mi? (Pike şınav
  hem Push hem Balance'ta) Şu anki görüş: hayır, tek yerde sayılır.
- **[RESEARCH]** Kullanıcı terfiyi reddedebilir mi ("henüz hazır
  değilim")? Muhtemelen evet — ama kaydı tutulmalı.

---

## 18.19 · PROGRESSION PLANNER **[TASARIM]** ⭐⭐ v2.1'de eklendi

> Projenin en büyük eksiği buydu ve kurucu buldu:
>
> **"Ağaç nereye gideceğini söylüyor. Planner yarın tam olarak ne
> yapacağını söylüyor."**

### Neden — ağaç tek başına yetmiyor

`18.11`'de "günlük kullanım döngüsü tanımsız" demiştim ama çözümü
eksik kurmuştum. Eksik olan katman şu:

```
SKILL TREE      → nereye gidebilirim          (harita)
SKILL GPS       → oraya giden yol nedir       (rota)   ✓ çalışıyor
SKILL SLOT      → şu an hangi 14 hareket      (kadro)  ✓ tasarlandı
PROGRESSION PLANNER → önümüzdeki 6 hafta ne   (plan)   ← EKSİKTİ
SEANS NESNESİ   → bugün 45 dakikada ne        (gün)
```

### Girdi → Çıktı

```
GİRDİ
  hedef skill            (örn. Handstand Push-up)
  mevcut mastery durumu  (hangi node hangi kademede)
  ekipman                (elindekiler)
  kısıtlar               (el/bilek/omuz, clearedByProfessional)
  haftalık gün sayısı    (4)
  seans süresi           (45 dk)

ÇIKTI
  6 haftalık slot ataması
  her ağaç için: Main / Secondary / Technique / Finisher
  günlere dağılım
  her slot için tekrar aralığı ve RIR
  terfi koşulu: "Main altına ulaşınca X'e geç"
```

### Kritik: bu deterministik, LLM gerektirmiyor

Graf zaten var. Mastery durumu zaten var. Slot şablonları kural.
Yani planner **hesaplanabilir bir fonksiyon**, üretken bir model değil.

```
1. Hedeften geriye ata zincirini çıkar        (ancestors — mevcut kod)
2. Zincirde ilk "bronz değil" node'u bul      → Main adayı
3. Main'in ön koşulları eksikse onlar Main    → sıra otomatik düzelir
4. Bir alt node (bronz+, altın değil)         → Secondary
5. Aynı ağaçta beceri niteliği olan node      → Technique
6. En düşük tier'da master olunmuş node       → Finisher
7. Kısıt filtresi uygula (handLoad, wristLoad, ekipman)
8. Slot şablonuna göre günlere dağıt
```

Bu `13_AIArchitecture` D-022 ile uyumlu: Faz 3 LLM'siz. LLM sadece
**açıklama** üretiminde kullanılır (Faz 4+), kararda değil.

### Bu, ürünün en güçlü özelliği olabilir

Uygulama şunu **demeyecek**:
> ❌ "Bugün şınav yap."

Şunu diyecek:
> ✅ "Push ağacında ana skill artık Pseudo Planche Push-up. Normal şınav
> Finisher statüsüne geçti. Bu hafta 3 gün, Main 3×6 (RIR 2)."

Ağaç mantığını gerçek antrenmana çeviren şey bu cümle.

### Kurallar **[TASARIM]**

1. **Planner öneri verir, zorlamaz.** Kullanıcı slotu değiştirebilir ama
   kayıt tutulur.
2. **6 hafta ufku.** Daha uzun plan gerçekle çatışır, daha kısa plan
   ilerleme hissi vermez.
3. **Her hafta yeniden hesaplanır.** Kayıtlar geldikçe plan güncellenir —
   `18.13` uyarlama kuralı planner'ı besler.
4. **Kısıtlar plandan önce uygulanır.** Yasak hareket plana hiç girmez.

### Açık Sorular
- **[RESEARCH]** Kullanıcı birden fazla hedef koyarsa (HSPU + Muscle-up +
  İp) planner çatışan slotları nasıl böler?
- **[RESEARCH]** 6 hafta doğru ufuk mu?
- **[RESEARCH]** Technique slotu için "beceri niteliği" nasıl otomatik
  belirlenir? `sessionBlock: skill` etiketi yeterli mi?

---

## 18.20 · Diğer sistemler

---

## 18.13 · Node İçi İlerleme **[TASARIM]** ⭐ v2.0'da eklendi

### Neden — plato problemi

v1.0 ağacı yalnızca **node'lar arası** ilerlemeyi modelliyordu. Ama
insanın gerçek deneyimi şu: *pull-up'ta 3 aydır 7 tekrarda takılıyım.*

Bu en yaygın deneyim ve **en olası bırakma anı.** v1.0 bu durumda hiçbir
şey söylemiyordu — "eşiğe ulaş" diyordu, o kadar.

Bu doğrudan **Mastery Before Difficulty** ilkesinin gereği: zorluğu
artırmadan önce mevcut hareketi ustalaşmak. Ama "ustalaşmak"ın sayı
artırmaktan başka yolu tanımlanmamıştı.

### Yoğunluk eksenleri **[TASARIM]**

Aynı hareket, daha zor — 5 eksen:

| Eksen | Örnek | Ne kazandırır |
|---|---|---|
| **Tempo** | 3-1-3 (3 sn in, 1 sn dur, 3 sn çık) | Zaman altında gerilim, form |
| **Duraklama** | Altta 2 sn bekle | Ölü noktadan güç, kontrol |
| **Hareket açıklığı** | Deficit push-up, tam ROM pull-up | Kuvvet aralığı genişler |
| **Ağırlık** | Yelek, kemer | Doğrudan yük artışı |
| **Hacim/yoğunluk** | Set sayısı, dinlenme kısaltma | Kapasite |

### Mekanik **[TASARIM]**

```
Her node'un bir "yoğunluk seviyesi" olur (0-4).
Mastery hedefi = temel eşik × yoğunluk çarpanı

Örnek — Pull-up:
  Yoğunluk 0 (normal tempo)  bronz 3  gümüş 8  altın 12  master 20
  Yoğunluk 1 (3-0-3 tempo)   bronz 2  gümüş 5  altın 8   master 12
  Yoğunluk 2 (2 sn duraklama) ...
```

Takılan kullanıcıya sistem şunu der:
> *"7 tekrarda 5 haftadır sabitsin. Tekrar artırmayı bırak — aynı hareketi
> 3-1-3 tempoda 4 tekrar yap. Bu da ilerlemedir ve XP verir."*

Bu, tempoyu reçeteye yazmanın ikinci faydasını da getirir: **hile
zorlaşır.** "15 push-up" kandırılabilir bir sayıdır; "3-1-3 tempoda 8
push-up" kandırılamaz.

### Açık Sorular
- **[RESEARCH]** Yoğunluk çarpanları ne olmalı? Tempo 3-1-3, normal
  tempoya göre kabaca %60 tekrar demek — doğrulanmalı.
- **[RESEARCH]** Yoğunluk kullanıcı seçimi mi, sistem önerisi mi?
- **[RESEARCH]** Yoğunluk XP'yi nasıl etkiler? Aynı XP mi, çarpan mı?

---

## 18.14 · Ranks **[TASARIM]** ⭐ v2.0'da eklendi

> `MASTER_PROMPT.txt` ve `GAMEPLAY_RULES.txt`'te "Player Titles" ve
> "Ranks" **ayrı** sistemler olarak listelenmiş. v1.0 ikisini birleştirip
> Ranks'i kaybetmişti. Geri kondu.

### Titles ve Ranks farkı **[KESİN]**

| | Titles (Unvanlar) | Ranks (Rütbeler) |
|---|---|---|
| Neyi ölçer | **Karakter** — nasıl çalıştığın | **Seviye** — nerede olduğun |
| Nasıl kazanılır | Belirli koşullar (bkz. `18.9`) | Genel ilerleme eşiği |
| Kaç tane olur | Çok, biriktirilir | Tek, o an geçerli olan |
| Örnek | *Sabırlı*, *Deloadçu*, *Dengeli* | *Intermediate III* |

### Rütbe merdiveni **[TASARIM]**

Rütbe, `19_SkillTrees`'teki Beginner→Legendary haritasının oyunlaştırılmış
hali. Her aşamanın 3 alt kademesi var:

```
Beginner      I · II · III
Novice        I · II · III
Intermediate  I · II · III
Advanced      I · II · III
Elite         I · II · III
Legendary     I · II · III
```

**Rütbe hesabı [TASARIM]:** oyuncunun mastery'ye ulaştığı node'ların
**tier dağılımının medyanı** — ortalama değil.

*Gerekçe:* Ortalama, tek bir yüksek tier node ile şişirilebilir. Medyan
"genel olarak nerede olduğunu" gösterir. Bir tane tuck front lever
yapabilmek seni Advanced yapmaz.

### Rütbe düşer mi?
**[RESEARCH]** Ascension Score düşebiliyor. Rütbe de düşmeli mi? Düşerse
dürüst ama cezalandırıcı (M-3 gerilimi). Şu anki eğilim: **rütbe düşmez,
Ascension Score düşer.** Rütbe "ulaştığın en yüksek nokta", Ascension
"şu anki halin".

---

## 18.15 · Knowledge XP **[TASARIM]** ⭐ v2.0'da eklendi

> `FUTURE_IDEAS`'ta listelenmişti, v1.0'da atlanmıştı.

### Fikir
Öğrenmek de ilerlemedir. Bir hareketin ipuçlarını, sık hatalarını,
hikayesini okumak küçük miktarda XP verir.

### Neden mantıklı
`FP-5`: **sıra bilgisi, çabadan değerlidir.** Proje zaten "bilgi satıyor".
O halde bilgiyi tüketmek de ödüllendirilmeli.

Pratik faydası: sakatlık veya ara dönemlerinde sistemle bağ kopmaz.
Antrenman yapamadığın hafta bile ilerleyebilirsin — ki bu **ara vermiş
kullanıcı** için (birincil profil) doğrudan değerli.

### Kurallar **[TASARIM]**
1. Knowledge XP toplam XP'nin **%5'ini geçemez.** Okumak yapmanın yerine
   geçmez. *Kaynak: Quality Before Quantity*
2. Aynı içerik bir kez XP verir.
3. Kilit açmaz — sadece XP. *Kaynak: M-1*

---

## 18.16 · Comeback Modeli **[TASARIM]** ⭐ v2.0'da eklendi

### Neden — birincil kullanıcı profili bu

Kurucu **ara vermiş** biri. "Benim gibi insanlar" da öyle. Yani bu, kenar
durum değil, **ana senaryo.**

### Modellenmesi gereken üç gerçek

**1. Geri kazanım ilk kazanımdan hızlıdır.**
Kas hafızası gerçek bir olgudur. Sistem bunu bilmezse ilk 6-8 hafta
sürekli "beklenenden hızlı" ilerleme olur, eşikler anlamsızlaşır ve
kullanıcı sistemin kendisine güvenmez.

**2. Sinir sistemi hatırlar, tendon hatırlamaz.**
Eski performansa hızlı dönüş sakatlığın en yaygın nedenidir. Sistemin
frenlemesi gereken tek yer tam olarak burasıdır. *Kaynak: FP-2*

**3. Ara verme tekrar olabilir.** Hayat araya girer. Sistem "3 ay
kaybettin" demek yerine "kaldığın yer burası" demeli.

### Mekanik **[TASARIM]**

```
Yerleştirmede "ara verdim" seçilirse:
  → İlk 8 hafta "Geri Dönüş Dönemi" olarak işaretlenir
  → Bu dönemde hacim tavanı uygulanır (öneri, zorlama değil)
  → Eşik atlamaları "geri kazanım" olarak etiketlenir, ayrı gösterilir
  → 8 hafta sonunda normal moda geçilir

Uzun ara (>6 hafta kayıt yok) tespit edilirse:
  → Sistem sormaz, sadece "geri dönüş" modunu ÖNERİR
  → Mastery kademeleri SİLİNMEZ, "doğrulanmamış" işaretlenir
  → Yeniden doğrulanana kadar rozetler soluk gösterilir
```

Son madde önemli: **mastery silinmiyor, askıya alınıyor.** Bu, dürüstlük
ile cezalandırma arasındaki dengeyi tutuyor. Kazandığın şey senin, ama
"şu an yapabiliyor musun" sorusu ayrı bir soru.

### Açık Sorular
- **[RESEARCH]** Kaç haftalık kayıtsızlık "ara" sayılır? 6 hafta tahmin.
- **[RESEARCH]** Geri kazanım eşiklerde ayrı gösterilmeli mi, yoksa bu
  gereksiz karmaşa mı?

---

## 18.17 · Yerleştirme (Placement) **[TASARIM]** ⭐ v2.0'da eklendi

### Neden
23 kök node var. Bu hafta hangi 8'ini yapacaksın? v1.0'da cevap yoktu.
Ve **Beginner First** ilkesi tam olarak bunu gerektiriyor: sistem yeni
gelene "kolay gel" demeli, 196 node'u yüzüne fırlatmamalı.

Ara vermiş kullanıcı için daha da kritik: wall push-up'tan başlatmak hem
yanlış hem moral bozucu.

### Mekanik **[TASARIM]**

Kısa bir **test seansı** — 6-8 hareket, 15 dakika:

```
1. Push-up          → maksimum temiz tekrar
2. Aktif askı       → maksimum süre
3. Australian row   → maksimum tekrar
4. Bodyweight squat → maksimum tekrar
5. Plank / Hollow   → maksimum süre
6. Duvar handstand  → deneyebiliyor musun?
7. Omuz/bilek mobilite kontrolü
```

Sonuç → her kategoride bir giriş noktası + ilk aktif kadro (8 node)
otomatik doldurulur.

### Kurallar **[TASARIM]**
1. Test **kilit açmaz**, sadece başlangıç noktası belirler. Ön koşul
   zinciri geçerliliğini korur — sistem sadece zincirin *başını*
   otomatik doğrulanmış sayar. *Kaynak: M-1*
2. Test atlanabilir. Atlanırsa en baştan başlanır.
3. Test tekrarlanabilir (comeback sonrası).

### Açık Sorular
- **[RESEARCH]** Test sonucu ön koşulları otomatik "bronz" saymalı mı?
  M-1 ile gerilim var. Aday çözüm: sayar ama "test ile doğrulandı"
  etiketiyle, ilk gerçek kayıtta güncellenir.

---

## 18.18 · Diğer sistemler

| Sistem | Durum | Not |
|---|---|---|
| **Automatic Progression** | **[TASARIM]** Faz 3 | `AI_BRIEF`'te listelenmişti, v1.0'da atlanmıştı. Eşik tutulduğunda sistem sıradaki adımı *önerir* — otomatik geçirmez. **Kilit açmayı otomatikleştirmez** (`M-1`); sadece "hazırsın, kadroya alalım mı?" der. Aktif kadro (`18.12`) ile birlikte çalışır |
| Achievements | **[TASARIM]** Faz 2 | Unvanlardan ayrı, tek seferlik olaylar |
| World Map / Progress Map | **[KESİN]** Skill tree'nin kendisi bu | Ayrı bir harita gereksiz |
| Statistics Dashboard | **[TASARIM]** Faz 2 | Kategori dağılımı, zaman serisi, PR listesi |
| Timeline | **[TASARIM]** Faz 2 | "6 ay önce bugün: ilk pull-up" |
| Heatmap | **[TASARIM]** Faz 2 | Antrenman sıklığı takvimi |
| Personal Records | **[TASARIM]** Faz 2 | En iyi değerler, kırılma tarihleri |
| Hall of Fame | **[TASARIM]** Faz 2 | Kendi kilometre taşları (başkaları değil — M-5) |
| Collections | **[TASARIM]** Faz 2 | Kategori tamamlama yüzdeleri |
| Global Completion | **[TASARIM]** Faz 2 | 196 node'un kaçı hangi kademede |
| Patch Notes | **[TASARIM]** Faz 2 | Veri güncellemeleri kullanıcıya gösterilir |
| Unknown Skills | **[TASARIM]** Faz 2 | Gizli node'lar, keşfedilince açılır |
| Seasons | **[TASARIM]** Faz 5 | 3 aylık tematik hedefler |
| Prestige / New Game+ | **[RED]** | Fiziksel güç sıfırlanmaz — bkz. `27_IdeaVault` |
| Leaderboard | **[RED]** | M-5 ihlali |
| Inventory | **[RED]** | Ekipman zaten node alanı |

## Bağlantılar

- `11_SkillGenome` — Skill Radar'ın veri kaynağı
- `13_AIArchitecture` — öneri motorları
- `27_IdeaVault` — reddedilen mekanikler ve gerekçeleri

## Açık Sorular

- **[RESEARCH]** XP sadece mastery kademesinde veriliyor. Kademe atlamak
  haftalar sürebiliyor — arada hiç geri bildirim olmaması motivasyon
  boşluğu yaratır mı? Aday çözüm: "kademeye %80 yaklaştın" göstergesi
  (XP değil, ilerleme çubuğu).
- **[RESEARCH]** Seviye 100 tavanı doğru mu? Master her hareket = gerçekçi
  değil. Tavan daha düşük mü olmalı, yoksa 100 ulaşılamaz kalması iyi mi?

---
---

# 🤖 PART 5 — AI

---

<a name="14_aicouncil"></a>
# 14 · AI COUNCIL

## Fikir **[TASARIM]**

Projeyi bir AI geliştiriyor. Ama "AI" tek bir şey değil — farklı sorular
farklı bakış açısı gerektirir. AI Council, aynı AI'ın **ayrı ayrı
çağrılabilen rolleri.**

Vizyon notlarında bu fikir isim olarak vardı; burada tanımı yapılıyor.

## Roller

### 🏛 Architect
**Sorusu:** "Bu, 10 yıl sonra hâlâ ayakta durur mu?"
**Yetkisi:** Katman ihlallerini reddeder. Veri şeması değişikliklerini
inceler. `16_Architecture` sahibidir.
**Ne zaman çağrılır:** Yeni sistem eklenirken, şema değişirken.

### 🏋️ Coach
**Sorusu:** "Bu progression fizyolojik olarak doğru mu?"
**Yetkisi:** Ön koşul zincirlerini, mastery eşiklerini, mobilite kapılarını
belirler. `19_SkillTrees` ve `20_MovementList` sahibidir.
**Ne zaman çağrılır:** Hareket eklenirken, eşik değişirken.
**Sınırı:** Sakatlık teşhisi yapmaz, tedavi önermez.

### 🎮 Game Designer
**Sorusu:** "Bu, oynanabilir mi ve doğru davranışı ödüllendiriyor mu?"
**Yetkisi:** XP/mastery/görev/unvan mekanikleri. `18_GameSystems` sahibi.
**Sınırı:** M-3'ü ihlal eden mekanik öneremez.

### 📊 Data Steward
**Sorusu:** "Bu veri tutarlı mı?"
**Yetkisi:** `build_db.py` doğrulayıcısı. 0 hata vermeyen değişikliği
reddeder. `10_MovementDatabase` sahibi.

### 🛡 Red Team
**Sorusu:** "Bu neden kötü bir fikir?"
**Yetkisi:** Her yeni özelliğe karşı argüman üretmek **zorundadır.**
Delete Test'i uygular. Onay vermez, sadece itiraz eder.
**Neden var:** Kurucu kendi fikrini objektif değerlendiremez
(bkz. `08_Philosophy` açık sorusu).

### 📝 Scribe
**Sorusu:** "Bu belgede yazılı mı?"
**Yetkisi:** `_CHECKPOINT.txt` ve bu dosyayı güncel tutar. Belgelenmemiş
kararı "yapılmamış" sayar. Canon Review'ı uygular.

### 🔬 Scientist
**Sorusu:** "Bunun kanıtı ne?"
**Yetkisi:** `21_Research` kurallarını uygular. Kaynaksız iddiaları
`[RESEARCH]` olarak işaretler.

## Kurallar **[KESİN]**

1. **Roller aynı anda konuşmaz.** Bir soru bir role sorulur.
2. **Red Team her özellik için çağrılır.** İstisna yok.
3. **Scribe son konuşur.** Karar belgelenmeden oturum bitmez.
4. **Coach ve Game Designer çatışırsa Coach kazanır.** *Gerekçe: M-3.*
5. **Architect ve Game Designer çatışırsa Architect kazanır.**
   *Gerekçe: FP-7 — veri koddan uzun yaşar.*

## Bağlantılar

- `15_Governance` — rollerin denetim mekanizması
- `08_Philosophy` — karar prensipleri
- `29_DecisionHistory` — kararların kaydı

## Açık Sorular

- **[RESEARCH]** Bu roller gerçekten ayrı çağrılmalı mı, yoksa tek bir
  AI'a "şu açılardan bak" demek yeterli mi? Ayrı çağırmak daha iyi sonuç
  veriyor gibi görünüyor ama ölçülmedi.

---

<a name="15_governance"></a>
# 15 · GOVERNANCE

## Neden yönetişim?

FP-9: kapsam, yetenekten daha sık öldürür. Yönetişim bu projede
bürokrasi değil, **hayatta kalma mekanizması.**

## Değişiklik kapıları **[KESİN]**

### Veri değişikliği
```
1. build/movements_data.py düzenlenir  (JSON ASLA elle düzenlenmez)
2. python3 build_db.py                 → 0 hata vermeli
3. python3 make_layout.py              → yerleşim yenilenir
4. node test_prototype.js              → 61/61 geçmeli
5. _CHECKPOINT.txt güncellenir
```
Herhangi bir adım başarısızsa değişiklik **kabul edilmez.**

### Özellik ekleme
```
1. Kapsam kapısı 4 sorusu (07_NonGoals)
2. Red Team itirazı alınır
3. Hangi anayasa maddesiyle ilişkili kontrol edilir
4. 27_IdeaVault'a tasnif edilerek yazılır
5. Faz atanır
```

### Anayasa değişikliği
```
1. Hangi First Principle'ın yanlış olduğu gösterilir
2. 29_DecisionHistory'ye gerekçeli kayıt
3. Etkilenen tüm bölümler güncellenir
4. Madde silinmez, "yürürlükten kaldırıldı" işaretlenir
```

## Değişmez kurallar **[KESİN]**

| Kural | Tanım |
|---|---|
| **Tree Integrity** | Her veri değişikliğinden sonra doğrulayıcı 0 hata vermeli |
| **No Orphan Rule** | Hiçbir node bağlantısız kalamaz (kök ve aksesuar hariç) |
| **Single Source of Truth** | Aynı bilgi iki yerde tutulmaz |
| **Canon Review** | Yeni bilgi mevcut belgeyle çelişiyor mu kontrol edilir |
| **ID Immutability** | Hareket `id`'leri asla değişmez |
| **Test Before Claim** | "Çalışıyor" demek için test geçmeli |
| **Checkpoint Discipline** | Her oturum `_CHECKPOINT.txt` güncellemesiyle biter |
| **Archive Never Delete** | Reddedilen fikir ve eski karar silinmez, işaretlenir |

## Denetim listesi (periyodik) **[TASARIM]**

Her büyük değişiklikte veya ayda bir:

- [ ] Doğrulayıcı 0 hata / 0 uyarı veriyor mu?
- [ ] Testler geçiyor mu?
- [ ] Belgede `[TODO]` işaretli kalemler hâlâ geçerli mi?
- [ ] `30_OpenQuestions`'a yeni soru eklendi mi, eskisi cevaplandı mı?
- [ ] Yeni eklenen özellik `27_IdeaVault`'ta tasnif edildi mi?
- [ ] Belge ile kod çelişiyor mu? (Canon Review)
- [ ] Faz kapısı aşılmadı mı? (Faz 2 işi Faz 1'e sızmadı mı?)

## Bağlantılar

- `14_AICouncil` — kimin neyi denetlediği
- `08_Philosophy` — karar prensipleri
- `24_GitHub` — sürüm kontrolü

## Açık Sorular

- **[RESEARCH]** Bu yönetişim tek kişilik bir proje için fazla ağır mı?
  Karşı argüman: ağırlığın tamamı AI tarafında; kurucuya maliyeti yok.

---

<a name="21_research"></a>
# 21 · RESEARCH

## Bilgi nasıl doğrulanır **[KESİN]**

Bu projede iki tür iddia var ve ikisi farklı muamele görür:

| Tür | Örnek | Doğrulama |
|---|---|---|
| **Yapısal** | "Front lever'ın ön koşulu straddle front lever" | Kalistenik pratiğinde yerleşik; koç yargısı yeterli |
| **Niceliksel** | "Push-up master eşiği 25 tekrar" | Keyfi. `[RESEARCH]` işaretli |

## Kurallar **[KESİN]**

1. **Kaynaksız niceliksel iddia `[RESEARCH]` işaretlenir.** Belgeye
   girebilir ama "kesin" olarak sunulamaz.
2. **Hareket uydurulmaz.** Yeni hareket eklemek için pratiğinde
   karşılığı olması gerekir. *Kaynak: Endless Tree reddi.*
3. **Biyomekanik iddia yapılmaz.** "Şu kas şu açıda şöyle çalışır"
   türü iddialar bu projenin yetki alanı dışında.
4. **Sakatlık tavsiyesi verilmez.** Ağrı durumunda sistem "dur ve
   profesyonele danış" der, teşhis koymaz. *Kaynak: `07_NonGoals`.*
5. **Simülasyon bir doğrulama biçimidir.** Bir formülün doğruluğu
   uç durumlarda test edilir (bkz. denge puanı hatası, D-016).

## Doğrulanması gereken kalemler **[RESEARCH]**

| Konu | Neden belirsiz |
|---|---|
| 196 hareketin mastery eşikleri | Tek kişinin yargısı |
| Skill Genome öznitelik değerleri | Henüz atanmadı |
| XP çarpanları (1.53, 1.6) | Hissel olarak seçildi, oyun dengesi test edilmedi |
| "Elit" tanımı | 5 boss bronz = keyfi |
| Mobilite kapılarının eşikleri | Kaç saniye wrist mobility "yeterli"? |
| ProgressPredictor minimum veri | Kaç haftalık kayıtla tahmin anlamlı? |

## Bağlantılar

- `30_OpenQuestions` — tüm açık soruların merkezi listesi
- `14_AICouncil` — Scientist rolü

---
---

# 📈 PART 6 — PRODUCT

---

<a name="22_roadmap"></a>
# 22 · ROADMAP

## Fazlar **[KESİN]**

| Faz | Kapsam | Bitti ölçütü | Durum |
|---|---|---|---|
| **0 · Veri** | 196 hareket, ön koşul grafı, XP/mastery sayıları, doğrulayıcı | 0 hata 0 uyarı | ✅ Bitti |
| **0.5 · Plan** | Bu dosya. Tüm sistemlerin tanımı | 31 bölüm tamam | ✅ Bitti |
| **1 · MVP** | Skill tree, kayıt, XP/seviye, offline, dışa aktarma | 2 hafta gerçek kullanım | 🔨 Prototip var |
| **2 · Oyun** | Görevler, unvanlar, istatistik, timeline, program üretici | "Tracker" değil "oyun" gibi | ⏳ |
| **3 · Zeka** | Skill Genome, zayıf halka, hazırlık, öneri, tahmin | Öneriler kendi kararlarınla %80 örtüşüyor | ⏳ |
| **4 · Ölçek** | Bulut, çoklu cihaz, mobil paket, antrenör modu | İkinci kullanıcı sıfır destekle kullanıyor | ⏳ |
| **5 · İçerik** | Medya, lore, ayrı ağaçlar, sezonlar, plugin | — | ⏳ |

## Faz kapıları **[KESİN]**

Bir fazın işi bir öncekine **sızmaz.** Faz 2 özelliği Faz 1'e eklenmez,
"küçük bir ekleme" olsa bile. *Gerekçe: FP-9.*

Faz geçişi için bitti ölçütünün karşılanması **ve** `_CHECKPOINT.txt`'in
güncellenmesi gerekir.

## Faz 1 · MVP kapsamı **[KESİN]**

**İçinde:**
- Zoom/pan yapılabilen interaktif skill tree, kategoriye göre renkli
- Node durumları: kilitli / açık / bronz / gümüş / altın / master
- Hareket detay paneli: ön koşullar, ne açar, ipuçları, hatalar, kaslar, ekipman
- Set kaydı ve otomatik mastery değerlendirmesi (**14 gün / 2 seans kuralıyla**)
- XP, seviye, kategori bazlı ilerleme
- Ekipman filtresi
- 4 gün/hafta program görünümü
- Offline çalışma + JSON dışa/içe aktarma

**Dışında (bilinçli):** bulut, hesap, video, AI koç, topluluk, antrenör modu,
prestige, sezonlar.

**Bitti ölçütü:** Kurucu iki hafta boyunca kâğıt/telefon notu kullanmadan
sadece bu sistemle antrenman kaydediyor.

## Tahmini takvim **[BRAINSTORM]**

| Faz | Tahmin | Not |
|---|---|---|
| 1 | 2026 Q3 | Prototip → gerçek MVP |
| 2 | 2026 Q4 – 2027 Q1 | |
| 3 | 2027 | Skill Genome verisi yazımı uzun sürer |
| 4 | 2028 | |
| 5 | 2029+ | |

Tarihler taahhüt değil, ölçek hissi.

## Bağlantılar

- `26_Backlog` — sıradaki somut işler
- `07_NonGoals` — kapsam kapısı
- `28_Timeline` — geçmiş kayıt

---

<a name="23_business"></a>
# 23 · BUSINESS

## Mevcut durum **[KESİN]**

**Bu bir kişisel projedir. Gelir modeli yoktur ve Faz 4'e kadar
düşünülmeyecektir.**

*Gerekçe:* Gelir düşüncesi ürün kararlarını bozar. "Bu özellik satılır mı"
sorusu, "bu özellik işe yarar mı" sorusunun yerini alır. Tek kullanıcı
için çalışan bir şey üretmeden bu soru sorulmaz. *Kaynak: FP-8*

Maliyet yapısı bu kararı destekliyor: statik hosting ücretsiz, backend yok,
LLM çağrısı yok (bkz. `13_AIArchitecture`). Yani **Faz 4'e kadar proje
sıfır maliyetli.**

## Faz 4+ seçenekler **[BRAINSTORM]**

Değerlendirilebilecek modeller, avantaj/dezavantajıyla:

| Model | Artı | Eksi |
|---|---|---|
| **Tamamen ücretsiz + açık kaynak** | Topluluk katkısı, hareket veritabanı zenginleşir | Bakım yükü, kalite kontrolü |
| **Ücretsiz uygulama + ücretli bulut senkron** | Yerel-öncelikli mimariye uyar; ödemeyen kaybetmez | Gelir düşük |
| **Tek seferlik satın alma** | Abonelik baskısı yok, M-6 ile uyumlu | Sürekli gelir yok |
| **Antrenör aboneliği** | Gerçek değer üretilen yer | Faz 4+ gerekli, çok kullanıcılı altyapı |
| **Abonelik (tüketici)** | Yaygın model | Kullanmadığı ay ödeyen kullanıcı = M-3 ile gerilim |

## Reddedilenler **[RED]**

- **Reklam** — M-5/M-3 ile çatışır, dikkat ekonomisi sağlık uygulamasına uymaz
- **Veri satışı** — M-6 ihlali
- **Yapay kısıtlama (pay-to-unlock skill)** — M-1'in doğrudan ihlali;
  kilit fizyolojik olmalı, ticari olamaz

Son madde kritik: **kilit mekaniği asla paraya bağlanamaz.** Bu, projenin
en kolay para kazanma yolu ve aynı zamanda anayasanın en net ihlali olurdu.

## Marketplace / Skill Packs **[BRAINSTORM]**

> `Yeni Metin Belgesi.txt` Part 6 listesinde vardı, v1.0'da atlanmıştı.

Uzak fikir: kullanıcılar veya antrenörler kendi **skill pack**'lerini
(hareket paketi + ağaç dalı) paylaşabilir. Örnek: "Halka Temelleri",
"Ev Antrenmanı — Ekipmansız", "Streetlifting".

Teknik temeli zaten var: `schemaVersion` + Plugin System (`16`) + veri
odaklı mimari. Yani bu, mimari bir değişiklik değil, **bir dağıtım
kanalı.**

**Ama:** ticari bir marketplace `M-1` ile çatışabilir — para ödeyerek
skill açmak yasak. İzin verilen model: paket **içerik** ekler (yeni
hareketler, yeni dal), **kilit satmaz**.

**Karar:** Faz 5'ten önce değerlendirmeye alınmaz. Custom Trees
(`26_Backlog`) bunun ön koşulu.

## Açık kaynak sorusu **[RESEARCH]**

Hareket veritabanı (`movements.json`) açık kaynak olmaya en uygun parça:
topluluk düzeltmesi veri kalitesini artırır. Ama kalite kontrolü kim yapar?
Doğrulayıcı yapısal hataları yakalar, fizyolojik hataları yakalamaz.

Portfolyo hedefi bu soruyu kısmen cevaplıyor: **repo public olmalı**,
yoksa vitrin işlevi görmez. Açık kaynak lisansı ile "public repo" aynı şey
değil — repo görünür olur, katkı kabul etmek ayrı bir karardır.

---

<a name="24_github"></a>
# 24 · GITHUB

## Depo yapısı **[TASARIM]**

```
project-ascend/
├── docs/
│   ├── PROJECT_ASCEND_SECOND_BRAIN.md   ← bu dosya
│   ├── CHECKPOINT.md
│   └── archive/                          ← eski vizyon .txt dosyaları
├── data/
│   ├── movements.json                    ← üretilen, commit edilir
│   └── validation_report.txt
├── build/
│   ├── movements_data.py                 ← elle düzenlenen kaynak
│   ├── build_db.py
│   └── make_layout.py
├── src/                                  ← Faz 1 MVP
│   ├── engine/                            (saf TS, UI'sız)
│   │   ├── unlock.ts
│   │   ├── xp.ts
│   │   ├── mastery.ts
│   │   ├── quest.ts
│   │   └── coach.ts
│   ├── ui/
│   ├── db/                                (IndexedDB)
│   └── main.tsx
├── tests/
└── prototype/                            ← tek dosya HTML (geçici)
```

## Kurallar **[TASARIM]**

1. **`data/movements.json` commit edilir** (üretilen dosya olmasına rağmen).
   *Gerekçe:* veri değişikliğinin diff'i görülebilmeli — bu içeriğin
   sürüm geçmişi, kodun değil.
2. **Commit mesajı ne değiştiğini değil neden değiştiğini söyler.**
   `"pull-up bronz eşiği 3→5"` değil,
   `"pull-up bronz eşiği yükseltildi: 3 tekrar mastery değil, ilk temiz tekrar"`
3. **Veri değişikliği ayrı commit.** Kod ve veri karışmaz.
4. **Doğrulayıcı geçmeyen commit yok.**
5. **`_CHECKPOINT.txt` her oturumun son commit'i.**

## Etiketleme **[TASARIM]**

```
data-v1.0.0      hareket veritabanı sürümü (schemaVersion ile eşleşir)
app-v0.1.0       uygulama sürümü
```

İkisi bağımsız sürümlenir. *Gerekçe: FP-7 — veri koddan uzun yaşar.*

## Açık Sorular

- **[RESEARCH]** Depo public mi private mı? Açık kaynak sorusu
  `23_Business`'te. Karar verilmedi.

---

<a name="25_documentation"></a>
# 25 · DOCUMENTATION

## Doküman hiyerarşisi **[KESİN]**

| Dosya | Rol | Kim okur |
|---|---|---|
| `PROJECT_ASCEND_SECOND_BRAIN.md` | **Kurumsal hafıza.** Her şeyin nedeni | AI, yeni geliştirici |
| `_CHECKPOINT.txt` | **Nerede kaldık.** Oturum durumu | AI, her oturum başında |
| `data/movements.json` | **Veri.** Tek doğruluk kaynağı | Kod |
| `archive/*.txt` | **Tarih.** Orijinal vizyon notları | Merak eden |

Önceki `00_AMAC_VE_PLAN.md` ve `01_YOL_HARITASI.md` bu dosyaya **entegre
edildi**; içerikleri Part 1, 2 ve 6'da yaşıyor.

## Living Documentation kuralı **[KESİN]**

> **Belgelenmemiş karar, alınmamış karardır.**

Bir karar sohbette alınıp belgeye yazılmazsa 3 hafta sonra kaybolur ve
tekrar tartışılır. Bu, projenin en pahalı israfı.

Uygulaması: her oturum `_CHECKPOINT.txt` güncellemesiyle biter
(Checkpoint Discipline), her kalıcı karar `29_DecisionHistory`'ye girer.

## Yazım kuralları **[KESİN]**

1. **Her bölüm "neden"le başlar.** "Ne" ikinci sırada.
2. **Her iddia etiketli.** `[KESİN]` / `[TASARIM]` / `[BRAINSTORM]` /
   `[TODO]` / `[RESEARCH]` / `[RED]`
3. **Reddedilen fikir silinmez, gerekçesiyle kalır.** Aynı fikrin 6 ay
   sonra tekrar gelmesini engeller.
4. **Sayı varsa kaynağı olur.** Kaynaksız sayı `[RESEARCH]`.
5. **Madde listesi yeterli değil.** Bir sistem `Neden / Kurallar /
   Bağlantılar / İlgili Sistemler / Gelecekteki Geliştirmeler /
   Açık Sorular` ile anlatılır.

## Açık Sorular

- **[RESEARCH]** Bu dosya 2000+ satır. Büyümeye devam edecek. Hangi
  noktada bölünmesi gerekir? Şu anki görüş: bölünmemeli — tek dosya
  olmasının amacı "AI'a bunu ver, yeter" olması.

---

<a name="26_backlog"></a>
# 26 · BACKLOG

## ⭐ BİR HAFTALIK PLANLAMA TAKVİMİ **[KESİN]**

Kurucunun kararı: **ilk hafta tamamen planlamaya ayrılır, kod yazılmaz.**
Aşağıdaki 7 gün, v2.0'da açık kalan tasarım boşluklarını kapatır.

| Gün | Konu | Çıktı | Neden bu sırada |
|---|---|---|---|
| **1** | **Ağaç incelemesi** (B-01) | Düzeltilmiş `movements_data.py` | Veri en altta; üstüne bir şey koymadan düzeltilmeli |
| **2** | **Yerleştirme testi** (`18.17`) | Test protokolü + eşik tablosu | "Nereden başlıyorum" cevaplanmadan hiçbir şey tasarlanamaz |
| **3** | **Seans nesnesi** (`18.11`) | `sessionBlock` ataması + 4 günlük şablon | Günlük kullanım döngüsü — en büyük boşluk |
| **4** | **Aktif kadro + node içi ilerleme** (`18.12`, `18.13`) | Slot kuralları, yoğunluk çarpanları | Seans tasarımı bittikten sonra anlamlı |
| **5** | **Ekran akışı** | Hangi ekran, ne gösterir, nereye gider | Mekanikler netleşince arayüz türetilir |
| **6** | **Veri şeması v2** | Yeni alanlar: `sessionBlock`, `intensity`, `genome` iskeleti, i18n sarmalayıcı | Tüm kararlar veriye yansıtılır |
| **7** | **Gözden geçirme + Faz 1 kilidi** | Second Brain v3, kilitli MVP kapsamı | Kapsam kapısı kapanır, kod başlar |

**Kural:** 7. günün sonunda Faz 1 kapsamı **kilitlenir.** O listeye
sonradan özellik eklenmez. *Kaynak: FP-9, faz kapıları (`22`)*

---

## Sıradaki iş **[TODO]**

### B-01 · Ağacın içerik incelemesi — ÖNCELİK 1
Prototipi açıp ağacı eleştirmek: yanlış sıralanmış ön koşul, eksik ara
adım, gereksiz kapı, yanlış mastery eşiği.

**Neden şimdi:** Veri düzeltmesi en ucuz bu aşamada. Kod bindikten sonra
her değişiklik pahalanır.

**Nasıl:** Her bulgu `build/movements_data.py`'de düzeltilir,
`build_db.py` + `test_prototype.js` yeniden koşturulur.

**Bilinen şüpheli noktalar** (inceleme başlangıcı için):
- Nordic Curl derinlik 3'te ama tier 6 — zincir çok kısa
- `deep-pushup`, `dive-bomber`, `v-pushup` aksesuar mı gerçekten
- Push kategorisinde archer'a giden iki ayrı yol var (wide ve uneven) —
  ikisi de gerekli mi
- `mike-tyson-pushup` explosive ailesinde ama push kategorisinde
- Mastery eşikleri: pull-up bronz 3 tekrar gerçekten "yapabiliyorum" mu?

### B-02 · Mastery doğrulama kuralını uygula
14 gün / 2 seans kuralı prototipte yok. Seans tarihi tutulmalı.

### B-03 · Skill Genome verisi yaz
196 × 18 öznitelik. Aile şablonu + hareket düzeltmesi.
**Bloke:** öznitelik listesi kesinleşmeli (`11_SkillGenome` açık sorusu).

### B-04 · Gerçek MVP projesi kur
Vite + TypeScript + React. Motor katmanı ayrı modüllere çıkar.
IndexedDB kalıcı kayıt. 4 günlük program görünümü.
**Not:** Prototipin ilerleme kaydı taşınabilir değil sayılmalı —
geçiş öncesi "Dışa aktar" ile JSON alınmalı.

### B-05 · `progressTest` alanı tanımla
Mastery hedefi var ama ölçüm protokolü yok. Hold süresi hangi form
kriteriyle sayılır?

### B-06 · Eksik knowledge graph ilişkileri
`regression_of`, `variation_of`, `antagonist_of` — bkz. `12_KnowledgeGraph`.

### B-07 · Custom Trees **[TASARIM]** — Faz 5
> `AI_BRIEF.txt` "Custom trees" olarak listelemişti; v1.0'da atlanmıştı.

Kullanıcının kendi dalını tanımlayabilmesi: mevcut node'lardan seçip
kendi hedef zincirini kurması, veya yeni node ekleyip ağaca bağlaması.

**Kısıtlar [TASARIM]:**
1. Özel ağaçlar **ana ağacı değiştirmez**, üzerine bindirilir (overlay)
2. Doğrulayıcı özel ağaçlara da uygulanır — döngü ve yetim node yasağı
   burada da geçerli
3. Özel node'lar XP verir ama **boss olamaz** ve resmi istatistiğe
   girmez. *Gerekçe:* Kullanıcı kendi XP'sini şişirebilmemeli

Marketplace'in (`23`) ön koşulu budur.

### B-08 · i18n sarmalayıcı — ÖNCELİK 2
Arayüz metinlerini anahtar sistemine taşı, `movements.json`'daki
çevrilebilir alanları dil kodlu yap. **Şimdi yapılmazsa 196 node'u
sonradan dönüştürmek pahalı.** Bkz. `16_Architecture`.

### B-09 · Erişilebilirlik temel seviye
Klavye gezinme + `aria-label` + mastery kademelerini renkten bağımsız
gösterim (ikon/sayı). Bkz. `16_Architecture`.

### B-10 · Portfolyo paketi
README, canlı demo, ekran görüntüleri, lisans, temiz commit geçmişi.
Faz 1 bitiminde yapılır — önce değil, çünkü henüz gösterilecek bir şey yok.

## Teknik borç **[TODO]**

| Borç | Etki | Faz |
|---|---|---|
| `media` alanları boş (196 hareket) | Görsel yok | 5 |
| `lore` alanları boş | Hikaye yok | 5 |
| İpuçları aile bazında, hareket-özel yok | İncelik kaybı | 2 |
| Ayrı ağaçlar (Rings/Freestyle/Weighted) yok | Vizyondan sapma | 5 |
| Prototip tek dosya, mimari katmanı yok | Geçici | 1 |
| jsdom çalışmıyor, kendi DOM shim'i kullanılıyor | Test altyapısı kırılgan | 1 |

## Bağlantılar

- `22_Roadmap` — faz ataması
- `30_OpenQuestions` — cevap bekleyen sorular

---
---

# 🧠 PART 7 — BRAIN

---

<a name="27_ideavault"></a>
# 27 · IDEA VAULT

Vizyon dosyalarında **60'tan fazla** sistem fikri var ve hepsi aynı
öncelikte yazılmış. Bu bölüm hepsini tasnif eder. **Reddedilenler
silinmez** — aynı fikrin 6 ay sonra tekrar gelmesini engellemek için
gerekçeleriyle duruyor.

## ✅ Yapıldı (Faz 0-1)

| Fikir | Nerede |
|---|---|
| Skill Graph / Knowledge Graph (temel) / Skill Web | 196 node, 234 kenar |
| Interactive Skill Map / Skill Atlas / World Map / Progress Map | Zoom/pan'lı ağaç |
| Skill GPS / Reverse Skill Engine | "Bu hedefe giden yolu göster" |
| Evolution Tree | Ağacın kendisi (soldan sağa evrim) |
| Missing Node Detector / Tree Integrity | `build_db.py` — 10 kontrol |
| Balance Score | Hesaplanıyor, gösteriliyor |
| Equipment Progression | Ekipman filtresi + node alanı |
| Boss Battles | 22 boss, HP göstergesi |
| Encyclopedia / Movement Encyclopedia | Detay paneli |
| Difficulty Curve Simulator | Test simülasyonları |
| Character Card / Character Sheet | Başlık: seviye, XP, açık, boss, denge |
| No Orphan Rule / First Principles / Rule of Regret / Delete Test / 10 Year Test / Feature Gravity / Lighthouse Principle / Old Developer Test / Canon Review / Single Source of Truth | `08_Philosophy` + `15_Governance`'ta tanımlandı |
| Constitution / Charter / Manifesto / Non Goals | Part 1 |
| ADR / Decision History | `29_DecisionHistory` |
| Project Brain / Second Brain | Bu dosya |

## Faz 2 — Oyun katmanı

Procedural Quest Generator · Skill Titles · Personal Records · Timeline ·
Heatmap · Movement History · Hall of Fame (kendi kilometre taşları) ·
Ascension Score · Global Completion · Unknown Skills (gizli node) ·
Patch Notes · Skill Calculator · Build Generator (4 günlük program) ·
Fatigue System (hacim takibi) · Collections · Achievements ·
Statistics Dashboard

## Faz 3 — Zeka katmanı

**Skill Genome** (merkez) · Skill Radar · AI Weak Point Detector ·
Skill Synergy · Recommendation Engine · Failure Analytics ·
Readiness Score · AI Progress Prediction · Future Predictor ·
Alternative Paths · Injury Prevention Tree · Road Generator ·
Reverse Skill Engine (gelişmiş)

**Not:** Bu 13 fikrin 5'i tek bir veri eklemesiyle (`genome`) mümkün oluyor.
Bkz. `11_SkillGenome` — projenin en yüksek kaldıraçlı işi.

## Faz 4 — Ölçek

Bulut senkronizasyonu · Antrenör modu · **Skill Fossil System** (içerik
versiyonlama; `schemaVersion` ile temeli atıldı) · Skill Certificates ·
Skill Packs · Plugin System · API

## Faz 5 — İçerik

Skill Lore / Skill Stories · Movement Combos · Replay System ·
Ghost Replay · Constellation Mode · World Tree · Character Evolution ·
Hall of Masters (gerçek sporcular — izin/telif kontrolü) · Biomechanics ·
Sezonlar · Ayrı Rings/Freestyle/Weighted/Gymnastics ağaçları ·
AI Form Analysis (aşağıdaki uyarıyla)

## ⛔ Reddedildi — gerekçeli **[RED]**

| Fikir | Gerekçe |
|---|---|
| **Prestige / New Game+** | Fiziksel gerçeklikte "sıfırla, baştan başla" anlamsız. Kazanılan güç sıfırlanmaz. Yerine: master kademesi + sezonluk hedefler. |
| **Skill Fusion** | Kalistenikte iki hareketi "birleştirip" üçüncüsünü elde etmek yok. Oyun mekaniğinin fiziğe zorla giydirilmesi. |
| **Endless Tree** | Sonsuz üretilen hareket = uydurulmuş hareket. Veri kalitesi ürünün temeli; uydurma hareket temeli çürütür. *Kaynak: `21_Research` K-2* |
| **Genetics / Body Analysis** | Ölçüm imkânı yok, sözde-bilim riski yüksek. "Genetiğin planche'a uygun değil" demek zararlı ve kanıtsız. |
| **Inventory** | Envanterde ne duracak? Ekipman zaten node alanı. Ayrı sistem gereksiz karmaşa. *Kaynak: Delete Test* |
| **Leaderboard / sosyal karşılaştırma** | M-5 ihlali. Kalistenikte acele = sakatlık; karşılaştırma aceleyi tesvik eder. |
| **Play Styles** | Ağaç zaten seçim sunuyor (hangi dalda ilerleyeceğin). Ayrı "stil" katmanı ikinci bir kısıt sistemi demek. |
| **Reklam / veri satışı / pay-to-unlock** | Sırasıyla M-3/M-5, M-6, M-1 ihlali. Kilit mekaniği asla paraya bağlanamaz. |
| **Freestyle ağacı** | Hareket seti tanımsız, ölçülemez. Node olamayan şey ağaç olamaz. |

## ⏸ Tanımsız — beklemede **[BRAINSTORM]**

Bu fikirler reddedilmedi, ama **ne yapacakları bir cümleyle
yazılamıyor.** Tanım netleşene kadar değerlendirmeye alınmaz.

| Fikir | Eksik olan |
|---|---|
| **Skill DNA** | `Skill Genome` ile aynı şey mi, farklı mı? Farklıysa ne? |
| **AI Lab** | "Claude deney yapıyor" — hangi deney, çıktısı ne? |
| **AI Research Mode** | Neyi araştırır, sonucu nereye yazar? |
| **Dream Builder** | Tanım yok |
| **Universal Engine** | Hangi evrensellik? Kalistenik dışına mı çıkıyor? |
| **Skill Compiler** | Neyi neye derliyor? |
| **Gravity Score / Architecture Health** | Ölçtüğü şey ne, formülü ne? |
| **Boss AI** | Reddedilmeye yakın: HP yenilenmesi = ceza mekaniği, M-3 gerilimi |

## ⚠️ Koşullu onay

### AI Form Analysis — Faz 5, kısıtlı
Teknik olarak mümkün. Ama bir sisteme "formun doğru" dedirtmek **sakatlık
riski** taşır ve bugünün video modelleri kalistenik formunda güvenilir
değil.

**Koşul:** Yalnızca "şuna bak" tarzı işaretleme yapar, **onay vermez.**
"Formun doğru" cümlesini asla kurmaz.

### Hall of Masters — Faz 5, kontrollü
Gerçek sporcuların içeriği. İzin ve telif kontrolü yapılmadan eklenmez.

### Future Me — Faz 3, aralıklı
"6 ay sonraki halin gibi konuşan AI" fikri motive edici. Ama tahmin
**aralık** olarak sunulmalı ("3-6 hafta"), tek sayı olarak değil
("18 gün"). *Gerekçe: yanlış tek sayı motivasyon kırar.*
*Kaynak: `13_AIArchitecture` K-2*

## Bağlantılar

- `07_NonGoals` — kapsam kapısı 4 sorusu
- `15_Governance` — özellik ekleme prosedürü
- `29_DecisionHistory` — red kararlarının kaydı

---

<a name="28_timeline"></a>
# 28 · TIMELINE

## Geçmiş

| Tarih | Olay |
|---|---|
| 2026 öncesi | Fikir doğuşu: "şınav kaç set?" sorusundan başladı |
| ~2026 H1 | 9 vizyon dosyası yazıldı (AI_BRIEF, MASTER_PROMPT, GAMEPLAY_RULES, MISSING_SYSTEMS_AUDIT, FUTURE_IDEAS, 2 hareket listesi, Türkçe beyin fırtınası) |
| 2026-07-25 | **Faz 0 tamamlandı.** 196 hareketlik doğrulanmış graf, 10 otomatik kontrol, 0 hata |
| 2026-07-25 | Oyun mekanikleri sayısallaştırıldı (XP, seviye, mastery, denge, boss HP) |
| 2026-07-25 | Çalışan prototip üretildi (tek dosya HTML, 88 KB) |
| 2026-07-25 | 61 fonksiyonel test yazıldı, hepsi geçti; biri gerçek formül hatası yakaladı |
| 2026-07-25 | **Sıralama ihlali fark edildi:** prototip, plan bitmeden yazıldı (D-019) |
| 2026-07-25 | **Faz 0.5 tamamlandı.** Bu dosya (Second Brain) yazıldı |

## Gelecek

| Hedef | Ne zaman |
|---|---|
| Ağacın içerik incelemesi (B-01) | Sıradaki |
| Faz 1 MVP | 2026 Q3 |
| İlk 5 ay elit temel değerlendirmesi | 2026 Aralık |
| Faz 2 | 2026 Q4 – 2027 Q1 |
| Faz 3 (Skill Genome) | 2027 |
| Faz 4 (ölçek) | 2028 |
| Faz 5 (içerik) | 2029+ |

---

<a name="29_decisionhistory"></a>
# 29 · DECISION HISTORY

Her kalıcı karar burada. Format:
`D-xxx · [tarih] · karar · gerekçe · kaynak ilke`

---

**D-001 · 2026-07-25 · Tek doğruluk kaynağı `movements.json`**
İki hareket listesi (`Master_Movement_List`, `V2_Master_Movement_Database`)
birbiriyle çelişiyordu. Vizyon `.txt` dosyaları arşiv statüsüne alındı.
*Kaynak: FP-7, M-7*

**D-002 · 2026-07-25 · JSON elle düzenlenmez, script üretir**
196 node elle tutarlı tutulamaz. `movements_data.py` + `build_db.py`.
*Bedeli:* veri değişikliği için Python çalıştırmak gerekir. *Kaynak: FP-3*

**D-003 · 2026-07-25 · Ön koşullar AND, OR değil**
Basit ve tahmin edilebilir. OR gerekirse ara node açılır.
*Bedeli:* "şu ya da bu" durumları modellenemiyor. *Kaynak: FP-6*

**D-004 · 2026-07-25 · 4 kademeli mastery (bronz/gümüş/altın/master)**
Sürekli ilerleme hissi için birden fazla kademe gerekli; 4'ten fazlası
ayrım kaybettirir.

**D-005 · 2026-07-25 · Kilit açmak için bronz yeterli**
Master şartı ağacı tıkar, insanı tek harekette aylarca tutar.
*Bedeli:* yetersiz temelle ilerleme riski → Faz 3 zayıf halka tespiti
yakalayacak. *Kaynak: FP-5*

**D-006 · 2026-07-25 · XP formülü `30 × 1.53^tier`, çarpanlar 1.0/1.6/2.6/4.2**
Zor hareket çok daha fazla değmeli. Tier 0 = 30 XP, tier 9 ≈ 1300 XP.

**D-007 · 2026-07-25 · Seviye eğrisi `100 × (N-1)^1.6`**
Erken seviyeler hızlı (motivasyon), sonra yavaşlar (uzun vade).

**D-008 · 2026-07-25 · `isAccessory` bayrağı eklendi**
Doğrulayıcı 22 yanlış alarm veriyordu. Artık gerçek eksik progression ile
bilinçli yaprak node ayırt ediliyor. *Kaynak: No Orphan Rule*

**D-009 · 2026-07-25 · Mobilite gerçek ön koşul**
`wrist-mobility` → handstand, `ankle-mobility` → pistol,
`shoulder-mobility` → back lever. Vizyon "mobilite zorunludur" diyordu;
artık slogan değil, veri kısıtı. *Kaynak: FP-1, M-2*

**D-010 · 2026-07-25 · İpuçları aile bazında (26 aile)**
196 hareket için tek tek metin yazmak yerine tutarlı koçlama ipucu.
*Bedeli:* hareket-özel incelik kayboluyor → override alanı sonradan.

**D-011 · 2026-07-25 · Türkçe arayüz, İngilizce hareket adları**
Kalistenik terminolojisi uluslararası; "ön kaldıraç" kimseye bir şey
anlatmıyor.

**D-012 · 2026-07-25 · Platform: web öncelikli, yerel-öncelikli, sunucusuz**
TypeScript + React + Vite + Tailwind + IndexedDB + statik hosting.
Aynı kod telefon+masaüstü, sıfır maliyet, offline, en hızlı iterasyon.
Kodu AI yazdığı için iterasyon hızı en değerli kaynak.
*Bedeli:* cihaz kaybı = veri kaybı → dışa aktarma MVP'de zorunlu.

**D-013 · 2026-07-25 · Motor katmanı saf TypeScript, UI'dan bağımsız**
Oyun kuralları test edilebilir olmalı ve UI yeniden yazımından sağ çıkmalı.
*Kaynak: Old Developer Test*

**D-014 · 2026-07-25 · İçerik ve kayıt asla karışmaz**
Kayıt sadece hareket `id`'sine referans verir. Veri güncellemesi kullanıcı
ilerlemesini bozmaz. *Kaynak: FP-7*

**D-015 · 2026-07-25 · Mastery doğrulaması: 14 günde 2 ayrı seans**
Tek seferlik iyi gün mastery sayılmaz. *Kaynak: FP-3*
**[TODO]** Prototipte uygulanmadı.

**D-016 · 2026-07-25 · Denge puanı kategori büyüklüğüne göre normalize edilir**
İlk tanım "her kategori eşit pay" (1/N) diyordu. Pull 43 node, Explosive 8
node içeriyor; eşit pay beklemek Pull'da doğru ilerleyeni cezalandırıyordu.
**Bu hatayı test yakaladı:** her hareket bronza çıkarıldığında puan 100
değil 62 geldi. *Kaynak: M-8 — söylemeden önce test*

**D-017 · 2026-07-25 · Seri haftalık, günlük değil; deload seriyi kırmaz**
Günlük seri dinlenmeyi cezalandırır ve aşırı antrenmanı ödüllendirir.
Sağlık gerekçeli, pazarlık dışı. *Kaynak: FP-2, M-3*

**D-018 · 2026-07-25 · Günlük görevler kurallı üretilir, rastgele değil**
1) aktif progression 2) en zayıf kategori 3) bakım.
Rastgele görev "ne çıkarsa" hissi verir; kurallı görev zayıf halkayı kapatır.

**D-019 · 2026-07-25 · SIRALAMA İHLALİ — prototip plan bitmeden yazıldı**
Kurucunun niyeti "önce planın tamamı, sonra uygulama"ydı ve bu niyet
`Yeni Metin Belgesi.txt`'nin son bölümünde açıkça yazılıydı
(`PROJECT_ASCEND_SECOND_BRAIN.md` talebi). Bu bölüm okunmadığı için
prototip erken üretildi.

**Nedeni:** 9 dosyanın 8'i baştan sona okundu, 9'u (837 satır) yalnızca
ilk 200 satırı okunup gerisi başlık taramasıyla geçildi. Asıl talep
195. satırdan sonrasındaydı.

**Alınan ders:** Bir dosyanın uzunluğu, önemsizliğinin göstergesi değil.
En son değiştirilen dosya en güncel niyeti taşır ve ilk tam okunmalıdır.

**Sonuç:** Prototip çöpe atılmadı — Faz 1 için geçerli bir çıktı ve
mekanikleri doğruladı. Ama sıra düzeltildi: plan (bu dosya) tamamlandı,
uygulama ondan sonra.

**D-020 · 2026-07-25 · 17 ağaç → 12 kategori**
Vizyon 17 ağaç istiyordu. Grip → Pull ailesi, Rings/Parallettes/Weighted →
ekipman etiketi, Street Workout → dağıtıldı, Gymnastics → Elite+Balance,
Freestyle → reddedildi. *Kaynak: FP-6*

**D-021 · 2026-07-25 · Ekipman bir kategori değildir**
Aynı hareket farklı ekipmanla yapılabilir; kategoriyi hareket kalıbı
belirler, alet değil. Bu yüzden `equipment[]` ayrı alan.

**D-022 · 2026-07-25 · Faz 3'ün tamamı LLM olmadan yapılır**
WeakPointDetector, Recommender, ReadinessScorer, ProgressPredictor,
BalanceScorer — hepsi deterministik hesaplama. LLM her çağrıda para ve
gecikme demek, offline çalışmaz, aynı girdiye farklı cevap güven kaybettirir.
LLM sadece açıklama üretiminde (Faz 4+), karar vermede değil.

**D-023 · 2026-07-25 · Liderlik tablosu ve sosyal karşılaştırma yok**
Karşılaştırma aceleyi, acele sakatlığı üretir. *Kaynak: M-5*

**D-024 · 2026-07-25 · Bulut senkronizasyonu Faz 4**
Tek cihazda çalışmayan şeyi iki cihaza yaymanın anlamı yok. *Kaynak: FP-8*

**D-025 · 2026-07-25 · Antrenör modu Faz 4**
Çok kullanıcılı veri modeli, tek kullanıcılı model oturmadan tasarlanamaz.

**D-026 · 2026-07-25 · Second Brain tek dosya kalır**
2000+ satır olmasına rağmen bölünmez. Amacı "AI'a bunu ver, yeter" olması.
Bölünürse bu amaç kaybolur.

**D-027 · 2026-07-25 · 9 fikir gerekçeli reddedildi, 8 fikir tanımsız
sayıldı**
Bkz. `27_IdeaVault`. Red gerekçeleri saklanıyor; aynı fikrin tekrar
gelmesini engellemek için. *Kaynak: FP-9*

**D-028 · 2026-07-25 · Gelir modeli Faz 4'e kadar düşünülmez**
Gelir düşüncesi ürün kararlarını bozar. Proje Faz 4'e kadar sıfır maliyetli.
Kilit mekaniği asla paraya bağlanamaz. *Kaynak: FP-8, M-1*

---
## v2.0 kararları
---

**D-029 · 2026-07-25 · İKAME HATASI — kurucunun çerçevesi kendi
çerçevemle değiştirilmişti**
9 kaynak dosyadan çıkarılan 67 kavram belgeye karşı tarandı; **14'ü
eksikti.** Sebep bilgi kaybı değil, **ikame**: kurucunun yazdığı çerçeve
okunmuş ama yerine yenisi konmuştu.

**En net örnek:** `MASTER_PROMPT.txt`'te 8 PROJECT PRINCIPLES yazılıydı
(Beginner First, Mastery Before Difficulty, Visible Progress, Quality
Before Quantity, Consistency Wins, Science Before Ego, Expand Forever,
Game First). Bunlar okunmuş, ama yerine 9 maddelik kendi First Principles
listesi yazılmıştı. İkisi çelişmiyordu — ama kurucununki kayboldu.

Aynı hata "Ranks"ta tekrarlandı: kaynakta Titles'tan ayrı bir sistem
olarak listelenmişken, tek sistem sanılıp birleştirildi.

**Alınan ders:** Kaynak dosyalarda **açıkça yazılmış** bir yapı varsa,
onu geliştirmek serbesttir; **yerine başkasını koymak** değildir.
Kurucunun terimleri korunur, üzerine eklenir.

**Önlem:** Kapsama kontrolü artık mekanik olarak yapılabiliyor
(`build/` altındaki tarama). Yeni kaynak geldiğinde tekrarlanmalı.

**D-030 · 2026-07-25 · Kurucunun 8 ilkesi First Principles'ın ÜSTÜNDE**
Çelişirlerse 8 ilke kazanır. Kendi First Principles listem onları
açıklamak için var, yerine geçmek için değil. *Kaynak: D-029*

**D-031 · 2026-07-25 · Charter yeniden yazıldı — profil yanlıştı**
v1.0 kurucuyu "haftada 4 gün antrenman yapan, 5 ayda elit temele
ulaşacak kişi" saymıştı. Gerçek: **antrenman geçmişi var, ara vermiş,
yeniden başlıyor.** Sabit sayısal hedefler (3×15 push-up, 3×10 pull-up)
kaldırıldı, yerine yerleştirmeye göre **göreli** hedefler kondu.

**D-032 · 2026-07-25 · İkinci kullanıcı "mutlak başlangıç" değil,
"ara vermiş kişi"**
Kurucunun ifadesi: *"benim gibi insanlar da kullanmış olur."* Bu, ikinci
kullanıcıyı Faz 4'ten Faz 2-3'e çekiyor ve **kurucuyla aynı** kişi
yapıyor. Tek kişi için yapılan şey ikisine de yarıyor. *Kaynak: FP-8*

**D-033 · 2026-07-25 · Projenin iki amacı var: kişisel araç + açık geliştirme**
Birincil amaç kurucunun kendi antrenmanını yönetmesi. İkincil amaç projeyi
açıkta geliştirmek — kararlar, gerekçeler ve çıkmaz sokaklar dahil.
Sonucu: **bitmişlik teknik gösterişten değerli.** Projenin ağırlık merkezi
arayüz kodunda değil, **veri/modelleme katmanında**: 196 düğümlük graf,
XP eğrileri, denge puanı, ilerleme modellemesi.

**D-034 · 2026-07-25 · App Store ertelendi, tek platform: web**
Kurucu App Store'u "şimdilik sadece fikir" olarak tanımladı. React
Native/Expo çatalı kapandı. Mobil gerekirse Capacitor ile aynı koddan.
*Gerekçe:* İki platformu birden hedeflemek bitirme olasılığını düşürür,
bitirme ise portfolyo hedefinin ta kendisi. *Kaynak: D-033*

**D-035 · 2026-07-25 · İlk hafta kod yazılmaz, tamamen planlama**
Kurucunun kararı. 7 günlük takvim `26_Backlog`'da. 7. günün sonunda
Faz 1 kapsamı kilitlenir. *Kaynak: FP-9*

**D-036 · 2026-07-25 · VERİ HATASI — `shoulder-mobility` bant
zorunluluğu kaldırıldı**
`shoulder-mobility` yalnızca `["band"]` ekipmanına bağlıydı. Omuz
mobilitesi ekipmansız yapılır. O node dip, pike push-up, german hang'in
kapısı olduğu için, bandı olmayan kullanıcı **39 node ve 8 boss**
kaybediyordu.

Düzeltme: `["floor","band"]`. Ayrıca `dragon-flag` ve
`dragon-flag-negative` (`bench` → `bench`/`pullup-bar`/`dip-station`),
`copenhagen-plank` (`box` → `box`/`bench`).

**Direnç bandı sistemde kalır** — `MASTER_PROMPT.txt`'te desteklenen
ekipmanlar arasında yazılı ve diğer kullanıcılar için gerçek değeri var
(assisted pistol, assisted OAP, OAP progression).

**Sonuç:** Kurucunun ekipmanıyla erişim **%72 → %93** (141 → 182 node,
8 → 17 boss). Kalan 5 boss gerçekten halka/parallettes gerektiriyor.

**D-037 · 2026-07-25 · Doğrulayıcıya "ekipman kaskadı" kontrolü eklendi
(11. kontrol)**
Bir kapı node'u dar bir ekipmana bağlanırsa, o ekipmanı olmayan kullanıcı
için ağacın büyük kısmı sessizce çöker. Kontrol bunu yakalar.
D-036'daki hatayı bu kontrol yakaladı; ikinci bir bulgu daha verdi:
`box` (sehpa) 30 node'u bloke ediyordu ama 5'i gerçekten gerektiriyordu.
Çözüm: sandalye/basamak evrensel sayıldı, `box` temel ekipmana alındı.

**D-038 · 2026-07-25 · 5 yeni sistem tasarlandı — v1.0'ın gerçek
boşlukları**
Seans Nesnesi (`18.11`) · Aktif Kadro (`18.12`) · Node İçi İlerleme
(`18.13`) · Comeback Modeli (`18.16`) · Yerleştirme (`18.17`).

En kritiği **Seans Nesnesi**: v1.0'da harita vardı ama "bu akşam 45
dakikada ne yapacağım" sorusunun cevabı yoktu. İkincisi **Aktif Kadro**:
182 açık node varken asıl problem erişim değil **seçim**; RPG çerçevesi
zaten cevabı veriyordu (kadro slotu).

**D-039 · 2026-07-25 · Localization ve Accessibility mimari
gereksinim olarak kabul edildi**
`MISSING_SYSTEMS_AUDIT.txt` kontrol listesinde yazılıydı, v1.0'da
atlanmıştı. Arayüz metni koda gömülmez; mastery kademeleri renkten
bağımsız da ayırt edilebilmeli. i18n sarmalayıcısı **erken** yapılmalı —
196 node sonradan dönüştürmek pahalı.

**D-050 · 2026-07-26 · FAZ SIRASI DEĞİŞTİ — uygulama kendi kendine
yetmeli, koça bağlı kalmamalı**

**Yeni kısıt:** Kurucunun AI erişimi 1 ay garantili; 6 ay boyunca devam
edip etmeyeceği belirsiz. Ayrıca antrenmanı **telefondan** girecek ve AI
şu an yalnızca masaüstünde.

**Bu, faz planını geçersiz kılıyor.** Eski plan şunu varsayıyordu: koç
(AI) sürekli devrede olur, slotları seçer, hedefi ayarlar, uyarlamayı
yapar. Progression Planner Faz 3'e konmuştu — yani uygulamanın en kritik
parçası en sona.

**Yanlıştı.** Koç kaybolabiliyorsa, koçun yaptığı iş **uygulamanın
içinde** olmalı. Yoksa erişim bittiği gün sistem durur.

**Yeni öncelik sırası:**

| Eski | Yeni |
|---|---|
| v1: kayıt ekranı | v1: kayıt **+ uyarlama kuralı + Progression Planner** |
| Planner Faz 3 | **Planner v1'de** |
| Mobil Faz 4 | **Mobil öncelikli (v1)** — kullanım telefonda |
| Bulut Faz 4 | Faz 4'te kalıyor (yerel yeterli) |

**Gerekçe:** Uyarlama kuralı (`18.13`) ve Planner (`18.19`) zaten
**deterministik** — LLM gerektirmiyorlar. Yani koçun yaptığı işin %90'ı
kodlanabilir. Kodlanmazsa proje bir aylık erişime bağımlı kalır; bu,
"on yıllarca yaşayacak sistem" vizyonuyla (`01_Vision`) çelişir.

**Bilgi sürekliliği önlemleri (zaten alınmış):**
- `SECODE_BRAIN.md` 31 bölüm, 50 karar kaydı — herhangi bir AI okuyup
  devam edebilir
- 3 skill kaydedildi (`ascend`, `ascend-veri`, `ascend-agac-inceleme`) —
  kullanıcı hesabında kalıcı
- Depo public, üretim zinciri belgelendi
- `PROFIL_YEREL.md` ve antrenman kaydı yerelde duruyor

Yani **kurumsal hafıza koça bağlı değil.** Eksik olan tek şey, koçun
*karar verme* işinin koda geçmesi. Bu D-050'nin işi.

**D-051 · 2026-07-26 · Mobil öncelikli, web app olarak telefona kurulur**
Kullanım senaryosu netleşti: antrenman sırasında, seti bitirdikçe telefondan
giriş. Tek elle mid-set kullanım değil — set arası toplu giriş.

Sonuç: Bugün ekranı **telefon genişliğine** tasarlanır. Mağaza gerekmez;
web app olarak telefonun ana ekranına eklenir (PWA). `D-034` (App Store
ertelendi) geçerliliğini koruyor ama artık mobil *kullanım* birinci sınıf.

**D-052 · 2026-08-01 · Oyun katmanı tasarımdan uygulamaya taşındı**
Kurucunun geri bildirimi: *"opus5'e prompt verdim oyun yaptı falan oluyor,
biz o seviyede bi şey yapmadık aslında."* Haklıydı. §18'de **20 oyun
sistemi** tasarlanmıştı, uygulamada yalnızca ~6'sı vardı: XP, seviye,
kademe, ağaç, denge puanı, terfi. Rütbe, seri, boss HP, unvanlar ve
Ascension Score sadece kâğıttaydı.

Sebebi teşhis edilebilir: motor katmanı (`adaptation`, `planner`, `mastery`)
"doğru çalışan uygulama" için zorunluydu, oyun katmanı değildi. Zorunlu
olan önce yazıldı, his sonraya kaldı. Ama kurucunun tarif ettiği motivasyon
mekanizması —*"kademeleri gördükçe derim ki 2 tane daha yapayım"*— tam
olarak bu katmanda yaşıyor. Yani "sonraya kalan" şey aslında ürünün amacıydı.

Uygulanan kararlar:
1. **Rütbe medyandan hesaplanır, ortalamadan değil.** Ortalama tek bir
   yüksek düğümle şişer; bir tane tuck front lever seni Advanced yapmaz.
2. **Seri HAFTALIK.** Günlük seri dinlenmeyi cezalandırır ve aşırı
   antrenmanı ödüllendirir — M-3'e aykırı. İçinde bulunulan hafta seriyi
   kırmaz; sadece *tamamlanmış* haftalar sayılır.
3. **Boss HP = 100 × (1 − ilerleme).** Mekanik olarak normal düğümle aynı,
   sunum farklı. Tamamen psikolojik, maliyeti sıfır.
4. **Unvanların yarısı disiplin ödüllendirir**, güç değil (İstikrarlı,
   Sabırlı, Kayıtçı, Mobilite Delisi). Sistem sadece yasak koymuyor,
   doğru davranışı da ödüllendiriyor — M-3'ün pozitif tarafı.
5. **Ascension Score düşebilir.** XP birikimlidir ve asla azalmaz; bu
   dürüst değil. İstikrar ekseni 6 hafta boşluktan sonra düşer, yani
   Ascension "şu an neredesin"i gösterir.
6. **Zamana bağlı fonksiyonlar `today` parametresi alır.** İçeride
   `new Date()` çağıran fonksiyon test edilemez — üç test bu yüzden
   patladı, imza değiştirilerek düzeltildi.

Kademe atlama artık tam ekran kutlama + `navigator.vibrate()` ile
karşılanıyor; titreşim deseni kademeyle güçleniyor. Telefonda dokunsal
geri bildirim ekrandan güçlü (D-051).

Açık kalan: günlük görev üreteci (§18.7) ve sezon sistemi (§18.12) hâlâ
yalnız tasarımda. Bunlar bilinçli ertelendi — günlük görev, program
şablonu yerine planlayıcı Bugün ekranına bağlandıktan sonra anlamlı olur.

**D-064 · 2026-08-20 · Karar kullanıcının: terfi kapısı, süreklilik katmanı, kalibrasyon hatası**

Üç ayrı şikâyet, tek bir kök sebep: **sistem kullanıcı adına karar
veriyordu ve kararlarının dayanağı zayıftı.**

**1 · Terfi kapısı iki koşullu oldu ve artık soruyor.**

Eskiden bir hareket altın kademeye ulaşınca slot sessizce bir üst
düğüme kayıyordu. Kullanıcının itirazı yerindeydi: pike şınavda 12
tekrarı iki kez yapan biri bir üst harekete geçiyordu. Bir hareketi
*yapabilmek* ile o hareketin dokusunu oturtmak aynı şey değil — kas
haftalar içinde uyum sağlar, tendon ve bağ dokusu daha yavaş. Erken
geçiş kalistenikte sakatlığın en yaygın sebebi.

Yeni kapı: **doğrulanmış altın kademe + hacim eşiği + kullanıcı onayı.**
Hacim eşiği `altın hedef × altın set × 8 seans` — pike şınav için 288
tekrar. Formül hareketin kendi zorluğundan türüyor, sabit sayı değil.

Kullanıcının ağaçtaki yeri artık çıkarım değil kayıt: `state.trackAt`.
Sistem oraya kendiliğinden dokunmaz. Geri almak da serbest — "erken
geçmişim" diyebilmek, geçememekten önemli.

**2 · Süreklilik katmanı — sayının değil gitmenin takibi.**

Ağaç "ne kadar güçlüsün"ü ölçüyor. Bir yılın sonucunu belirleyen soru
ise "kaç gün ortaya çıktın". İkisi farklı arayüz istiyor: beceri işi
sayı ister, temel hareketler **yapıldı/yapılmadı** ister. "Bugün şınav
çektim" için üç set kutusu doldurmak, yapılmama sebebidir.

Gösterilen şey **gün cinsinden zincir**, işaret sayısı değil — farklı
aralıklı alışkanlıklar ancak öyle karşılaştırılabiliyor. Aralık
kullanıcının: "2 günde bir" diyorsa ikinci gün geciktirme değil,
planın kendisi. Günlük seri bilerek yok; dinlenmeyi cezalandırır.

Kademeye ve XP'ye girmez — işaretlemek tekrar üretmez, ağaç yalan
söylemesin. Dış yük kaydıyla (D-063) aynı ilke: bağlam, ilerleme değil.

**3 · Kalibrasyon hatası: ölçüm bir seans değildir.**

Kullanıcı "değerleri girince de bir şey olmamış" dedi. İki ayrı kusur
çıktı ve ikisi de gerçekti.

*Ölçtüğü şeyle yaptırdığı şey örtüşmüyordu.* Kalibrasyon şınav, squat,
plank, sandalye dip ve ip soruyordu; program pike şınav, masa row,
skapular şınav ve duvar handstand veriyordu. Ortak hareket yalnızca
hollow hold'du — yani girilen sayı Bugün ekranındaki hedeflerin hemen
hepsini etkilemiyordu. Programın kendi hareketleri ölçüme eklendi.

*Ve daha kötüsü:* ölçüm uyarlama kuralına normal seans gibi giriyordu.
30 şınav giren biri ertesi gün **3 × 31** hedefi görüyordu. Ölçüm tek
sette RIR 0'dır, reçete birkaç sette RIR 2-4 — ikisi aynı sayı olamaz.
`SetLog.kind = 'calibration'` ve `targetFromMax()` eklendi; çarpanlar
RIR'a göre (0.5-0.7) ve bilinçli olarak muhafazakâr: aşağı yanılmak bir
hafta kaybettirir, yukarı yanılmak tutturulamayan bir seans ve %20
düşüş demek.

Yeni: `engine/promotion.ts`, `engine/habits.ts`, `ui/Promote.tsx`,
`ui/Habits.tsx`. Şema v4. 195 test.

**D-063 · 2026-08-15 · Program dışı yük kaydı — sistemin son körlüğü**

README ilk günden beri şunu iddia ediyordu: bu sistem "başka antrenmanın
yanında yaşamak üzere" tasarlandı. Haftalık şablonun 3 sert / 2 hafif /
2 boş olmasının sebebi bu (D-057). Ama uygulamanın bunu **öğrenecek
hiçbir yolu yoktu.** Varsayım belgelerdeydi, veride değil.

Bunun bedeli sessiz bir ölçüm hatası ve tam olarak kilo takibiyle aynı
sınıftan (D-062, §1.2): dün 150 squat yapmış biri bugün planktan 10
saniye az tutar, uyarlama kuralı bunu **gerileme** diye okur ve hedefi
kalıcı olarak %20 düşürür. Kullanıcı hiçbir şey yanlış yapmamıştır,
sistem yanlış okumuştur. Hata görünmez: ekranda sadece daha küçük bir
sayı belirir.

**Kayıt:** tarih · tür (bacak/üst itiş/üst çekiş/kondisyon/spor/yürüyüş/
diğer) · şiddet (hafif/orta/ağır) · sıçrama var mı · isteğe bağlı not.
Varsayılan şiddet "orta", yani yaygın durum **iki dokunuş** — bağlam
kaydı için üç ekran doldurtulursa kimse ikinci kez yapmaz (D-062, §3.1).

**Sistem üç yerde kullanıyor:**

1. **Seans öncesi çakışma uyarısı.** Tür ile ağaç kategorisi arasında
   `conflicts` köprüsü var; "dün üst itiş çalışmışsın, bugünkü ana iş
   aynı dokuya biniyor" diyebilmesi bunu gerektiriyor. Uyarı listenin
   **üstünde** — sayı girildikten sonra söylemenin değeri yok.
2. **Uyarlama kuralında yorgunluk istisnası.** Son 2 günde ağır dış yük
   varsa "3+ altında → %20 düş" kararı **"aynı kalsın"a** iner. Yorgun
   bir günün ölçüsü kişinin seviyesi değildir.
3. **Koç raporu.** Dış seanslar ayrı bölümde; yorgunluk altında yapılan
   antrenman günleri işaretli.

**Bir kere affeder, iki kere affetmez.** İstisnanın sınırı olmasa
sürekli dış antrenman yapan biri asla ulaşamayacağı bir hedefe
kilitlenirdi — bir önceki seansta da 3+ açık varsa bu artık tek bir
kötü gün değil, gerçek bir seviye farkıdır ve hedef düşer. Sınırı
tasarlarken plato kuralının bu durumu yakalamadığı fark edildi: plato
"hedefi tam tutturma" halinde tetikleniyor, "tutturamama" halinde
değil. Yani ilk tasarım sonsuz döngü üretirdi.

**Kasten yapılmayan:** dış antrenman seriye, XP'ye ve kademelere
girmiyor. Uygulama beceri ağacını takip ediyor; oraya squat girerse
kademeler yanlış oynar ve sistem yanlış hedef verir. Dış yük
**bağlamdır, ilerleme değil.** Bu ayrım kaybolursa uygulama "her şeyi
sayan" bir günlüğe dönüşür — açıkça reddedilen şey (M-1).

Sıçrama ayrı takip ediliyor çünkü plyometrik yük kastan çok tendona
biner ve tendon daha yavaş toparlanır. 7 günde 3+ sıçrama seansı uyarı
üretiyor. Şema v3'e çıktı; göç yolu boş liste ekliyor — geçmişe dönük
doldurmak veriyi kirletirdi.

Yeni: `src/engine/outside.ts`, `src/ui/Outside.tsx`, 34 test.
Toplam 166 test.

**D-062 · 2026-08-14 · Dört gözle inceleme; dayanıklılık katmanı**
Proje dört ayrı bakış açısından incelendi (sporcu, geliştirici, eleştirici,
yabancı kullanıcı) ve önce alan araştırması yapıldı. Tam metin ve
tartışmalar: `docs/YOL_HARITASI.md`.

**Araştırmanın iki bulgusu planı gerçekten değiştirdi:**

1. Sağlık/fitness uygulamalarında 30. gün tutunma **%3-4**; kullanıcıların
   %80'i üç ayda bırakıyor ve terk etme sebeplerinin başında **"zaman alan
   elle giriş"** var. Bizim uygulama seans başına ~15 sayı istiyordu.
2. Oyunlaştırma **başarısızlığı görünür kılmak** üzerine kurulduğunda
   zararlı, **toparlanmayı desteklemek** üzerine kurulduğunda faydalı.
   Bizde seri haftalıktı (iyi) ama kaçırdıktan sonrası tanımsızdı.

**En verimli tartışma ikinci sentezden çıktı.** Eleştirici "kaçırınca
hafiflet" dedi; sporcu itiraz etti: hafifletmek şefkat değil fizyoloji,
ama **neyi** düşürdüğün önemli. Sonuç iki mekanizmanın birbirinin tersi
olması gerektiği:

- **Deload** SET düşürür, hedef sabit kalır → biriken yorgunluğu boşaltır
- **Geri dönüş** HEDEF düşürür, set sabit kalır → seviyeyi yeniden bulur

Farklı problemler, ters çözümler, ikisi de doğru. Bir test bunu koruyor.

**Uygulananlar:**
- `ui/ErrorBoundary.tsx` — render hatası artık beyaz ekran değil kurtarma
  ekranı; en üstteki düğme ham veriyi indiriyor. Salonda seansın ortasında
  çöken bir uygulama bir yıllık alışkanlığı kırar.
- `storage.ts` — `SCHEMA_VERSION` + `migrate()`. Kural: **her göç adımı
  veri SİLMEZ**, şüphede eski değer korunur. İçe aktarma da aynı yoldan.
- Hızlı giriş — "hedefi yaptım" alanları hedefle **doldurur, kilitlemez.**
  Sürtünme 15 girişten 1 dokunuşa indi, veri doğruluğu korundu.
- `engine/comeback.ts` — 10+ gün ara → hedefler düşer, geri dönüş planı
  olarak sunulur. Mesajın suçlayıcı olmadığını bir test kontrol ediyor.
- Duvar handstand **ısınmanın içine** kondu. HSPU'nun denge yarısı
  programda hiç yoktu; ekstra yük olarak değil, kısa ve sık.
- `ui/Bodyweight.tsx` — haftalık tartı. Kalistenik göreli güç sporu;
  kilo değişimi tekrarları değiştirir ve sistem bunu güç değişimi sanar.
  Haftada bir sorulur, atlanabilir — günlük sormak tartı takıntısı besler.
- Form ipuçları Bugün ekranına taşındı. Veride vardı ama sadece Ağaç'ta
  görünüyordu; "dirsek öne" cümlesi hareketi yaparken lazım.
- **XP başlıktan kaldırıldı.** Dışsal ödül öne çıkarsa içsel motivasyonu
  zayıflatıyor (meta-analiz, etki ~ −0.36). Rütbe ve gün kaldı; XP
  İlerleme ekranında duruyor.

Genel ders: **bir sistemi tek gözle incelemek onu iyileştirmez.** Dört
bakış ayrı ayrı listeler üretti ama gerçek içgörü çarpıştıkları yerde
çıktı — sentezler, tekil önerilerin hepsinden iyiydi.

**D-061 · 2026-08-09 · Koç raporu — uygulama ile koçluk arasındaki boşluk**
Kullanıcı "Claude + Obsidian" fikirlerini sordu. Araştırıldı: registry'de
Obsidian bağlayıcısı yok, ve kullanıcının makinesinde **vault da yok** —
Obsidian kurulu ama hiç açılmamış. İnternetteki o fikirlerin çoğu zaten
Obsidian'da yaşayan insanlar için; sıfırdan kurmak kazancından fazla yük
olurdu. Üstelik istenen şey (koçun notları okuyup yazması) zaten dosya
erişimiyle mümkün, aracıya gerek yok.

Ama sorunun ardındaki ihtiyaç gerçekti: **uygulama telefonda, koçluk
konuşması bilgisayarda.** Aradaki boşluk şimdiye kadar kullanıcının kaç
tekrar yaptığını anlatmasıyla kapanıyordu — eksik ve yanlış hatırlanan
bir aktarım. Tam yedek JSON'u ise binlerce satır, sohbete yapıştırılamaz.

Çözüm: `engine/report.ts` → tek tuşla panoya kopyalanan, birkaç yüz
karakterlik özet. Dosya taşıma yok, senkron yok, ek araç yok.

İçerik seçimi, koçun karar vermek için gerçekten ihtiyaç duyduğu şeyler:
son 14 günün seansları ve sayıları, efor bilgisi (uyarlama kuralının
girdisi), son 3 seansın gidişatı, kademeler, hafta numarası ve deload
durumu. **İki seans üst üste düşen tekrar ayrıca işaretleniyor** — bu
erken uyarıdır, yorgunluk ya da teknik bozulması demek.

Rapor kişisel veri içermez: isim, ölçü, sağlık bilgisi girmez, sadece
antrenman sayıları. Test bunu doğruluyor (D-014).

Bir test de uzunluğu koruyor: 6 aylık yoğun kayıt simüle edilip raporun
4000 karakterin altında kaldığı doğrulanıyor. **Yapıştırılabilir olmak
bu özelliğin işlevsel gereksinimi**, süs değil — uzarsa kullanılmaz.

Raporun sonunda kullanıcıya sayıya girmeyen şeyleri yazması söyleniyor:
ağrı, uyku, isteksizlik. Uygulama sayıyı tutuyor, bağlamı tutmuyor; ve
antrenman kararlarını en çok etkileyen şey çoğu zaman bağlam.

**D-060 · 2026-08-06 · Terfi gerçek oldu, deload sisteme girdi**
Sistemin en uzun süredir açık duran vaadi kapandı. Terfi bugüne kadar
yalnızca İlerleme ekranında *duyuruluyordu*; Bugün ekranı sabit şablonu
okuduğu için altın kademeye çıkınca programda hiçbir şey değişmiyordu.
README'de bile "bu eksik" diye yazılıydı.

**Çözüm — şablon ŞEKLİ tarif eder, hareketi motor seçer.**
Haftalık şablonu tamamen planlayıcıya bırakmak yanlış olurdu: haftanın
şekli (hangi gün hangi nitelik, ne kadar, hangi sırayla) elle tasarlanmış
bir karar ve testlerle korunuyor. Ama slotun İÇİNDEKİ hareket sabit
olmamalı. Bu yüzden `ProgramExercise` alanına `track` eklendi — bir hedef
düğüm id'si. Slot, mevcut hareket altın kademeye ulaşınca o hedefe giden
yoldaki bir sonraki düğüme geçiyor. Çözümleme `engine/session.ts` içinde,
hem Bugün hem İlerleme ekranı aynı fonksiyonu kullanıyor (biri terfi
derken öbürünün dememesi mümkün değil, test bunu da doğruluyor).

İki gerçek hata testlerle yakalandı:

1. **Terfi geriye gidiyordu.** İlk sürüm tüm yolu arayıp "kademe
   kazanılmamış ilk çalışılabilir düğüm"ü seçiyordu. Kademe kazanılmamış
   bir slotta bu, yoldaki en alttaki düğümü döndürüyor ve sistem
   kullanıcıyı geriye götürüp buna *terfi* diyordu. Boş durumda 4 sahte
   terfi üretiyordu.
2. Düzeltmenin ilk hâli fazla katıydı ve hiç terfi üretmiyordu. Doğrusu:
   terfi **ileri** bakar — yol topolojik sırada geldiği için mevcut
   hareketin bulunduğu noktadan SONRASI aranır.

**Deload aynı katmana girdi.** Her 6. hafta set sayısı yarıya iniyor,
hedef tekrar aynı kalıyor, ölçüm günü kalkıyor. Tekrarı düşürmek yerine
set düşürmenin sebebi: tekrar düşünce hareket kolaylaşır ve uyaran
tamamen kesilir; amaç dinlenmek değil biriken yorgunluğu boşaltmak.

Hafta sayacı takvim haftası değil **kullanıcının haftası** — ilk kayıt
hangi gün atıldıysa oradan sayılıyor. Salı başlayan biri için 6. hafta
yine 6 hafta sonra geliyor.

15 yeni test. Ders tekrar doğrulandı: **iki gerçek mantık hatasının
ikisini de test yakaladı, gözle inceleme değil.** Terfi mantığı gibi
"görünürde çalışıyor" sanılan kodda bu fark belirleyici.

**D-059 · 2026-08-02 · Yük güvenlik kuralları teste bağlandı**
Kullanıcı programı gerçekten kullanmadan önce sordu: *"o kadar iyi ve
güvenilir mi?"* Doğru soru — ve cevap vermeden önce program yeniden
incelendi. İki gerçek kusur bulundu.

**1. Eksantrik sıklığı fazlaydı.** Negatif barfiks haftada 3 gün yazılıydı.
Eksantrik (negatif) çalışma kas hasarını konsantrikten daha fazla yapar ve
toparlanması daha uzun sürer. Barfiks çekemeyen biri için haftada 3 gün
negatif ilerlemeyi hızlandırmaz, sadece yorgunluk biriktirir. Üçüncü çekiş
günü **yatay düzleme** çevrildi (row): aynı kaslar, farklı açı, çok daha
az doku hasarı. Kural teste bağlandı — `negative-pullup` haftada en fazla
2 günde görünebilir.

**2. Ölçüm günü uyarısı eksikti.** Bir seti sonuna kadar götürdükten sonra
aynı kas grubunu ağır çalışmak, hem test sonucunu hem sonraki işi bozar.
Gün notuna yazıldı.

Ayrıca üç yapısal kural daha teste bağlandı: aynı hareket bir günde iki kez
yazılamaz, her sert günde hem itme hem çekme bulunur (tek yönlü yüklenme
olmaz), hiçbir gün 6 hareketi geçmez.

**Hâlâ eksik ve bilerek kayda geçiriliyor: DELOAD.** Bir yıllık programda
her 6-8 haftada bir hafif hafta olmalı; sistem bunu bilmiyor. Şu an elle
takip ediliyor. Uygulamaya girmesi gereken bir özellik.

Genel ilke: **bir tasarım kararı testle korunmuyorsa zamanla aşınır.**
Antrenman güvenliğiyle ilgili kararlar için bu daha da geçerli, çünkü
ihlalin bedelini kod değil kullanıcının dirseği öder.

**D-058 · 2026-08-02 · Kişisel plan depodan çıktı, sınır netleşti**
Kurucu: *"kişisel şeyler kalmasın GitHub'da ama seninle kişisel şeyleri
paylaşırım. Ben spor yapacağım, sen kalistenik kısmını GitHub'a dökeceksin,
genel hepsi için de bana koçluk yapacaksın."*

Net bir ayrım ve doğru bir içgüdü: **depo bir kalistenik sistemidir, bir
kişinin antrenman günlüğü değildir.** Halka açık bir projede birinin
kişisel salon bölünmesinin, sağlık verisinin ya da o haftaki tekrar
sayısının işi yok — ne mahremiyet açısından ne de proje tutarlılığı
açısından.

Bu tur temizlenenler:
- Kişiye özel salon programı (A/B/C hareket listeleri) ve `GYM_PLAN` sabiti
- Bugün ekranındaki salon hatırlatma kartı
- `program.ts` içindeki, kullanıcının sağlık durumuna ve o anki
  performansına doğrudan seslenen gerekçe metinleri → genel ifadelere
  çevrildi (bu satırı yazarken bile örnek vermemek gerekiyor: temizliği
  anlatırken veriyi tekrar yazmak aynı sızıntıdır, ve bu hata bu projede
  iki kez yapıldı)
- `storage.ts` **varsayılan durumundaki sağlık kısıtları.** Bu en önemlisiydi:
  el ve bilek kısıtları uygulamanın varsayılan state'ine gömülüydü, yani
  uygulamayı açan HERKES o kısıtlarla başlıyordu. Artık `constraints: []`
  ve şema örnek olarak yorumda duruyor; kullanıcı kendi durumunu Ayarlar'dan
  girer. (D-014 ve D-044'ün gereği, ilk seferde eksik uygulanmış.)

Depoda kalan: **3 sert / 2 hafif / 2 boş** yapısı ve gerekçesi. Bu kişisel
bir tercih değil, genellenebilir bir tasarım kararı — "kalistenik başka
antrenmanın yanında çalışabilmeli" kısıtından çıkıyor. Şablon artık gün
adları yerine indekslerle (1·3·5, 2·6, 4·7) anlatılıyor.

Ders: **kişisel veri yalnızca metinde değil, VARSAYILAN DEĞERLERDE de
sızar.** Bir sağlık kısıtını `DEFAULT_STATE` içine yazmak, onu README'ye
yazmakla aynı şey — hatta daha kötü, çünkü göze çarpmıyor.

**D-057 · 2026-08-02 · Program başka antrenmanın yanında çalışacak şekilde kuruldu**
Ufuk 6 aydan en az 1 yıla çıktı ve kullanıcının haftada birkaç gün ağırlık
da çalışacağı netleşti. Program bu kısıtla yeniden kuruldu — kişisel
detaylar değil, kısıtın kendisi kayda değer:

**Yapı: 3 sert / 2 hafif / 2 boş.**

1. **Beceri işi önce.** Pike şınav, negatif barfiks ve skapular iş motor
   öğrenmedir; yorgunken yapılırsa yanlış kalıp öğrenilir. Ağır bir itme
   seansından sonra pike şınav hem işe yaramaz hem risklidir.

2. **Yük aynı güne toplanır, dağıtılmaz.** Kalistenik ve diğer antrenman
   ayrı günlere konursa haftada 6 antrenman günü olur ve dirsek, bilek,
   omuz hiçbir gün tamamen boşta kalmaz. Kas 48 saatte toparlanır, tendon
   ve bağ dokusu daha yavaş — sakatlık oradan gelir.

3. **Ama yine de 2 hafif gün.** Beceri SIKLIK ister; haftada 3 kez pike
   şınav ile 5 kez arasında öğrenme farkı var. Hafif günler hacim için
   değil temas için: RIR 3-4, başarısızlık yok. Kullanıcının ilk isteği
   "her gün şınav ve barfiks" idi ve arkasındaki içgüdü doğruydu.

4. **İtme hacmi çakışması.** Ağırlık çalışan biri için bench ve omuz press
   aynı dokuyu vuruyor. Bu yüzden buradaki itme hacim değil BECERİ olarak
   kuruldu: az set, düşük tekrar, yüksek kalite. Aynı mantıkla bacak işi
   minimumda — ağırlık bacağı kalistenikten iyi karşılıyor.

8 program testi bu yapıyı koruyor: iki sert gün arka arkaya gelemez, hafif
günlerde RIR ≥ 3, ölçüm günü haftada bir, her egzersiz gerçek bir hareketi
işaret eder, bar gerektiren her hareketin alternatifi var. **Tasarım kararı
testle korunmuyorsa zamanla aşınır.**

**D-056 · 2026-08-02 · Kronometre ve uçtan uca akış testi**
İlk antrenman günü geldi. İki pratik boşluk kapatıldı.

**Kronometre.** Plank ve ölü askı SANİYE cinsinden ölçülüyor ama uygulamada
sayaç yoktu; kullanıcının antrenman ortasında başka bir uygulama açması
gerekiyordu. Her seansta tekrar eden bir sürtünme, ve tam da uygulamanın
var olma sebebine aykırı. Tutuş sayacı ölçtüğü süreyi doğrudan ilk boş set
alanına yazıyor. Ayrıca set arası dinlenme sayacı (60/90/120/180 sn).

Teknik not: geçen süre **başlangıç zaman damgasından** hesaplanıyor, sayaç
artırarak değil. Sekme arkaya alınınca `setInterval` yavaşlar veya durur;
telefon kilitlenip açıldığında süre yanlış olurdu.

**Uçtan uca test** (`src/ui/flow.test.tsx`, 18 test). O ana kadar 52 test
vardı ve hepsi motoru doğruluyordu — fonksiyonlar doğruydu ama ekranların
bir araya gelmiş hâlini kimse çalıştırmamıştı. `tsc` temiz ve testler
yeşilken uygulama ilk açılışta çökebilirdi. İlk antrenman gününde bunun
olması kabul edilemezdi.

Test gerçek React bileşenlerini jsdom içinde sürüyor: kalibrasyon
doldurulur, seans girilir, kutlama tetiklenir, sayaç geri sayar, tüm
ekranlar hem boş hem dolu durumda açılır, ağaçta düğüme dokunulur.

Doğrulanan kritik davranış: **30 şınav girilince pushup master kademeye
çıkıyor ve XP geliyor.** Yani kalibrasyon gerçekten işe yarıyor, uygulama
boş açılmıyor. Ayrıca 197 hareketin tamamının bir poza düştüğü test edildi.

Tarayıcı kurulamadığı için görsel doğrulama hâlâ eksik — bu test çökmediğini
kanıtlar, güzel göründüğünü değil. Fark bilinçli olarak kayda geçiriliyor.

Ders: **birim testi sayısı çalışan uygulama demek değildir.** 52 test
geçiyordu ve hiçbiri uygulamayı açmamıştı.

**D-055 · 2026-08-01 · Figürler "sarhoş" görünüyordu — iskelet açıya geçti**
Kurucu: *"o kadar kötü ki adamlar uyuşturucu içmiş gibiler."* Teşhis nettir
ve tasarım hatasıdır: poz, eklem **KONUMLARI** olarak tanımlanmıştı. İki
kare arasında ara değer alınırken ön kol uzuyor, sonra kısalıyordu. Gerçek
bir bedende kemik boyu sabittir; göz bu ihlali anında yakalar ve lastik /
sarhoş olarak okur. Dosyada *"uzuv uzunlukları ±%20 oynayabilir, 80
pikselde görünmez"* diye yazmıştım. Yanlıştı — görünmüyor değil,
**anlaşılmıyor**; beden yanlış hissettiriyor.

Doğrusu ileri kinematik (FK): poz = kök nokta + AÇILAR.
- Kemik boyu **yapı gereği** sabit; uzaması imkânsız.
- Açı interpolasyonu uzvu **doğal yay** üzerinde taşır. Önceki sürümde
  elle eklenen "ara kare"lerin çoğu bu yüzden gereksizleşti — dirsek artık
  kendiliğinden dışarı savrularak çıkıyor, gövdenin içinden geçmiyor.
- Baş boyuna sabitlendi (önce bağımsız süzülüyordu), yarıçapı 7.5→6.4.

İki ek düzeltme, ikisi de gözle bakınca çıktı:
1. **Temas noktaları çakılmalı.** Yerdeki el, bardaki el ve yerdeki ayak
   ters kinematikle sabitleniyor. Çömelmede ayak havada kalıyordu.
2. **Kontur.** Her uzuv iki kez çiziliyor: önce arka plan renginde geniş
   kontur, sonra dolgu. Kontursuz çizimde kol gövdenin önünden geçtiğinde
   tamamen kayboluyordu — barfikste kol ve gövde tek kalın çizgiye
   dönüşüyordu.

Süreç kararı: pozlar artık `tools/rig/poses.py` içinde yazılıyor ve
`emit.py` TypeScript dosyasını **üretiyor**. Sebep: aynı iskelet matematiği
hem önizleme aracında hem uygulamada gerekiyor; iki yerde elle tutulursa
kaçınılmaz olarak ayrışır. Önizleme neyi gösteriyorsa uygulama onu çiziyor.

Ders: **görsel işi gözle doğrula, kod doğrulamasıyla değil.** tsc temiz,
52 test geçiyordu ve figürler sarhoş görünüyordu. Poz değişince
`render.py strip` ile şerit bas ve bak.

**D-054 · 2026-08-01 · Service worker iki sürümü görünmez etti**
Kurucu: *"linkte değişen ne var ki."* Haklıydı — hiçbir şey değişmemişti,
çünkü **görebilmesi mümkün değildi.**

`sw.js` v1 cache-first yazılmıştı: gelen her isteği önce önbellekte arıyor,
bulursa ağa hiç çıkmıyordu. `index.html` bir kez önbelleğe girdikten sonra
sonsuza kadar oradan servis edildi. Önbellek adı da (`ascend-v1`) hiç
değişmediği için `activate` temizliği de asla tetiklenmedi. İki sürüm
boyunca push edilen her şey sunucuda duruyordu, kullanıcıya ulaşmıyordu.

Doğrusu — istek tipine göre ayrı strateji:
- **HTML / gezinme → önce ağ.** Güncellik önemli; ağ koparsa önbellek.
- **`/assets/*` → önce önbellek.** Vite dosya adına hash koyuyor, içerik
  asla değişmiyor; burada cache-first hem doğru hem hızlı.

Kural olarak yazıldı: **adı değişmeyen bir dosyayı cache-first servis etme.**

Ayrıca `controllerchange` dinleyicisi eklendi — yeni sürüm devralınca sayfa
bir kez yenileniyor. Bu olmadan kullanıcı güncellemeyi ancak ikinci
açılışta görürdü.

Ders: **"push ettim, canlıda" demek "kullanıcı görüyor" demek değildir.**
Doğrulama zinciri paket hash'ini kontrol etmekle bitiyordu; oysa araya
kullanıcının cihazındaki service worker giriyordu. Sunucudaki dosyayı
doğrulamak yeterli değil, teslim yolunun tamamı doğrulanmalı.

**D-053 · 2026-08-01 · Uygulamada beden yok — figür motoru eklendi**
Kurucunun geri bildirimi: *"eklediğin şeylere saygı duydum da pek içimi
açmadı, iyi bir proje olmadı yani sanki."* İki kez üst üste aynı hatayı
yaptığım ortaya çıktı: "oyun gibi hissettirmiyor" eleştirisine **daha çok
sayı** ile cevap verdim. Rütbe bir sayı, seri bir sayı, boss HP bir sayı,
Ascension altı sayı. Eleştirinin kategorisi sayı değildi.

Teşhis: uygulamada **tek bir görsel yoktu.** 197 hareket vardı, hepsi
kutu + yazı olarak çiziliyordu. Kurucunun motivasyon cümlesi ise şuydu:
*"kendimi handstand push-up yaparken düşünmek bile motive ediyor."*
Yani bedeni hayal etmek motive ediyordu; uygulama ise beden hakkında
**sayı** gösteriyordu. Aradaki fark projenin tamamını açıklıyor.

Çözüm — üç parça:

1. **Figür motoru** (`src/ui/figure/`). Eklem koordinatlarından çizilen
   SVG siluet + hareket başına iki kare (alt/üst) + SMIL animasyonu.
   Figür hareketi gerçekten *yapıyor.* Animasyon SMIL ile çünkü JS döngüsü
   yok: ekranda 6 figür olsa bile pil maliyeti sıfıra yakın, telefonda
   antrenman boyunca açık duracak.

   **197 çizim yapılmadı — 25 poz yapıldı ve hareket AİLELERİNE bağlandı.**
   Veride zaten 26 aile vardı. Yeni hareket eklendiğinde ailesi bir poza
   düşer; çizim borcu birikmez. Bu, "Expand Forever" ilkesinin görsel
   katmandaki karşılığı. Ailenin ortalaması yanlış kalan ikonik hareketler
   (HSPU, hollow, plank) id bazında ezilir.

   Doğrulama: 50 karenin tamamı PNG'ye basılıp gözle incelendi. Dört poz
   yanlıştı (şınav yerde yatıyordu, squat diz çökmüş görünüyordu, muscle-up
   tuvalden taşıyordu, dip masaya yaslanmış gibiydi) — düzeltilip yeniden
   basıldı. **Görsel iş görsel doğrulama ister; tsc'nin temiz olması bir
   çizimin doğru olduğunu söylemez.**

2. **Avatar** (`src/ui/Avatar.tsx`). İlerleme ekranının tepesinde: önde sen,
   şu anki ana hareketini yaparken, kademe renginde. Arkanda hedefin
   hayaleti — kesikli, soluk, hareketsiz. "Henüz orada değilsin ama duruyor."
   Siluetin ışıması güç eksenine bağlı, ilerledikçe belirginleşiyor.

3. **Kalibrasyon** (`src/ui/Calibrate.tsx`). İkinci teşhis: uygulama ilk
   açıldığında **her sayı sıfırdı.** Rütbe Beginner I, seri 0, 22 boss tam
   canlı, 0/8 unvan. Boş bir kayıt dosyası oyun değildir. Üstelik 30 şınav
   çekebilen birine duvar şınavı önermek hem yanlış hem moral bozucu.
   İlk açılışta 8 ölçüm noktası sorulur, mastery tohumlanır, ağacın büyük
   kısmı açılır. Ekranda açıkça yazıyor: gerçek sayını yaz, şişirirsen
   uyarlama kuralı zaten aşağı çeker, sadece bir hafta kaybedersin.

Sonradan eklendi — hareket akıcılığı: iki kare arasında doğrusal geçiş
uzuvları bedenin içinden geçiriyordu (barfikste dirsek gövdeyi kesiyordu).
Yolu eğri olan hareketlere **ara kare** (`m`) eklendi: şınav, barfiks,
HSPU, dips, squat, muscle-up, pike, bacak kaldırma. Kare sırası artık
alt → ara → üst → ara → alt; dönüş noktalarında yavaşlıyor, ortada
hızlanıyor. Gerçek bir tekrarın ritmi bu.

Genel ders — bir sonraki ajan için: **kullanıcı "his" hakkında konuşuyorsa
sistem ekleme.** Sistem eklemek ölçülebilir olduğu için güvenli hissettirir;
his üretmez. Bu projede iki tur kaybedildi.

**D-046 · 2026-07-26 · Skill Slot rol tabanlı yeniden tasarlandı**
v2.0'daki "8 serbest slot" modeli yanlıştı — hepsi eşit statüdeydi.
Doğrusu: slotların **rolü** var (Main / Secondary / Technique / Finisher),
hareketler roller arasında dolaşıyor. Normal şınav hiç gitmiyor, terfi
ediyor.

Kurucunun modeline iki katkı yapıldı:
1. **Terfi mastery ile olur, takvimle olmaz.** Taslak "ay 1, ay 2" diyordu;
   takvim keyfi. Main altın kademeye ulaşınca terfi eder.
2. **4 slot = 4 farklı nitelik**, 4 egzersiz değil. Main yoğunluk,
   Secondary hacim, Technique motor öğrenme, Finisher kapasite. Bu,
   "Volume RPG mi skill tree mi" tartışmasının çözümü: hacim Secondary ve
   Finisher'da yaşar, beceri Main'de ilerler.

Eleştiri olarak eklenenler: 4 slot her ağaç için doğru değil (Balance'ta
hacim yok, Mobility'de rotasyon yok) → ağaç başına slot şablonu.
Ve slot ≠ seans → 14 slot günlere dağıtılır. Detay: `18.12`

**D-047 · 2026-07-26 · Progression Planner eklendi — projenin en büyük eksiğiydi**
*"Ağaç nereye gideceğini söylüyor. Planner yarın tam olarak ne yapacağını
söylüyor."* Bu katman hiç yoktu.

**Kritik bulgu: deterministik, LLM gerektirmiyor.** Graf var, mastery
durumu var, slot şablonu kural. Hedeften geriye ata zinciri çıkar, ilk
bronz olmayan node Main olur, bir altı Secondary olur, kısıt filtresi
uygulanır, günlere dağıtılır. Hesaplanabilir bir fonksiyon.
`D-022` (Faz 3 LLM'siz) ile uyumlu. Detay: `18.19`

**D-048 · 2026-07-26 · Duolingo çerçevesi vizyona eklendi**
*"Duolingo dil öğrenmeyi nasıl oyunlaştırdıysa, biz de kalistenik
öğrenmeyi oyunlaştırıyoruz. Kullanıcı kas değil, skill geliştiriyor."*
İşlevsel tarafı var: Duolingo kelime listesi vermez, sıradaki dersi verir.
Ascend hareket listesi vermez, sıradaki 4 slotu verir.

**D-049 · 2026-07-26 · Eşikler RIR 2'de tanımlanır + haftada bir test günü**

**Çözülen çelişki:** Kurucu oyunlaştırmanın işleyiş biçimini şöyle anlattı:
*"altın/gümüş/bronzu gördükçe derim ki 2 tane daha yapayım, yarın altına
çıkayım."* Yani motivasyon **sonraki kademeye yakınlığı görmekten** geliyor,
kademeye ulaştıktan sonraki kutlamadan değil.

Ama bu doğrudan `M-3` ve `FP-2` ile çatışıyor: ekran "altına 2 tekrar kaldı"
derse kullanıcı her gün maksimuma çıkar. Aradan sonra sakatlığın bir
numaralı sebebi bu.

**Karar — iki parçalı:**

1. **Mastery eşikleri RIR 2'de tanımlıdır.** "Altın 15 tekrar" demek
   "başarısızlığa 2 kala 15" demek, "canını dişine takıp 15" demek değil.
   Böylece kademe kovalamak maksimuma çıkmayı gerektirmiyor.
2. **Haftada bir gün "test günü"** — o gün bir harekette RIR 0'a
   (başarısızlığa) çıkılabilir. Diğer günler hacim günü.

**Sonuç:** yakınlık göstergesi her gün görünür (motivasyon korunur), ama
"bugün zorla" izni haftada bir (sağlık korunur). Oyunlaştırma sağlığa
zarar vermeden çalışıyor.

**[TASARIM] Bunun UI karşılığı:** Bugün ekranındaki her slotun yanında
sonraki kademeye kalan mesafe görünür — *"gümüş 10'da, sende 8"*. Ağaç
haftalık yönelim aracı; **günlük motoru bu yakınlık göstergesi.**

**D-041 · 2026-07-26 · Depo PUBLIC (revize edildi)**

*İlk karar:* private, fikrin kopyalanmaması için.
*Revizyon:* public. Gerekçe: **aktiflik görünür olmalı.** Görünmeyen bir
depo ne katkı grafiğinde anlamlı yer tutar ne de okunabilir.

Fikrin kopyalanması riski gerçekçi değil: oyunlaştırılmış kalistenik
uygulaması fikri yeni değil, benzerleri var. Bu projeyi ayıran şey 196
düğümlük doğrulanmış graf, sayısallaştırılmış mekanikler, karar günlüğü ve
bitirilmiş olması. Bunlar kopyalanamaz; kopyalanabilen tek şey fikrin bir
cümlesi ve o kimseye yetmez.

**Public'e geçmenin ön koşulu vardı ve karşılandı:** kişisel veri depodan
çıkarıldı (bkz. D-044) ve commit geçmişindeki e-posta gizlendi (D-045).
Bu sıra önemli — tersi yapılırsa sağlık verisi kalıcı olarak açığa çıkar.

**D-044 · 2026-07-26 · Kişisel veri depodan ayrıldı**
Public'e geçmeden önce yapılan temizlik. `v2.0` kendi kuralını (`D-014`:
içerik ve kullanıcı verisi asla karışmaz) ihlal ediyordu — tasarım
dokümanında yaş, kilo, cerrahi implant bilgisi ve mezuniyet tarihi vardı.

| Depodan çıkan | Yerine gelen |
|---|---|
| Yaş / boy / kilo değerleri | "Yaş, boy, vücut ağırlığı **kategori olarak** modellenir" + her birinin sistem etkisi |
| El kısıtının kişisel detayı | Genel **Kullanıcı Kısıtları** sistemi: kısıt şeması, `handLoad` etiketleme, güvenli alternatif önerisi |
| Mezuniyet tarihi ve CV gerekçesi | "Açık geliştirme bir **disiplin aracıdır**" |

Kişisel profil depo dışındaki yerel bir dosyada tutulur ve `.gitignore`'da.

**Kritik nokta:** Bu temizlik sistemi zayıflatmadı, **genelleştirdi.**
Tek kullanıcının el kısıtı, geçmiş sakatlığı olan herkes için çalışan bir
özelliğe dönüştü. Tasarım gerekçelerinin tamamı depoda kaldı — "ara vermiş
kullanıcı için comeback modeli gerekli" yazar, *kimin* ara verdiği yazmaz.

**D-045 · 2026-07-26 · Commit geçmişindeki e-posta gizlendi**
7 commit'in yazar/committer alanı kişisel Gmail adresinden GitHub'ın
`ID+kullanıcı@users.noreply.github.com` formatına çevrildi ve zorla
gönderildi.

**Neden ID'li format:** Eski `kullanıcı@users.noreply` formatı 2017
sonrası açılan hesaplarda profile bağlanmaz — commit'ler katkı grafiğine
sayılmaz. Aktiflik görünürlüğü bu projenin amaçlarından biri olduğu için
ID'li form zorunlu.

*Bedeli:* geçmiş yeniden yazıldı, zorla gönderim gerekti. Depoda başka
katkıcı olmadığı için güvenliydi. **İleride katkıcı olursa bu bir daha
yapılmaz.**

**D-042 · 2026-07-25 · Kullanıcı Kısıtları sistemi eklendi**
Geçmiş sakatlığı olan kullanıcı için "hangi hareket riskli" gerçek bir
soru ve sistemin cevabı olmalı. Kısıt listesi + `handLoad` etiketleme +
güvenli alternatif önerisi tasarlandı (`18.16` öncesi bölüm).

**Kural:** Sistem hareketi yasaklamaz, işaretler. Sağlık profesyoneli
onayı ilgili zincirleri *açar* ama yüksek riskli hareketleri listeye geri
getirmez — aynı kazanım daha güvenli bir yoldan elde edilebiliyorsa riskli
yol gereksizdir.

Bu, tek bir kullanıcının ihtiyacından çıkıp genel sistem özelliğine
dönüşen ilk örnek. *Kaynak: `06_Charter` — "benim gibi insanlar".*

**D-043 · 2026-07-25 · Comeback Modeli beklentisi yukarı revize edildi**
Ara vermiş kullanıcının geçmişinde koordinasyon-yoğun bir spor geçmişi
varsa (dövüş sanatı, jimnastik, yüzme gibi), geri dönüş beklenenden hızlı
olur.

Genel kural: **kaybedilen şey güç, korunan şey koordinasyon.** Güç hızlı
geri gelir, koordinasyon yavaş kaybolur. Yerleştirme (`18.17`) bu geçmişi
sormalı ve denge/mobilite kategorilerinde başlangıç noktasını yukarı
almalı.

**Ama ilk 8 haftadaki hacim freni değişmez** — tendon uyumu
koordinasyondan yavaştır. *Kaynak: FP-2.*

**D-040 · 2026-07-25 · Ranks, Titles'tan ayrı sistem**
Kaynak dosyalarda ayrı listelenmişti. Titles = karakter (nasıl
çalıştığın), Ranks = seviye (nerede olduğun). Rütbe, mastery'ye ulaşılan
node'ların tier **medyanından** hesaplanır — ortalama tek bir yüksek
node ile şişirilebilir.

---

<a name="30_openquestions"></a>
# 30 · OPEN QUESTIONS

Tüm açık soruların merkezi listesi. Bölümlerdeki `[RESEARCH]` işaretleri
buraya toplandı.

## ⭐ v2.0 · Bir haftalık planlamada cevaplanacaklar

Bunlar `26_Backlog`'daki 7 günlük takvimin gündemi:

| # | Soru | Gün | Bölüm |
|---|---|---|---|
| S-26 | Yerleştirme testi hangi 6-8 hareketten oluşur, eşikleri ne? | 2 | `18.17` |
| S-27 | Test sonucu ön koşulları otomatik bronz saymalı mı? (M-1 gerilimi) | 2 | `18.17` |
| S-28 | 196 hareketin `sessionBlock` ataması ne olacak? | 3 | `18.11` |
| S-29 | Bir node haftada kaç kez tekrarlanmalı? Beceri sıklık ister, güç toparlanma — çelişki | 3 | `18.11` |
| S-30 | Aktif kadro 8 slot doğru mu? Seviyeyle nasıl artar? | 4 | `18.12` |
| S-31 | Yoğunluk çarpanları ne? (3-1-3 tempo ≈ normalin %60'ı mı?) | 4 | `18.13` |
| S-32 | Yoğunluk XP'yi nasıl etkiler — aynı XP mi, çarpan mı? | 4 | `18.13` |
| S-33 | Kaç haftalık kayıtsızlık "ara" sayılır? (tahmin: 6 hafta) | 4 | `18.16` |
| S-34 | Kaç ekran olacak ve aralarındaki akış ne? | 5 | — |
| S-35 | i18n sarmalayıcısı hangi şemayla? (`tips: {tr, en}`) | 6 | `16` |
| S-36 | Faz 1 kapsamı tam olarak ne? (7. günde kilitlenir) | 7 | `22` |

## Kritik — Faz 1'i etkiler

| # | Soru | Bölüm |
|---|---|---|
| S-01 | Mastery eşikleri (196 hareket) tek kişinin yargısı. Doğrulama kaynağı ne? | `10`, `21` |
| S-02 | Pull-up bronz 3 tekrar gerçekten "yapabiliyorum" mu? Eşikler çok mu düşük? | `26` B-01 |
| S-03 | `progressTest` yok: hold süresi hangi form kriteriyle sayılır? | `26` B-05 |
| S-04 | IndexedDB tek kaynak → kullanıcı düzenli yedek alır mı? Otomatik hatırlatma gerekli mi? | `16` |
| S-05 | XP sadece kademede veriliyor; kademeler arası motivasyon boşluğu olur mu? | `18` |

## Önemli — Faz 2-3'ü etkiler

| # | Soru | Bölüm |
|---|---|---|
| S-06 | Skill Genome: 18 öznitelik doğru sayı mı? | `11` |
| S-07 | Öznitelik değerleri neye göre atanacak (literatür / koç yargısı)? | `11` |
| S-08 | Kullanıcı profili türetmesinde `max` fazla iyimser mi? Decay gerekli mi? | `11` |
| S-09 | `regression_of` ile `prerequisites` arasındaki sınır nerede? | `12` |
| S-10 | ProgressPredictor minimum kaç haftalık veriyle anlamlı? | `13` |
| S-11 | Ascension Score ağırlıkları ne olmalı? | `18` |
| S-12 | Seviye 100 tavanı doğru mu? Ulaşılamaz kalması iyi mi? | `18` |

## Yapısal — anayasa/kapsam soruları

| # | Soru | Bölüm |
|---|---|---|
| S-13 | "Elit" ölçülebilir tanımı ne? (Şu an: 5 boss bronz — keyfi) | `01` |
| S-14 | Ölçülemeyen ama önemli şeyler kaybediliyor mu? (örn. "handstand'de rahat hissetmek") | `02` |
| S-15 | FP-2 (dinlen) ile oyunlaştırma (devam et) gerilimi yeterince çözüldü mü? | `03` |
| S-16 | M-5 mutlak mı? "Kendi 6 ay önceki halinle karşılaştırma" izinli — sınır nerede? | `04` |
| S-17 | Beslenme gerçekten kapsam dışı mı? Uyarı seviyesinde bile olmasın mı? | `07` |
| S-18 | Delete Test'i kim uygular? (Aday: AI Red Team) | `08`, `14` |
| S-19 | K-2 (bronz yeterli) bazı kritik geçişlerde gold şartı gerektirir mi? (Aday: front lever, planche) | `09` |
| S-20 | Freestyle ağacı gerçekten reddedilmeli mi? | `19` |
| S-21 | Nordic Curl derinlik 3'te ama tier 6 — zincir çok mu kısa? | `19` |
| S-22 | AI Council rolleri ayrı çağrılmalı mı, tek AI'a "şu açılardan bak" yeterli mi? | `14` |
| S-23 | Bu yönetişim tek kişilik proje için fazla ağır mı? | `15` |
| S-24 | Depo public mi private mı? Hareket veritabanı açık kaynak olsun mu? | `23`, `24` |
| S-25 | Bu dosya hangi noktada bölünmesi gerekir? (Şu anki görüş: bölünmemeli) | `25` |

---

<a name="31_futurevision"></a>
# 31 · FUTURE VISION

## 10 yıl sonra

Bu bölüm plan değil, **yön.** Buradaki hiçbir şey taahhüt değil.

### Veri olarak
196 hareket 400+ olur. Rings, freestyle, weighted, gymnastics ayrı ağaçlar
olarak yaşar. Her hareketin genomu, videosu, hikayesi vardır. Veritabanı
kalistenik için bir **referans** haline gelir — uygulamadan bağımsız değer
taşır.

### Sistem olarak
Skill Genome olgunlaşır. Sistem bir hedefe bakıp "sende şu eksik" diyebilir
ve bu doğru çıkar. Yeni bir hareket eklendiğinde ağacın neresine oturacağını
genom benzerliğinden önerir.

### Kullanıcı olarak
Kurucunun 10 yıllık kaydı vardır. Timeline'da 2026'daki ilk wall push-up
kaydı görünür. Bu, projenin en değerli çıktısı olabilir — kod değil, kayıt.

### Topluluk olarak (belki)
Hareket veritabanı açık kaynak olur, düzeltmeler topluluktan gelir.
Ama uygulama sosyal olmaz — M-5 10 yıl sonra da geçerlidir.

## Ne değişmez

Anayasanın 8 maddesi. Vizyon cümlesi. First Principles.

Bunlar değişirse proje başka bir proje olur, gelişmiş bir versiyonu olmaz.

## Ne kesinlikle değişir

- Arayüz (birkaç kez baştan yazılacak)
- Platform (web → mobil → bilinmeyen)
- Faz planı (bu dosyadaki tarihler kayacak)
- Mastery eşikleri (veri geldikçe düzelecek)
- Bu dosya (büyümeye devam edecek)

## Son not

> Bu proje bir spor uygulaması olarak başladı. Şu an olduğu şey daha çok
> **kalistenik öğrenmenin bir haritası** — uygulama o haritanın
> arayüzü. Harita uygulamadan uzun yaşar. Bu yüzden `data/movements.json`
> bu projenin en değerli dosyası, kod değil.

---
---

*Bu dosya Project Ascend'in kurumsal hafızasıdır. Güncel tutulmazsa
değerini kaybeder. Her oturum `_CHECKPOINT.txt` güncellemesiyle biter;
her kalıcı karar `29_DecisionHistory`'ye girer.*

**Son güncelleme: 2026-08-15**
