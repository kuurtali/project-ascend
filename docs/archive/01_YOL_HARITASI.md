# Project Ascend — Teknik Yol Haritası

**Sürüm:** 1.0 · **Tarih:** 25 Temmuz 2026 · **Durum:** Faz 0 tamamlandı

Bu doküman `_CHECKPOINT.txt`'in "ne yapacağız" tarafıdır. Veri temeli
(`data/movements.json`) hazır; buradan sonrası inşa planı.

---

## 1. Önce dürüst teşhis

Elimizde 9 vizyon dosyası ve 40'tan fazla "gelecek sistem" fikri var: Skill DNA,
Skill GPS, Knowledge Graph, Ghost Replay, Prestige, New Game+, Constellation
Mode, Skill Fusion... Fikirler iyi. Sorun şu: **hepsi eşit öncelikte yazılmış.**

Bu projeyi bitirecek olan şey teknik zorluk değil, kapsam. 40 sistemi paralel
kovalayan bir proje hiçbirini bitirmez. Bu yüzden yol haritasının ilk işi
fikirleri *sıraya sokmak*, hepsini onaylamak değil.

Ölçüt basit: **Kurucu 5 ay boyunca haftada 4 gün bu uygulamayı gerçekten
kullanabiliyor mu?** Bir özellik bu sorunun cevabını değiştirmiyorsa Faz 1'de
yoktur.

---

## 2. Platform önerisi

**Öneri: Web öncelikli, yerel-öncelikli (local-first) tek sayfa uygulaması.**

| Katman | Seçim | Neden |
|---|---|---|
| Dil | TypeScript | Veri şeması tipli olur; 196 node'lu bir grafta tip hatası en sık hata kaynağıdır |
| UI | React + Vite | En geniş ekosistem, hızlı yeniden derleme |
| Stil | Tailwind CSS | Tema/renk sistemi veriden (kategori renkleri) beslenebilir |
| Graf görünümü | SVG + kendi yerleşim kodumuz | Hazır graf kütüphaneleri skill tree için fazla genel; bizim ağacımız katmanlı (depth) ve elle ayarlanmak isteniyor |
| Veri | Statik `movements.json` | Sunucu gerekmez, sürümlenebilir, offline çalışır |
| Kullanıcı kaydı | IndexedDB (Dexie.js) | Telefonda offline çalışır, kota büyük, spor salonunda internet gerekmez |
| Dağıtım | Statik hosting (Netlify/Vercel/GitHub Pages) | Ücretsiz, backend yok, bakım yok |
| Mobil | Sonradan Capacitor sarmalama | Aynı kod tabanı App Store/Play'e çıkar; şimdi ayrı mobil proje açmak kod ikizi yaratır |

**Neden mobil-native değil?** Native (React Native/Flutter) sonunda gerekebilir,
ama şimdi değil. Native'in tek gerçek avantajı bildirim ve mağaza dağıtımı;
ikisi de Faz 1 sorusu değil. Web ile aynı kod hem telefonda hem masaüstünde
çalışır ve iterasyon 5-10 kat hızlıdır — kodu Claude yazdığı için iterasyon
hızı en değerli kaynak.

**Neden backend yok?** Tek kullanıcı için sunucu, veritabanı, kimlik doğrulama
ve aylık maliyet demektir. Bulut senkronizasyonu Faz 4'te, gerçekten birden
fazla cihaz/kullanıcı olduğunda eklenir. Yerel-öncelikli mimari bunu sonradan
eklemeyi engellemez (bkz. ADR-004).

---

## 3. Mimari

```
┌──────────────────────────────────────────────────────┐
│  UI KATMANI (React)                                  │
│  Skill Tree · Hareket Detayı · Antrenman · İstatistik │
└────────────────────────┬─────────────────────────────┘
                         │  (sadece okuma + aksiyon çağrısı)
┌────────────────────────▼─────────────────────────────┐
│  MOTOR (saf TypeScript, UI'dan bağımsız, test edilir) │
│  ┌────────────┬───────────┬───────────┬────────────┐ │
│  │ UnlockEngine│ XPEngine  │QuestEngine│ CoachEngine│ │
│  │ kilit/açık  │ XP-seviye │ görevler  │ öneri/zayıf│ │
│  └────────────┴───────────┴───────────┴────────────┘ │
└────────┬──────────────────────────────┬──────────────┘
         │                              │
┌────────▼──────────┐        ┌──────────▼──────────────┐
│ İÇERİK (salt oku) │        │ KAYIT (okuma-yazma)     │
│ movements.json    │        │ IndexedDB               │
│ 196 node, sürümlü │        │ setler, mastery, XP,     │
│                   │        │ seri, ölçümler          │
└───────────────────┘        └─────────────────────────┘
```

