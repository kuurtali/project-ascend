# YOL HARİTASI — dört gözle inceleme

> 2026-08-14. Proje dört ayrı bakış açısından incelendi: **sporcu**,
> **geliştirici**, **eleştirici**, **yabancı kullanıcı**. Her biri kendi
> önceliğini savundu; sonra kesişim noktalarına bakıldı.
>
> İnceleme öncesi alan araştırması yapıldı (kaynaklar en altta). İki
> bulgu planı gerçekten değiştirdi ve bunlar aşağıda işaretli.

---

## 1 · SPORCU gözüyle

### 1.1 Handstand'in yarısı programda yok — en büyük antrenman açığı

Hedef HSPU. Program pike şınavı haftada 2 kez veriyor, bu **itme gücü**
tarafını çalıştırıyor. Ama handstand bir **beceri**; denge, el altı
kontrolü ve baş aşağı yönelim ayrı bir öğrenme süreci ve programda
hiç yok. Duvar handstand'i haftalık şablonda geçmiyor.

Araştırma bu ayrımı net söylüyor: handstand "yorgunken yapılan rastgele
denemeler"le değil, **kısa ve sık** pratikle öğreniliyor — günde 10 odaklı
dakika, seyrek uzun seanslardan iyi. Duvar handstand'i 2-4 haftada,
serbest handstand 2-6 ayda geliyor; HSPU ise ondan sonra.

**Sonuç:** duvar handstand tutuşu haftada 3-5 gün, 2-3 dakika, sert
günlerin başına ve hafif günlere eklenmeli. Yorucu değil, sıklık işi.

### 1.2 Vücut ağırlığı takip edilmiyor — sessiz ölçüm hatası

Kalistenik **göreli güç** sporu. Salonda 4 kg alırsa barfiksi zorlaşır ve
uygulama bunu "gerileme" olarak okur, hedefi düşürür. Tersi de olur.
Haftada bir kilo girişi olmadan uyarlama kuralı yanlış sinyal alır.

### 1.3 Isınma yok

Bilek hazırlığı var ama gerçek ısınma yok. Pike şınava soğuk girmek,
bilek geçmişi olan biri için gereksiz risk.

### 1.4 Form ipuçları yanlış yerde

Veride her hareketin ipuçları ve sık hataları var — ama sadece Ağaç
ekranında. İnsan pike şınav yaparken "dirsek öne, dışa açma" cümlesini
o anda görmeli, ağaçta gezerken değil.

### 1.5 Ölçüm günü / ağırlık çakışması

Pazartesi hem ölçüm günü hem ağırlık günü. Bir seti sonuna götürüp
sonra bench yapmak ikisini de bozar. Ölçümü Cuma'ya almak ya da o gün
ağırlık sırasını değiştirmek gerekir.

---

## 2 · GELİŞTİRİCİ gözüyle

### 2.1 Hata sınırı yok — en yüksek riskli teknik açık

Herhangi bir ekran hata fırlatırsa uygulama beyaz ekrana düşer. Salonda,
seansın ortasında, internetsiz. Kullanıcı ne olduğunu anlamaz ve o seansın
verisi gider. **React error boundary yok.** Bu, tek satırlık bir hatanın
bir yıllık alışkanlığı kırabileceği anlamına geliyor.

### 2.2 Veri sürümleme ve göç yolu yok

Kayıt anahtarı `ascend.state.v1`. `PlayerState` şeması değişirse eski
kayıt bozulur. Şu an `DEFAULT_STATE` ile birleştirme var, bu bazı
durumları kurtarıyor ama **sürüm alanı ve göç fonksiyonu yok.** Bir yıllık
veri birikecek; şema bir kez değişecek ve o gün ne olacağı belirsiz.

### 2.3 Otomatik yedek yok

Yerel-öncelikli mimarinin bedeli: tarayıcı verisi silinirse her şey gider.
Elle dışa aktarma var ama **kimse düzenli olarak elle yedek almaz.**
Haftalık otomatik hatırlatma ya da otomatik indirme gerekiyor.

### 2.4 Servis worker ön-önbelleği eksik

Sadece `./` ve `index.html` ön-önbelleğe alınıyor; JS paketi ilk
getirmede önbelleğe giriyor. Güncellemeden hemen sonra çevrimdışı
kalınırsa uygulama açılmayabilir.

### 2.5 Görsel regresyon testi yok

