# Project Ascend

*[English](README.md) · **Türkçe***

[![CI](https://github.com/kuurtali/project-ascend/actions/workflows/deploy.yml/badge.svg)](https://github.com/kuurtali/project-ascend/actions/workflows/deploy.yml)
[![Lisans: MIT](https://img.shields.io/badge/lisans-MIT-blue.svg)](LICENSE)
![Test](https://img.shields.io/badge/test-196-brightgreen)
![Hareket](https://img.shields.io/badge/hareket-197-orange)
![Sunucu](https://img.shields.io/badge/sunucu-yok-lightgrey)

> Kalistenik öğrenmenin haritası — her hareketin bir beceri düğümü olduğu,
> ön koşullarını tamamlamadan ilerleyemediğin, RPG mantığında bir gelişim sistemi.

**Bu bir antrenman kaydedici değil.** Kaydediciler geçmişi tutar; bu sistem
sıradaki adımı gösterir ve senin yaptığına göre kendini ayarlar.

**▶ Canlı: [kuurtali.github.io/project-ascend](https://kuurtali.github.io/project-ascend)**
Telefonda aç, tarayıcı menüsünden "Ana ekrana ekle" — uygulama gibi çalışır,
internetsiz de açılır.

<p align="center">
  <img src="docs/img/hareketler.gif" width="440" alt="Hareket figürleri — açı tabanlı iskelet animasyonu">
</p>

---

## Teknik olarak ne var

Buraya handstand öğrenmek için değil de mühendis gözüyle bakıyorsan, kısa
hâli şu:

| | |
|---|---|
| **Doğrulanmış DAG** | 197 hareket, 237 ön koşul bağlantısı, maksimum derinlik 11. Python'da elle yazılıyor, 11 doğrulayıcıdan geçiyor (döngü, yetim düğüm, ulaşılamayan boss, artmayan eşik, ekipman şelalesi), JSON olarak üretiliyor. CI her push'ta yeniden üretip commit'lenmiş çıktıyla karşılaştırıyor. |
| **Deterministik motor** | LLM yok, sunucu yok, ağ yok. `(hareketler, oyuncuDurumu)` alır, yeni durum ya da plan döner. Saf TypeScript, DOM'a hiç dokunmaz, 154 test. |
| **Üretilmiş figürler** | 197 hareket 25 pozla çiziliyor, ileri kinematikle. Pozları Python rig üretiyor (`tools/rig/`) — önizleme aracıyla uygulama birbirinden ayrışmasın diye. Animasyon SMIL, JS döngüsü yok, pil harcamıyor. |
| **Yerel-öncelikli** | `localStorage`, sürümlü şema, veri silmeyen tek yönlü göçler, tek tuşla dışa aktarma. Servis worker HTML'i bilerek önce ağdan alıyor — cache-first sürüm iki yayını sessizce gizlemişti. |
| **Asıl çıktı kararlar** | Gerekçeleriyle 65 karar kaydı, yanlış dönüşler dâhil. `docs/SECOND_BRAIN.md`. |

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

## Hareket ağacı

197 hareket, 237 ön koşul bağlantısı, 11 katman derinlik. Kırmızı çerçeveli
düğümler boss — yolun sonundaki hedefler.

<p align="center">
  <img src="docs/img/agac.png" width="820" alt="197 düğümlük hareket ağacı">
</p>

Ağaç elle çizilmedi. `tools/movements_data.py` içindeki tanımlardan üretiliyor,
`build_db.py` doğruluyor, `make_layout.py` yerleştiriyor.

---

## Sistemin çekirdeği

### Uyarlama kuralı

Projenin var olma sebebi bu. "12 yap" deyip 10 yaptığında yol haritası
değişmezse, sistemin internetteki bir listeden farkı kalmaz.

| Ne oldu | Sonraki hedef |
|---|---|
| Hedefi tutturdu, **kolaydı** dedi | **+2** |
| Hedefi tutturdu, normal/zor | **+1** |
| 1-2 eksik kaldı | **aynı sayı** — kalibrasyon, başarısızlık değil |
| 3+ eksik kaldı | **%20 düşür** |
| 3 seans üst üste aynı sayı | **ekseni değiştir** — 3-1-3 tempo, ~%60 tekrar |

Deterministik. LLM yok, sunucu yok. Uygulama tek başına çalışır.

### Mastery kademeleri

Her hareketin dört eşiği var: bronz, gümüş, altın, master. Eşikler **RIR 2'de**
tanımlı — yani "2 tekrar payla bırakabildiğin sayı". Haftada bir ölçüm günü var,
o gün bir seti sonuna kadar götürebiliyorsun. Bu, oyunlaştırmanın kullanıcıyı
kendini paralamaya itmesini engelliyor.

Kademe ancak **14 gün içinde 2 ayrı seansta** doğrulanırsa sayılıyor. Tek şanslı
gün kademe kazandırmaz.

### Başka antrenmanın yanında çalışmak

Kalistenik tek başına bir hayat programı değil. Çoğu kişi ağırlık da
çalışıyor, bir spor dalı yapıyor ya da koşuyor. Şablon bu varsayımla
kuruldu — **3 sert / 2 hafif / 2 boş**:

| | |
|---|---|
| **1 · 3 · 5** | Beceri günü, 15-20 dk. Aynı gün başka antrenman varsa kalistenik önce |
| **2 · 6** | Hafif gün — RIR 3-4, başarısızlık yok |
| **4 · 7** | Tam dinlenme |

Beceri işi **önce** yapılır çünkü motor öğrenmedir; yorgunken yanlış kalıp
öğretir. Ağır bir itme seansından sonra pike push-up hem işe yaramaz hem
risklidir.

Yük ayrı günlere dağıtılmaz, **aynı güne toplanır**. Dağıtılırsa haftada
6 antrenman günü olur ve dirsek, bilek, omuz hiçbir gün tamamen boşta
kalmaz. Kas 48 saatte toparlanır, tendon ve bağ dokusu daha yavaş —
sakatlık oradan gelir. Buna karşılık beceri sıklık ister, o yüzden iki
hafif gün var: haftada 5 gün temas, 3 gün sert yük.

İtme hacmi çakışması bilinçli çözüldü. Kullanıcı ağırlık da çalışıyorsa
bench ve omuz press aynı dokuyu vuruyor; bu yüzden buradaki itme **hacim
değil beceri** olarak kuruldu — az set, düşük tekrar, yüksek kalite.
Bacak işi de minimumda: ağırlık antrenmanı bacağı kalistenikten iyi
karşılıyor, ağacın bacak kolu menüde duruyor.

### Program dışı antrenman — sistem artık haberdar

Yukarıdaki paragraf uzun süre uygulamanın doğrulayamadığı bir iddiaydı.
Şablon başka antrenmanın varlığını varsayıyordu ama onu kaydeden hiçbir
yer yoktu.

Bu boşluk sessiz bir ölçüm hatası üretiyordu — kilo takibiyle aynı
sınıftan. Cuma 150 squat yap, cumartesi plankta on saniye az tut:
uyarlama kuralı bunu **gerileme** okur ve hedefi kalıcı düşürür.
Yanlış yapılan bir şey yoktur, sistem yanlış okumuştur. Hata da
görünmez; ekranda sadece daha küçük bir sayı belirir.

Bu yüzden dış seanslar kaydediliyor: tür, şiddet, sıçrama var mı,
isteğe bağlı not. Yaygın durumda iki dokunuş. Sistem üç yerde
kullanıyor:

| | |
|---|---|
| **Doku çakışması** | Her tür ağaç kategorilerine bağlı; "dün itiş çalıştın, bugünkü ana iş aynı dokuya biniyor" diyebiliyor — hem de listenin *üstünde*, çünkü sayı girildikten sonra söylemenin değeri yok |
| **Yorgunluk istisnası** | Son iki günde ağır dış yük varsa "3+ altında → %20 düş" kuralı askıya alınır. Yorgun bir günün ölçüsü kimsenin seviyesi değildir |
| **Sıçrama sayacı** | Sıçrama kastan çok tendona biner, tendon daha yavaş toparlanır. 7 günde 3+ sıçrama seansı uyarı üretir |

İstisna **bir kere affeder, iki kere affetmez.** Önceki seansta da 3+
açık varsa hedef yine de düşer — o artık tek bir kötü gün değildir.
Bu sınır olmasa sürekli dışarıda antrenman yapan biri ulaşamayacağı bir
hedefe kilitlenirdi. (Plato kuralı bunu yakalamıyor: hedefi tutturmakta
ısrar edince tetikleniyor, tutturamayınca değil.)

Bilerek dışarıda bırakılan: dış seanslar seriye, XP'ye ve kademelere
girmiyor. Uygulama beceri ağacını takip ediyor; oraya squat girerse
kademeler yanlış oynar ve sistem yanlış hedef verir. Dış yük
**bağlamdır, ilerleme değil.**

### Skill Slot — hareketler rol değiştirir

Dört slot, dört farklı nitelik: **Main** (yoğunluk), **Secondary** (hacim),
**Technique** (motor öğrenme), **Finisher** (kapasite).

Bir hareket yukarı çıkabilir: ağaçtaki bir üst düğüm Main'e geçer, eski Main
Secondary'ye iner. Silinmez, rolü değişir. Terfi takvimle değil **biriken
işle** olur — ve aşağıdaki değişiklikten sonra sistemin kendi yargısıyla da
değil.

Haftalık şablon bir haftanın *şeklini* tarif eder — hangi gün hangi nitelik,
ne kadar, hangi sırayla. Slotu hangi hareketin dolduracağı ağaç durumundan
çözülür; yani terfi duyurulmakla kalmaz, yarınki seansı gerçekten değiştirir.
Bugün ve İlerleme ekranları aynı çözücüyü çağırdığı için birbirine ters
düşemezler.

### Deload

Her 6. haftada set sayısı yarıya iner, hedef tekrar aynı kalır, ölçüm günü
kalkar. Tekrar aynı kalır çünkü onu düşürmek hareketi kolaylaştırır ve uyaranı
tamamen keser — amaç dinlenmek değil, biriken yorgunluğu boşaltmak. Hafta
sayacı takvimi değil **kullanıcının** haftalarını sayar; ilk kayıttan başlar.

### Terfi kapısı — önce hacim, sonra onay

Başlangıçta sistem kendi terfi ettiriyordu: bir hareket altın kademeye
ulaşınca slot sessizce bir üst düğüme kayıyordu. İkisi de yanlıştı.

**Kapı ucuzdu.** Altın tek bir sayı — pike şınavda 12. On ikiyi on dört gün
içinde iki kez yapmak seni daha zor bir harekete taşıyordu. Ama bir hareketi
*yapabilmek* ile ona uyum sağlamış olmak farklı şeyler. Kas haftalar içinde
güçlenir; tendon ve bağ dokusu geriden gelir. Kalistenikte sakatlığın en
yaygın sebebi kas eşiğine bakıp geçmek.

**Bir de karar kullanıcının değildi.** Bir sabah ekranda yeni bir hareket
belirmesi ilerleme gibi değil, kontrolü kaybetmek gibi okunuyor.

Artık kapı tek bir sayı ve bir soru:

```
hacim kapısı = altın hedef × altın set × 8 seans
pike şınav:     12 × 3 × 8 = 288 tekrar
duvar handstand: 60sn × 1 × 8 = 480 saniye
```

Eşik sabit değil, hareketin kendi zorluğundan türüyor — zor hareketlerde
daha az tekrar gerekiyor, çünkü altın hedefleri zaten düşük. Dolunca
uygulama soruyor: *"288 tekrar tamam. Geçelim mi?"* Hayır diyebilirsin.
Geri de dönebilirsin.

Ağaçtaki yerin artık çıkarım değil, yalnızca senin yazdığın bir kayıt
(`trackAt`).

İlk sürümde doğrulanmış altın kademe de aranıyordu; bilerek kaldırıldı.
Kullanıcı kapının neden açılmadığını göremiyordu ve kapı keyfi
hissettiriyordu. **Anlaşılmayan bir koruma korumuyor.** Kademe hâlâ
hesaplanıp gösteriliyor, sadece kapıyı kilitlemiyor.

### Süreklilik, güçten ayrı ölçülür

Ağaç ne kadar güçlü olduğunu ölçüyor. Bir yılın sonucunu belirleyen soru ise
*kaç gün ortaya çıktığın* — ve bu ikisi farklı arayüz istiyor.

Beceri işi sayı ister: kaç tekrar, hangi kademe, ne kadar kaldı. Temel
hareketler **yapıldı / yapılmadı** ister. "Bugün şınav çektim" demek için üç
set kutusu doldurtmak, kaydın hiç tutulmamasına yol açar — elle giriş,
fitness uygulamalarını bırakma sebeplerinin başında geliyor.

O yüzden şınav, dips, squat ve *salona gitmek* tek dokunuşluk bir şerit. Ve
gösterdiği şey **gün**, işaret sayısı değil:

- Aralık kullanıcının. "2 günde bir" dediysen ikinci gün gecikme değil,
  planın kendisi. Günlük seri yok — dinlenmeyi cezalandırır, aşırı
  antrenmanı ödüllendirir.
- Gün cinsinden sayıldığı için farklı aralıklı alışkanlıklar tek ölçüyle
  karşılaştırılabiliyor.
- **Kademeye ve XP'ye girmez.** İşaretlemek tekrar üretmez, ağaç yalan
  söylemesin. Program dışı yük kaydıyla aynı ilke: bağlam, ilerleme değil.

---

## Oyun katmanı

| | |
|---|---|
| **Rütbe** | 6 aşama × 3 alt kademe. Ulaşılan düğümlerin tier **medyanından** — ortalama tek bir yüksek düğümle şişer, bir tane tuck front lever kimseyi Advanced yapmaz |
| **Seri** | **Haftalık**, günlük değil. Günlük seri dinlenmeyi cezalandırır ve aşırı antrenmanı ödüllendirir — bilinçli olarak reddedildi |
| **Boss HP** | 22 boss, HP = 100 × (1 − ilerleme) |
| **Unvanlar** | 8 tane, yarısı gücü değil **disiplini** ödüllendiriyor (İstikrarlı, Sabırlı, Kayıtçı, Mobilite Delisi) |
| **Ascension Score** | 6 eksen. XP'nin aksine **düşebilir** — 6 hafta ara verilirse istikrar ekseni iner. "Şu an neredesin"i gösterir |

### Figürler

Ekranda 197 hareketin hepsi bir insan siluetiyle çiziliyor ve hareketi
gerçekten yapıyor. 197 çizim yok — **25 poz** var, hareket ailelerine bağlı
(veride zaten 26 aile vardı). Yeni hareket eklendiğinde ailesi bir poza düşer,
çizim borcu birikmez.

İskelet **açı tabanlı** (ileri kinematik): poz = kök nokta + eklem açıları.
Kemik boyu yapı gereği sabit. İlk sürüm eklem *konumlarını* saklıyordu ve ara
karelerde ön kol uzayıp kısalıyordu — figürler sarhoş gibi görünüyordu. Açı
interpolasyonu ayrıca uzvu doğal yay üzerinde taşıyor, dirsek gövdenin içinden
geçmiyor.

Pozlar elle yazılmıyor, `tools/rig/` üretiyor. Aynı iskelet matematiği hem
önizleme aracında hem uygulamada gerekiyordu; iki yerde elle tutulursa ayrışır.

Animasyon SMIL ile — JavaScript döngüsü yok. Ekranda altı figür olsa bile pil
maliyeti sıfıra yakın; telefon antrenman boyunca açık duracak.

---

## Mimari

```
tools/                 Python veri hattı
  movements_data.py    197 hareketin elle yazılmış tanımı — TEK DOĞRULUK KAYNAĞI
  build_db.py          11 doğrulama kontrolü → src/data/movements.json
  make_layout.py       ağaç yerleşimi → src/data/layout.json
  rig/                 figür pozları → src/ui/figure/poses.ts

src/engine/            saf TypeScript, DOM'a dokunmaz, LLM gerektirmez
  mastery.ts           kilit, kademe, doğrulama, yakınlık, denge puanı
  adaptation.ts        uyarlama kuralı
  planner.ts           slot şablonları, yol bulma, terfi
  game.ts              rütbe, seri, boss HP, unvanlar, ascension

src/ui/                React 19, mobil öncelikli
  Calibrate · Today · Tree · Progress · Settings
  Timer · Celebrate · Avatar · figure/
```

**Yerel-öncelikli.** Sunucu yok, hesap yok. Veri `localStorage`'da durur ve tek
tuşla dışa aktarılır. Servis worker sayesinde internetsiz açılır — parkta ya da
salonda bağlantı olmayabilir.

### Veri doğrulama

`build_db.py` her üretimde 11 kontrol çalıştırır: kırık referans, döngü, yetim
düğüm, erişilemez boss, artmayan eşikler, kategori tutarlılığı, ekipman kaskadı.

Ekipman kaskadı kontrolü gerçek bir hata yakaladı: bir mobilite düğümü yanlışlıkla
"sadece direnç bandı" olarak işaretlenmişti ve arkasındaki **39 düğüm, 8 boss**
sessizce erişilemez hâle gelmişti. Ekipmansız erişim %72'den %93'e çıktı.

CI her push'ta veriyi yeniden üretip commit edilenle karşılaştırır — üretim
zinciri bozulursa derleme kırılır.

---

## Rakamlar

```
197 hareket   ·   22 boss   ·   23 başlangıç düğümü   ·   50 aksesuar
237 bağlantı  ·   12 kategori   ·   26 aile   ·   maks derinlik 11
25 figür pozu ·   toplam kazanılabilir XP 525.335
```

**196 test** — 154 motor testi (kilit, mastery, uyarlama, planner, seans
çözümleme, deload, geri dönüş, dış yük, oyun sistemleri, program yapısı)
ve 38 uçtan uca akış testi (kalibrasyon → seans → kutlama → tüm
ekranlar; gerçek React bileşenleri jsdom içinde çalışıyor).

Program testleri yapıyı koruyor: iki sert gün arka arkaya gelemez, hafif
günlerde RIR ≥ 3, ölçüm günü haftada bir, bar gerektiren her hareketin barsız
alternatifi var.

---

## Çalıştırma

```bash
npm ci
npm run dev            # geliştirme sunucusu

npx tsc --noEmit       # tip kontrolü
npx vitest run         # testler
npm run build          # üretim derlemesi

python3 tools/build_db.py      # veriyi yeniden üret
python3 tools/make_layout.py   # ağaç yerleşimini yeniden üret
cd tools/rig && python3 emit.py > ../../src/ui/figure/poses.ts   # pozlar
```

Poz değiştirildiyse gözle bakmak gerekir — tip kontrolü bir çizimin doğru
olduğunu söylemez:

```bash
cd tools/rig
python3 render.py strip PUSHUP,PULLUP,DIP && convert -density 120 strip.svg strip.png
```

---

## Tasarım kararları

Tam liste ve gerekçeler: [`docs/SECOND_BRAIN.md`](docs/SECOND_BRAIN.md) — 65 karar
kaydı. Öne çıkanlar:

- **Veri elle düzenlenmez.** `movements.json` script tarafından üretilir;
  197 düğüm elle tutarlı tutulamaz.
- **Ön koşullar VE mantığıyla çalışır.** Basit kural, akıllı kuraldan iyidir.
- **Kilit açmak için bronz kademe yeterli.** Master şartı ağacı tıkar.
- **Liderlik tablosu yok.** Kalistenikte acele = sakatlık; karşılaştırma aceleyi
  teşvik eder.
- **Mobilite gerçek bir ön koşul.** Bilek mobilitesi olmadan handstand,
  ayak bileği mobilitesi olmadan pistol açılmaz.
- **Adı değişmeyen dosya cache-first servis edilmez.** Servis worker'ın ilk hâli
  `index.html`'i önbellekten veriyordu; iki sürüm boyunca hiçbir güncelleme
  kullanıcıya ulaşmadı. "Yayınladım" ile "kullanıcı görüyor" aynı şey değil.

---

## Durum

Veri temeli, motor, uygulama ve oyun katmanı çalışıyor; canlıda. Bilinen
eksikler, dürüstçe:

- **Günlük görev üreteci ve sezon sistemi** tasarımda var, uygulamada yok.
- **İlerleme geçmişi ekranı yok.** Uygulama sonraki kademeye ne kadar
  kaldığını gösteriyor ama seni oraya getiren eğriyi göstermiyor — oysa
  yukarıda "insanlar bunu göremediği için bırakıyor" diye yazıyor.
  Sıradaki iş bu.
- **Kademe eşikleri elle yazılmış.** Hacim kapısı formülden çıkıyor ama
  arkasındaki bronz/gümüş/altın sayıları hâlâ yargı. Plan: her harekete
  vücut ağırlığı yüzdesi olarak bir yük katsayısı (şınav ~%64, pike ~%73,
  duvar HSPU ~%92) verip eşikleri oradan hesaplamak ve `build_db.py` ile
  doğrulamak.
- **Tek program, seçim yok.** Günler sabit, hedefler varsayılmış, arayüz
  yalnızca Türkçe. Şablon/ağaç mod seçimi planlandı — haftalık program
  zorunlu olmaktan çıkıp opsiyonel olacak.
- **Görsel regresyon testi yok.** Testler çökmediğini kanıtlıyor, güzel
  göründüğünü değil.
- **Uygulamanın kendi ekran görüntüleri yok** — sadece ağaç diyagramı ve
  figür animasyonu var.

Buradakiler düzeltilmek üzere oldukları için değil, doğru oldukları için
yazılı. Sıralı plan `docs/YOL_HARITASI.md` içinde.

---

## Belgeler

- **[docs/SECOND_BRAIN.md](docs/SECOND_BRAIN.md)** — ana doküman. Amaç, anayasa,
  mimari, kalistenik bilgisi, oyun mekanikleri, karar geçmişi. Her kararın *neden*
  öyle olduğu burada; projeye sonradan bakan biri bağlamı buradan kurar.
- **[docs/CHECKPOINT.md](docs/CHECKPOINT.md)** — nerede kalındı, sıradaki iş,
  bilinen tuzaklar.
- **[docs/YOL_HARITASI.md](docs/YOL_HARITASI.md)** — proje dört ayrı gözle
  incelendi (sporcu, geliştirici, eleştirici, yabancı kullanıcı),
  tartışmaları ve çıkan sıralı plan.
- **[CHANGELOG.md](CHANGELOG.md)** — ne değişti ve neden (İngilizce).

---

## Lisans

MIT — bkz. [LICENSE](LICENSE).

Hareket veritabanı serbestçe kullanılabilir. Bir hatası olduğunu düşünen olursa
issue açabilir; kalistenik bilgisi tek kişinin yargısıyla doğrulanmaz.