**Değişmez kural:** Motor katmanı DOM bilmez, React bilmez. Girdi olarak
`(movements, playerState)` alır, çıktı olarak yeni durum döndürür. Bunun sonucu:
her oyun kuralı ayrı ayrı test edilebilir ve UI baştan yazılsa bile mekanikler
korunur.

**İkinci değişmez kural:** İçerik ve kayıt asla karışmaz. `movements.json`
güncellendiğinde (yeni hareket, düzeltilmiş onkoşul) kullanıcı ilerlemesi
bozulmaz, çünkü kayıt sadece `id`'ye referans verir.

### Veri akışı örneği
Kullanıcı "Pull-up 3×8 yaptım" der →
`SetLog` IndexedDB'ye yazılır →
`XPEngine` mastery kademesi değişti mi bakar (8 ≥ silver eşiği) →
değiştiyse XP verir, seviye kontrolü yapar →
`UnlockEngine` bronze'a ulaşılan node'ların çocuklarını açar →
UI yeni açılan node'ları animasyonla gösterir.

---

## 4. Oyun mekanikleri — sayısal tanımlar

Vizyon dosyalarında "XP, seviye, mastery" yazıyordu ama hiçbir sayı yoktu.
Sayılar olmadan bunlar özellik değil, temenni. İşte tanımlar:

### 4.1 XP
```
base_xp(tier)   = round_5( 30 × 1.53^tier )      # tier 0 = 30, tier 9 ≈ 1300
mastery_xp(t)   = round_5( base_xp × çarpan[t] )
çarpan          = bronze 1.0 · silver 1.6 · gold 2.6 · master 4.2
```
XP **mastery kademesine ilk ulaşıldığında** verilir, her sette değil. Neden:
her set XP verirse oyun "çok tekrar yap" oyununa döner; bizim felsefemiz
"kaliteyi yükselt". Toplam kazanılabilir XP: **525.480**.

### 4.2 Seviye
```
seviye N için kümülatif XP = round_10( 100 × (N-1)^1.6 )
```
Seviye 2 = 100 XP · Seviye 10 ≈ 3.800 · Seviye 50 ≈ 46.900 · Seviye 100 ≈ 156.700.
525.480 toplam XP ile seviye 100 ulaşılabilir ama her hareketin master
kademesini gerektirir — yani tavan var, kolay değil.

### 4.3 Mastery ve kilit açma
4 kademe: **bronze → silver → gold → master**. Her hareket için sayısal hedef
`movements.json` içinde. Kilit açmak için **bronze yeterlidir**; gold/master
XP, unvan ve prestij içindir.

Neden bronze yeterli: master'ı şart koşmak ağacı tıkar ve insanı tek harekette
aylarca tutar. Bronze "bu hareketi yapabiliyorum" demek, master "bu hareketi
tüketmiş durumdayım" demek. İlerleme birinciyle açılır.

Bir kademe **doğrulanmış** sayılır: hedef değerin son 14 gün içinde **iki ayrı
seansta** tutulması gerekir. Tek seferlik iyi gün mastery sayılmaz.

### 4.4 Boss savaşı
Boss node'lar (22 tane) HP'li gösterilir:
```
boss_HP        = 100
kalan_HP       = 100 × (1 − ilerleme)
ilerleme       = min(1, mevcut_en_iyi / bronze_hedef)
```
Mekanik olarak normal bir node ile aynı; sunum farklı. Tamamen psikolojik,
ama vizyon dosyasının haklı olduğu yer burası: bir hedefi "boss" diye
adlandırmak motivasyonu değiştiriyor.

### 4.5 Seri (streak)
```
seri = kesintisiz haftalık hedefi tutulan hafta sayısı
haftalık hedef = 4 antrenman (kullanıcı ayarlayabilir)
```
Seri **günlük değil haftalık** sayılır. Neden: günlük seri, dinlenme gününü
cezalandırır ve aşırı antrenmanı ödüllendirir. Bu, kullanıcı sağlığına
zarar veren bir oyunlaştırma kalıbıdır ve bilinçli olarak reddedilmiştir.
Deload haftası seriyi kırmaz — `recovery` kategorisi tamamlandıysa hafta
geçerli sayılır.