Bilinen eksik. Testler çökmediğini kanıtlıyor, doğru göründüğünü değil.

---

## 3 · ELEŞTİRİCİ gözüyle

### 3.1 Elle veri girişi — terk etme sebeplerinin başında

**Araştırmanın en can alıcı bulgusu bu.** Fitness uygulamalarını bırakma
sebeplerinin ilk sırasında "zaman alan elle giriş" geliyor. Sağlık ve
fitness uygulamalarında 30. gün tutunma oranı **%3-4**; kullanıcıların
%80'i üç ay içinde bırakıyor.

Bizim uygulama seans başına **5 hareket × 3 set = ~15 sayı girişi**
istiyor. Üstüne efor butonları. Bu, araştırmanın tam olarak işaret ettiği
sürtünme. Şu an tasarımın en zayıf yeri burası ve kimse fark etmemişti,
çünkü henüz kimse kullanmadı.

**Sonuç:** giriş üç dokunuşa inmeli. "Hedefi yaptım" tek tuşu, son
seansın sayılarını hazır getirme, set set yerine tek alan girişi.

### 3.2 Kaçırma kurtarma mekaniği yok

Araştırma: seriyi kırmak **motivasyon uçurumu** yaratıyor; hastalık ya da
seyahat yüzünden kırılan seri, sıfırdan başlamayı moral bozucu hâle
getiriyor. Ve kritik nokta: oyunlaştırma **başarısızlığı görünür kılmak**
üzerine kurulduğunda rahatsızlığı artırıyor, **toparlanmayı destekleme**
üzerine kurulduğunda azaltıyor.

Bizde seri haftalık — bu iyi, günlük seriden çok daha affedici. Ama
kaçırdıktan sonra ne olacağı tanımsız. Uygulama sadece 0 gösteriyor.
**Geri dönüş modu yok.**

### 3.3 XP ve rütbe dışsal ödül — dikkatli olunmalı

Meta-analiz: somut ödüller içsel motivasyonu zayıflatıyor (etki ~ −0.36).
Bizim savunmamız var: ödüller keyfi puan değil, **gerçek yetenek**
karşılığı (kademe = yapabildiğin tekrar). Ama XP hâlâ puan. Rütbe ve
unvanların ağırlığı arttıkça bu risk büyür.

### 3.4 197 düğümün belki 15'i kullanılacak

Dürüst soru: gerisi süs mü? Kısmen. Portfolyo değeri ve "ölçek körlüğü"
tedavisi olarak işlevi var, ama antrenman aracı olarak kullanılan yüzey
küçük. Ağacın değeri **özlem** değeri ve özlem içeriği genelde 6. haftada
etkisini kaybeder.

### 3.5 "Akıllı koç" iddiası ince

Uyarlama kuralı beş koşuldan ibaret. Dürüst ve deterministik olması iyi
ama buna koç demek fazla. Tek bir sayıyı ayarlıyor.

---

## 4 · YABANCI KULLANICI gözüyle

### 4.1 Program günleri sabit

Pzt/Çar/Cum sert. Salı-Perşembe-Cumartesi çalışan biri uygulamayı
kullanamıyor. **Gün seçimi yok.**

### 4.2 Hedefler sabit

HSPU, muscle-up, front lever, L-sit varsayılmış. "Sadece barfiks
çekebilmek istiyorum" diyen birinin bunu söyleyecek yeri yok.

### 4.3 Uygulama sadece Türkçe

README İngilizce oldu ama uygulama değil. Türkçe bilmeyen hiç kullanamaz.

### 4.4 Kalibrasyonda hareketi bilmiyor olabilir

"Kaç pike şınav çekebilirsin?" — yeni başlayan pike şınavın ne olduğunu
bilmez. Figür yardımcı oluyor ama açıklama yok.

### 4.5 Uygulama kendini anlatmıyor

"Bu nasıl çalışıyor" ekranı yok. Ağaç 197 düğüm, gösterge (legend) yok.
Kademelerin ne demek olduğu hiçbir yerde yazmıyor.

---

## VOL 2 — dördü birbirine girdi

Vol 1'de herkes kendi listesini savundu. Asıl iş burada başladı:
**çarpıştıkları yerde.** Beş tartışma, beş sentez.

### Tartışma 1 · Eleştirici ⚔ Sporcu — hızlı giriş mi, veri kalitesi mi

**Eleştirici:** Seans başına 15 sayı girişi kabul edilemez. Terk etme
sebeplerinin başı bu. Tek tuş olsun: "hedefi yaptım", bitti.

**Sporcu:** O zaman sistem yalan söyler. Uyarlama kuralının tamamı
**gerçek sayıya** dayanıyor. "Hedefi yaptım" diyip 12 yerine 10 yapan
biri sistemi bozar; hedef artar, tutturamaz, sarmal aşağı gider. Kolaylık
uğruna projenin çekirdeğini feda ediyorsun.

**Sentez — ikisi de haklı, çözüm ortada:** düğme alanları hedefle
**DOLDURUR, kilitlemez.** Farklı çıktıysa üstüne yazarsın. Sürtünme 15
girişten 1 dokunuşa iner, veri doğruluğu korunur. *(uygulandı)*

### Tartışma 2 · Eleştirici ⚔ Sporcu — geri dönüşte ne düşer

**Eleştirici:** Kaçırınca kullanıcıyı ezmeyelim, hafifletelim.

**Sporcu:** Hafifletmek şefkat meselesi değil, fizyoloji. Ara verdikten
sonra gerçekten daha az yapabilirsin. Ama **neyi** düşürdüğün önemli:
deload'da yorgunluk boşaltılır, geri dönüşte seviye yeniden bulunur.
İkisi farklı problem.

**Sentez:** deload **set** düşürür, hedef sabit kalır. Geri dönüş
**hedef** düşürür, set sabit kalır. Tam tersi işlemler ve ikisi de
doğru. *(uygulandı, test bunu koruyor)*

### Tartışma 3 · Eleştirici ⚔ Geliştirici — XP kaldırılsın mı

**Eleştirici:** Meta-analiz açık, somut ödül içsel motivasyonu zayıflatıyor.
XP, seviye, rütbe, unvan, ascension — beş ayrı dışsal katman var.

**Geliştirici:** Kaldırırsan seviye de gider, rütbe de, ilerleme hissi de.
Ayrıca bizim ödülümüz keyfi değil: kademe = **yapabildiğin tekrar**.
Puan değil, yeteneğin ölçüsü.