### 4.6 Günlük görev üretimi
Her gün 3 görev, şu şablondan üretilir:
1. **Aktif progression** — bronze'a en yakın kilitli node
2. **En zayıf kategori** — XP payı en düşük kategoriden bir açık node
3. **Bakım** — bir mobilite veya aksesuar node'u

Rastgele değil, kurallı. Neden: rastgele görev "bugün ne çıkarsa" hissi verir;
kurallı görev zayıf halkayı kapatır.

### 4.7 Denge puanı (Balance Score)
```
kazanılan_pay_i = kazanılan_XP_i / toplam_kazanılan_XP
beklenen_pay_i  = kategoride_mevcut_XP_i / toplam_mevcut_XP
sapma           = Σ | kazanılan_pay_i − beklenen_pay_i |
denge           = 100 × (1 − sapma / 2)
```
Bir kategoride yığılmayı görünür kılar. Kalistenikte en sık sakatlık nedeni
bu dengesizliktir; ölçmek uyarmanın ilk adımı.

> **Test sırasında düzeltilen hata:** İlk tanım "her kategori eşit pay almalı"
> (1/N) diyordu. Ama Pull ağacında 43, Explosive'de 8 hareket var — eşit pay
> beklemek Pull'da doğru şekilde ilerleyen kullanıcıyı cezalandırıyordu.
> Simülasyonda her hareketi bronza çıkardığımızda puan 100 değil **62**
> geldi; bu, formülün yanlış olduğunun kanıtıydı. Yeni tanım kategorinin
> kendi büyüklüğünü referans alıyor: her şey tamamlandığında puan **96-100**,
> tek dalda yığıldığında düşük.

### 4.8 Hazırlık puanı (Readiness) — Faz 3
```
hazırlık = 0.4×uyku + 0.3×(1−ağrı) + 0.2×tazelik + 0.1×moral
tazelik  = son deload'dan bu yana geçen haftaya göre azalır
```
Kullanıcının girdiği 4 basit değerden hesaplanır. Tıbbi bir ölçüm değil,
karar destek göstergesi — "bugün ağır mı hafif mi" sorusuna veri katar.

---

## 5. MVP kapsamı (Faz 1)

**İçinde:**
- Zoom/pan yapılabilen interaktif skill tree, kategoriye göre renkli
- Node durumları: kilitli / açık / bronze / silver / gold / master
- Hareket detay paneli: onkoşullar, ne açar, ipuçları, sık hatalar, kaslar, ekipman
- Set kaydı (tekrar/süre/mesafe) ve otomatik mastery değerlendirmesi
- XP, seviye, kategori bazlı ilerleme
- Ekipman filtresi (sadece elimdekilerle ne yapabilirim)
- 4 gün/hafta program görünümü
- Offline çalışma + veri dışa/içe aktarma (JSON)

**Dışında (bilinçli olarak):**
- Bulut senkronizasyonu, hesap sistemi
- Video/animasyon içeriği
- AI koç, form analizi
- Topluluk, liderlik tablosu, sezonlar
- Antrenör modu
- Prestige / New Game+ / Skill Fusion vb.

**Bitti sayılma ölçütü:** Kurucu iki hafta boyunca kağıt/telefon notu
kullanmadan sadece bu uygulamayla antrenman kaydedebiliyor.

---

## 6. Fazlar

| Faz | Kapsam | Bitti ölçütü |
|---|---|---|
| **0 — Veri** ✅ | 196 hareket, onkoşul grafı, doğrulama, XP/mastery sayıları | 0 hata 0 uyarı ile derleniyor |
| **1 — MVP** | Skill tree + set kaydı + XP/seviye + offline kayıt | 2 hafta gerçek kullanım |
| **2 — Oyun** | Görevler, boss ekranları, istatistik paneli, denge puanı, unvanlar, 4 günlük program üretici | Uygulama "tracker" değil "oyun" gibi hissettiriyor |
| **3 — Zeka** | Zayıf halka tespiti, ters skill GPS ("X istiyorum" → yol), hazırlık puanı, otomatik progression önerisi | Öneriler kullanıcının kendi kararlarıyla %80 örtüşüyor |
| **4 — Ölçek** | Bulut senkronizasyonu, çoklu cihaz, Capacitor ile mobil paketleme, antrenör modu | İkinci bir kullanıcı sıfır destekle kullanabiliyor |
| **5 — Genişleme** | Medya içeriği, hareket hikayeleri (lore), ayrı Rings/Freestyle/Weighted ağaçları, sezonlar | — |

Faz 2'deki her fikir vizyon dosyalarındaki 40 fikirden seçildi. Seçilmeyenler
silinmedi; Faz 5 ve sonrası için fikir havuzunda duruyor.

---

## 7. Mimari Karar Günlüğü (ADR)

Vizyon dosyaları "Architecture Decision Log tut" diyordu. Başlıyor.

**ADR-001 · Tek doğruluk kaynağı `movements.json`**
İki çelişen hareket listesi vardı. Artık tek makine-okunur kaynak var; vizyon
`.txt` dosyaları arşiv statüsünde. *Bedeli:* eski dosyalar güncel değil,
karışıklık riski → `_CHECKPOINT.txt` bunu açıkça belirtiyor.

**ADR-002 · JSON elle düzenlenmez, script üretir**
`movements_data.py` + `build_db.py`. 196 node elle tutarlı tutulamaz.
*Bedeli:* veri değişikliği için Python çalıştırmak gerekir.

**ADR-003 · Onkoşullar AND, OR değil**
Basit ve tahmin edilebilir. OR gerekirse ara node açılır.
*Bedeli:* "şu ya da bu" durumları modellenemiyor; şimdilik ihtiyaç yok.

**ADR-004 · Yerel-öncelikli, backend yok**
IndexedDB tek kaynak. Senkronizasyon Faz 4'te "son yazan kazanır" + çakışma
uyarısı ile eklenecek. *Bedeli:* cihaz kaybı = veri kaybı → dışa aktarma
MVP'de zorunlu özellik.

**ADR-005 · Kilit için bronze yeterli**
Master şartı ağacı tıkar. *Bedeli:* kullanıcı yetersiz temelle ilerleyebilir
→ Faz 3'teki zayıf halka tespiti bunu yakalayacak.

**ADR-006 · Haftalık seri, günlük değil**
Günlük seri dinlenmeyi cezalandırır. Sağlık gerekçeli, pazarlık konusu değil.

**ADR-007 · Mobilite gerçek onkoşul**
`wrist-mobility` olmadan handstand, `ankle-mobility` olmadan pistol açılmaz.
*Bedeli:* bazı kullanıcı "gereksiz kapı" diye şikayet edebilir → detay
panelinde neden gerektiği açıklanacak.

**ADR-008 · İpuçları aile bazında**
26 aile, 196 hareket. *Bedeli:* hareket-özel incelik kayboluyor → hareket
bazında geçersiz kılma (override) alanı sonradan eklenebilir.

**ADR-009 · Motor katmanı UI'dan bağımsız saf TypeScript**
Oyun kuralları test edilebilir olmalı ve UI yeniden yazımından sağ çıkmalı.

**ADR-010 · Türkçe arayüz, İngilizce hareket adları**
Kalistenik terminolojisi uluslararası; "ön kaldıraç" kimseye bir şey anlatmıyor.

---

## 8. Riskler

| Risk | Neden ciddi | Karşı önlem |
|---|---|---|
| **Kapsam patlaması** | En büyük risk. 40 sistem fikri var | Faz kapıları; Faz 1 listesi kilitli |
| **Veri kaybı** | Backend yok, tek cihaz | MVP'de dışa aktarma zorunlu; Faz 4'te bulut |
| **Yalnız kullanıcı yanılgısı** | Tek kişi için tasarlanan şey ikinci kullanıcıda kırılır | Faz 4'ün bitti ölçütü tam olarak bu |
| **Medya borcu** | 196 hareket × video = büyük iş | Faz 5; MVP'de metin ipuçları yeterli |
| **Sakatlık** | Oyunlaştırma aşırı antrenmanı teşvik edebilir | Haftalık seri, deload node'ları, hazırlık puanı, mobilite kapıları |
| **Terk edilme** | Kişisel projelerin normal sonu | Faz 1 iki haftada gerçek kullanıma girecek kadar küçük tutuldu |

---

## 9. Hemen sıradaki iş

**Adım 1.2 — Çalışan prototip.** Tek dosya HTML, gerçek `movements.json`
verisiyle: skill tree görünümü, node inceleme, kilit mantığı, set kaydı,
XP/seviye. Amacı ürünü satmak değil, mekaniklerin gerçekten çalıştığını
kanıtlamak — ve kurucunun ilk kez kendi ağacına bakıp "burası yanlış"
diyebilmesi.