**Sentez:** Ayrım "ödül var mı yok mu" değil, **hangisi öne çıkıyor.**
Yetenek göstergesi (sonraki kademeye 3 kaldı) içsel; puan (1180 XP)
dışsal. Şu an başlıkta XP yazıyor. Yakınlık göstergesi öne çıkmalı,
XP arkaya. *(P1'e alındı)*

### Tartışma 4 · Sporcu ⚔ Eleştirici — handstand eklenirse seans uzar

**Sporcu:** Duvar handstand olmadan HSPU hedefi sahte.

**Eleştirici:** Her itiraza bir hareket eklersek seans 40 dakika olur ve
o zaman zaten yapılmaz. Sürtünmeyi azaltmaya çalışırken artırıyorsun.

**Sentez:** Duvar handstand **ısınmanın içine** kondu, ekstra yük olarak
değil. 2-3 dakika, yorucu değil, ve zaten omuzu seansa hazırlıyor. Program
uzamadan sıklık kazanıldı — ki araştırma da tam bunu söylüyor: kısa ve
sık. *(uygulandı, 5 güne eklendi)*

### Tartışma 5 · Kullanıcı ⚔ herkes — İngilizce arayüz

**Kullanıcı:** Türkçe bilmeyen hiç kullanamıyor.

**Geliştirici:** i18n altyapısı her metni sözlüğe taşımak demek, büyük iş.

**Eleştirici:** Kullanıcı sayısı zaten hedef değil. Bu kişisel bir araç
ve bir portfolyo parçası. Portfolyo için README'nin İngilizce olması
yeterli — işe alımcı arayüzü kullanmayacak, okuyacak.

**Sentez:** Ertelendi ama **bilinçli olarak**, unutularak değil. README
İngilizce, arayüz Türkçe. Bu bir karar, eksiklik değil — ve öyle
kayda geçti.

---

## Dördünün kesiştiği yer

Ayrı ayrı düşünüldüğünde farklı şeyler söylediler, ama **iki noktada
buluştular** ve bu kesişim en güçlü sinyal:

**Birincisi: veri ve alışkanlık kırılgan.** Geliştirici "veri kaybolabilir"
diyor, eleştirici "kullanıcı bırakır" diyor, kullanıcı "kullanamıyorum"
diyor. Üçü de aynı şeyi söylüyor: uygulamanın hayatta kalması şu an
şansa bağlı.

**İkincisi: sürtünme ölümcül.** Sporcu "ipuçları yanlış yerde" diyor,
eleştirici "15 giriş çok" diyor, kullanıcı "günleri değiştiremiyorum"
diyor. Hepsi sürtünme.

Sistemin tasarımı iyi. **Kullanım yüzeyi zayıf.**

---

## PLAN

Öncelik sırası "yapılmazsa proje ölür"e göre, "havalı olur"a göre değil.

### P0 — Dayanıklılık  ·  *bunlar olmadan bir yıl taşınmaz*  ·  **✅ YAPILDI**

| # | İş | Neden | Durum |
|---|---|---|---|
| 1 | **Hata sınırı** | Bir hata bir yıllık alışkanlığı kırmasın | ✅ |
| 2 | **Veri sürümleme + göç** | Şema değişince eski kayıt bozulmasın | ✅ |
| 3 | **Yedek tarihi takibi** | Elle yedek alınmıyor, alınmayacak | ✅ |
| 4 | **Hızlı giriş** | Terk etme sebeplerinin başı elle giriş | ✅ |
| 5 | **Geri dönüş modu** | Kaçırınca uçurum değil rampa olsun | ✅ |
| 6 | **Duvar handstand (ısınmada)** | HSPU'nun denge yarısı yoktu | ✅ |

### P1 — Antrenman doğruluğu  ·  *sporcunun itirazları*

| # | İş | Neden |
|---|---|---|
| 7 | **Vücut ağırlığı takibi** | Göreli güç sporu; kilo değişimi ölçümü bozar |
| 8 | **Bugün ekranında form ipuçları** | Bilgi kullanıldığı yerde olmalı |
| 9 | **XP'yi arkaya, yakınlığı öne al** | Dışsal ödülü geri plana çek (Tartışma 3) |

### P2 — Yaygınlaşabilirlik  ·  *yabancı kullanıcı*

| # | İş | Neden |
|---|---|---|
| 10 | **Program günleri seçilebilir** | Herkesin haftası aynı değil |
| 11 | **Hedef seçimi** | Herkes HSPU istemiyor |
| 12 | **İngilizce arayüz** | Şu an Türkçe bilmeyen kullanamaz |
| 13 | **"Nasıl çalışır" ekranı** | Uygulama kendini anlatmıyor |

### P3 — Görünürlük  ·  *portfolyo*

| # | İş | Neden |
|---|---|---|
| 14 | **İlerleme geçmişi ve grafik** | Projenin kendi tezi; hâlâ yok |
| 15 | **Ekran görüntüleri** | İşe alımcı ortalama 15 saniye bakıyor |
| 16 | **Depo açıklaması, konu etiketleri, pin** | Aynı 15 saniye |

---

## Kaynaklar

- Fitness uygulaması tutunma ve terk etme sebepleri —
  [Sahha: health app churn](https://sahha.ai/blog/health-app-churn-retention/),
  [Autentika: why users abandon fitness apps](https://autentika.com/blog/why-do-users-abandon-fitness-apps),
  [Fitness Refined 2026 raporu](https://www.openpr.com/news/4602398/fitness-refined-releases-2026-report-on-why-fitness-app-users)
- Oyunlaştırmanın ters tepmesi, seri kırılması, içsel motivasyonun
  zayıflaması —
  [Motivation crowding effects (Frontiers in Psychology)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1286463/full),
  [Sahha: gamification & behavioral nudges](https://sahha.ai/blog/gamification-behavioral-nudges-health-apps/)
- Handstand ve HSPU gerçekçi süreleri, beceri sıklığı —
  [Calisthenics Association: handstand guide](https://calisthenicsassociation.org/blog/handstand-training-complete-guide),
  [Calisthenics Club Houston: timeline](https://calisthenicsclubhouston.com/how-long-does-it-take-to-learn-a-handstand-a-detailed-timeline/)
- Portfolyo ve GitHub değerlendirme ölçütleri —
  [SOLTECH: what hiring managers look for](https://soltech.net/what-do-hiring-managers-actually-look-for-in-a-github-portfolio/),
  [Junior developer portfolio guide 2025](https://www.webportfolios.dev/blog/junior-developer-portfolio-guide-2025)
