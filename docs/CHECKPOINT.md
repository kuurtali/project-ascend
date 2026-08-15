================================================================================
PROJECT ASCEND - CHECKPOINT / DEVAM DOSYASI
================================================================================
Bu dosyanin amaci: proje uzerinde calisan herkes (kullanici veya baska bir AI
ajani) sifirdan baglami kurup TAM OLARAK kalinan yerden devam edebilsin.

--------------------------------------------------------------------------------
!!! ONCE BUNU OKU !!!
--------------------------------------------------------------------------------
Bu projenin ANA DOKUMANI:

        PROJECT_ASCEND_SECOND_BRAIN.md   v2.0  (3772 satir, 31 bolum, 7 Part)

Orasi kurumsal hafiza. Amac, anayasa, mimari, tum hareketler, oyun
mekanikleri, AI tasarimi, fikir tasnifi, karar gecmisi - hepsi orada.

Bir AI'a sadece o dosyayi verip "Project Ascend'i gelistirmeye devam et"
demek yeterli olacak sekilde yazildi.

Bu dosya (_CHECKPOINT.txt) ise sadece "NEREDE KALDIK" sorusunu cevaplar.

OKUMA SIRASI:
  1. Bu dosya                            <- nerede kaldik (5 dk)
  2. PROJECT_ASCEND_SECOND_BRAIN.md      <- her seyin nedeni (ana dokuman)
  3. data/movements.json                 <- veri (tek dogruluk kaynagi)
  4. prototype/ascend_prototype.html     <- calisan prototip (tarayicida ac)
  5. arsiv/                              <- entegre edilmis eski dokumanlar
  6. PROJECT_ASCEND_*.txt (kok dizin)    <- orijinal vizyon notlari, ARSIV

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
!!! EN SON DURUM — 2026-07-26: UYGULAMA KODU BASLADI !!!
--------------------------------------------------------------------------------
KOD DURUMU:
  src/engine/        MOTOR KATMANI — bitti, 35/35 test geciyor
    types.ts         tipler, slot rolleri, kisit modeli
    mastery.ts       kilit, kademe, 14gun/2seans dogrulama, yakinlik, denge
    adaptation.ts    UYARLAMA KURALI — "12 dedim 10 yaptin" mantigi
    planner.ts       PROGRESSION PLANNER + slot sablonlari + terfi
    engine.test.ts   35 test
  src/program.ts     haftalik program sablonu (7 gun, agir/hafif, MENU)
  src/storage.ts     localStorage kalicilik, seans kaydi, XP, disa/ice aktarma
  src/ui/Today.tsx   BUGUN EKRANI (mobil oncelikli)
  src/main.tsx  index.html  vite.config.ts

DOGRULAMA (hepsi gecti):
  tsc --noEmit  -> temiz
  vitest run    -> 35/35
  vite build    -> 379 KB (gzip 82 KB), 775 ms

  !!! MOUNT TUZAGI: node_modules/.bin BU DISKTE OLUSMUYOR (symlink izni yok)
  ve npm mount uzerindeki package.json'a bagimliliklari YAZAMIYOR.
  Bagimliliklar package.json'a ELLE yazildi.
  Build/test icin proje /tmp'ye kopyalanip orada calistirilir:
    rm -rf /tmp/build && mkdir -p /tmp/build
    cd ASCEND && tar --exclude=node_modules --exclude='.git*' \
      --exclude=_SILINEBILIR_yedekler --exclude=dist -cf - . \
      | (cd /tmp/build && tar xf -)
    cd /tmp/build && npm i
    ./node_modules/.bin/tsc --noEmit
    ./node_modules/.bin/vitest run
    ./node_modules/.bin/vite build

MIMARI KARAR (D-050): uygulama koca bagli kalmamali.
  Kullanicinin AI erisimi 1 ay garantili. Bu yuzden uyarlama kurali ve
  planner Faz 3'ten V1'e cekildi. Ikisi de deterministik, LLM gerektirmiyor.
  Koc kaybolsa bile uygulama slot secmeye ve hedef ayarlamaya devam eder.

AGAC EKRANI BITTI (src/ui/Tree.tsx):
  197 dugumun tamami, ANA GORUNUM (kullanici oyle istedi).
  Dokunmatik: tek parmak surukle = gez, iki parmak = yakinlas.
  Node'a dokun -> alt panel: on kosullar, ne acar, ipuclari, hatalar,
  yakinlik gostergesi, "bu hedefe giden yolu goster" (GPS).
  Filtreler: tumu / acik / sirada / boss + arama.
  Yerlesim src/data/layout.json'dan gelir (make_layout.py uretir).
  Alt gezinme: Bugun <-> Agac.

GITHUB ACTIONS (.github/workflows/deploy.yml):
  push -> veri yeniden uretilir ve commit edilenle KARSILASTIRILIR
       -> tsc --noEmit -> vitest -> vite build -> Pages'e yayin
  !!! KULLANICI BIR KEZ YAPMALI: Settings > Pages > Source: GitHub Actions
  Ondan sonra GITHUBA_GONDER.bat her calistiginda site kendini yeniler.

ILERLEME + TERFI EKRANI BITTI (src/ui/Progress.tsx):
  TERFI: Main slot ALTIN kademeye ulasinca en uste cikan kart.
  "X altin kademede -> ana hareket Y oluyor, X yardimciya iniyor."
  Oyunun en iyi odul ani; boss yilda bir, terfi ayda bir.
  Ayrica: seviye/XP, 4 sayac, SONRAKI KADEMEYE EN YAKIN 5 hareket
  (gunluk motivasyon motoru), hedeflere mesafe cubuklari, kademe dagilimi.

AYARLAR BITTI (src/ui/Settings.tsx):
  YEDEK en ustte ve uyarili — yerel-oncelikli oldugu icin cihaz kaybi
  = veri kaybi. Disa/ice aktarma. Ekipman ac/kapa (barfiks eklenince
  Pull agacinin 17 dugumu acilir). Kisit listesi gorunur.

PWA BITTI (public/):
  manifest.webmanifest, icon.svg, sw.js (uygulama kabugu onbellegi).
  Telefon ana ekranina eklenebiliyor, internetsiz aciliyor.
  Parkta/salonda internet olmayabilir.

GEZINME: Bugun · Agac · Ilerleme · Ayarlar (alt cubuk)

OYUN KATMANI BITTI - 2026-08-01 (src/engine/game.ts + src/ui/Celebrate.tsx):
  Kurucunun tespiti: "opus5'e prompt verdim oyun yaptı falan oluyor, biz o
  seviyede bi sey yapmadik." Dogruydu. SECOND_BRAIN 18'de 20 oyun sistemi
  tasarlanmisti, uygulamada ~6'si vardi. Eksikler yazildi:

    rankOf()      RUTBE - 6 asama x 3 alt kademe (Beginner I .. Legendary III)
                  MEDYAN'dan hesaplanir, ortalamadan degil. Tek yuksek
                  dugum rutbeyi sismez.
    streakOf()    SERI - HAFTALIK. Icinde bulunulan hafta seriyi KIRMAZ.
                  Gunluk seri dinlenmeyi cezalandirirdi -> M-3 ihlali.
    bossStates()  BOSS HP = 100 x (1 - ilerleme). 22 boss, en yakin once.
    titlesOf()    8 UNVAN. Yarisi disiplin odullendiriyor, guc degil.
    ascensionOf() 6 EKSEN. XP birikir, bu DUSEBILIR (istikrar ekseni).

  ONEMLI TEST DERSI: zamana bagli fonksiyon icinde new Date() cagirirsa
  test edilemez. titlesOf/ascensionOf/streakOf hepsi `today` parametresi
  alir. Uc test bu yuzden patlamisti.

  UI'ya baglandi:
    Today.tsx     basliga rutbe + haftalik seri sayaci
    Celebrate.tsx TAM EKRAN KADEME KUTLAMASI - CSS animasyon (ring/pulse/
                  rise/spark) + navigator.vibrate(). Titresim deseni
                  kademeyle guclenir (bronz 1 vurus, master 5 vurus).
                  Seans bitiminde tierUps varsa otomatik acilir.
    Progress.tsx  YENIDEN YAZILDI: rutbe karti, haftalik seri noktalari,
                  terfi, yakinlik, BOSS HP CUBUKLARI, ASCENSION eksenleri,
                  unvanlar (kazanilan + en yakin 3), hedefler, dagilim.
    Tree.tsx      boss dugumlerde TAC (♛) + kirmizi nabizli hale,
                  kazanilmis dugumlerde kademe rengi hale,
                  siradaki dugumlerde camgobegi nabiz,
                  GPS yolunda akan kesikli cizgi,
                  boss secilince detay panelinde HP cubugu.

  DOGRULAMA: tsc temiz, 52/52 test (35 engine + 17 game), build 419 KB
  (gzip 94 KB). Karar kaydi: SECOND_BRAIN D-052.

FIGUR MOTORU + KALIBRASYON BITTI - 2026-08-01:
  Kurucunun tespiti: "eklediklerine saygi duydum da icimi acmadi, iyi bir
  proje olmadi yani sanki." Teshis: uygulamada TEK BIR GORSEL YOKTU.
  197 hareket vardi, hepsi kutu+yazi. Kurucunun motivasyonu ise bedeni
  hayal etmekti. Iki tur ust uste "oyun gibi degil" elestirisine DAHA COK
  SAYI ile cevap verilmisti.

  src/ui/figure/poses.ts   25 poz, hareket AILELERINE bagli (veride 26 aile)
                           her poz iki kare: a=alt/baslangic, b=ust/bitis
  src/ui/figure/Figure.tsx SVG siluet + SMIL animasyonu (JS dongusu YOK)
                           uzak kol/bacak = yakinin kaydirilmis soluk kopyasi
  src/ui/Avatar.tsx        onde sen (su anki ana hareket), arkada hedefin
                           hayaleti kesikli ve soluk
  src/ui/Calibrate.tsx     ilk acilista 8 olcum noktasi; mastery tohumlanir

  FIGURLER SU EKRANLARDA: Bugun (her egzersiz karti), Agac (detay paneli),
  Ilerleme (avatar + boss satirlari), Kutlama (madalyanin icinde).

  !!! GORSEL DOGRULAMA DERSI: 50 kare PNG'ye basilip GOZLE incelendi.
  Dort poz yanlisti (sinav yerde yatiyordu, squat diz cokmus, muscle-up
  tuvalden tasiyordu, dip masaya yaslanmis). tsc temiz olmasi bir cizimin
  dogru oldugunu SOYLEMEZ. Poz degistirirsen tekrar bas ve bak:
    python3 /tmp/mkposes.py && convert -density 130 /tmp/poses.svg out.png

  GENEL DERS: kullanici "his" hakkinda konusuyorsa SISTEM EKLEME.
  Sistem eklemek olculebilir oldugu icin guvenli hissettirir, his uretmez.

  Karar kaydi: SECOND_BRAIN D-053.

!!! PROGRAM DISI YUK - 2026-08-15 (D-063)
  engine/outside.ts   tur/siddet/sicrama kaydi, cakisma uyarilari
  ui/Outside.tsx      kayit karti (2 dokunus) + uyari bandi
  adaptation.ts       fatigued -> "3+ altinda %20 dus" kurali ASKIYA ALINIR
  storage.ts          SCHEMA_VERSION 3, migrate v2->v3 (bos liste)
  report.ts           "Program disi" bolumu + yorgun gun isareti

  SORUN: README ilk gunden "baska antrenmanin yaninda calisir" diyordu
  ama uygulamanin bunu OGRENECEK yolu yoktu. Varsayim belgedeydi,
  veride degil. Dun 150 squat yapan biri bugun planktan 10sn az tutar;
  sistem bunu GERILEME sanip hedefi kalici dusururdu. Kilo takibiyle
  (D-062 §1.2) tamamen ayni sinifta sessiz olcum hatasi.

  !!! ISTISNANIN SINIRI VAR: bir kere affeder, iki kere affetmez.
  Onceki seansta da 3+ acik varsa hedef duser. Sinir olmasaydi surekli
  dis antrenman yapan biri ulasilamaz hedefe kilitlenirdi.
  DIKKAT: plato kurali bunu YAKALAMIYOR — plato "hedefi tam tutturma"
  halinde tetikleniyor, "tutturamama" halinde degil. Ilk tasarim
  sonsuz dongu uretiyordu, testte yakalandi.

  KASTEN YAPILMAYAN: dis antrenman seriye/XP'ye/kademeye GIRMEZ.
  Uygulama beceri agacini takip ediyor; oraya squat girerse kademeler
  yanlis oynar. Dis yuk BAGLAM'dir, ilerleme degil.

  Sicrama ayri sayiliyor: plyometrik yuk tendona biner, tendon kastan
  yavas toparlar. 7 gunde 3+ sicrama seansi -> uyari.

  Toplam 166/166 test. sw.js CACHE v4.

!!! DAYANIKLILIK KATMANI - 2026-08-14 (D-062)
  Dort gozle inceleme: docs/YOL_HARITASI.md (sporcu/gelistirici/
  elestirici/kullanici + 5 tartisma ve sentezleri).

  ARASTIRMA BULGUSU: fitness uygulamalarinda 30. gun tutunma %3-4,
  terk sebeplerinin basi ELLE GIRIS. Oyunlastirma basarisizligi
  gorunur kilinca zararli, toparlanmayi destekleyince faydali.

  ui/ErrorBoundary.tsx  render hatasi -> kurtarma ekrani, veri indir
  storage.ts            SCHEMA_VERSION + migrate(), goc VERI SILMEZ
  engine/comeback.ts    10+ gun ara -> hedef duser, geri donus plani
  ui/Bodyweight.tsx     haftalik tarti (goreli guc sporu)
  Today                 "hedefi yaptim" hizli giris + form ipuclari
  program.ts            duvar handstand ISINMANIN ICINE

  !!! IKI MEKANIZMA BIRBIRININ TERSI, KARISTIRMA:
    DELOAD       SET duser, hedef sabit  -> yorgunluk bosaltir
    GERI DONUS   HEDEF duser, set sabit  -> seviye yeniden bulunur
  Test bunu koruyor. Deload testi duzenli kayit ISTER, yoksa geri
  donus de tetiklenir ve test yaniltir.

  XP BASLIKTAN KALDIRILDI: dissal odul one cikarsa icsel motivasyon
  zayifliyor (meta-analiz ~ -0.36). Rutbe ve gun kaldi.

  Toplam 128/128 test.

KOC RAPORU - 2026-08-09 (D-061)
  src/engine/report.ts + Ayarlar'da "Raporu kopyala" butonu.

  SORUN: uygulama telefonda, kocluk konusmasi bilgisayarda. Kullanici
  kac tekrar yaptigini anlatiyordu - eksik ve yanlis hatirlanan aktarim.
  Tam yedek JSON'u binlerce satir, sohbete yapistirilamaz.

  COZUM: tek tusla panoya kopyalanan ~2 KB ozet. Dosya tasima yok.
  Icerik: son 14 gun seanslari + efor, son 3 seans gidisati, kademeler,
  hafta no, deload durumu. Iki seans ust uste dususe UYARI isareti.

  Rapor KISISEL VERI ICERMEZ, test bunu doguluyor.
  Bir test de uzunlugu koruyor (<4000 karakter) - yapistirilabilir
  olmak bu ozelligin islevsel gereksinimi, sus degil.

  OBSIDIAN NOTU: registry'de baglayici YOK, kullanicida vault da YOK
  (kurulu ama hic acilmamis). Sifirdan kurmak kazancindan fazla yuk.
  Zaten dosya erisimi var, araciya gerek yok.

!!! TERFI ARTIK GERCEK + DELOAD - 2026-08-06 (D-060)
  src/engine/session.ts  seans cozucu: sablon + agac durumu -> bugun

  SABLON SEKLI tarif eder, HAREKETI MOTOR secer. ProgramExercise'e
  `track` alani eklendi (hedef dugum id). Slot, mevcut hareket ALTIN
  kademeye ulasinca hedefe giden yoldaki bir sonraki dugume gecer.
  Bugun ve Ilerleme ekranlari AYNI fonksiyonu cagirir - biri terfi
  derken obürünün dememesi imkansiz, test bunu da doguluyor.

  !!! IKI GERCEK HATA TESTLE YAKALANDI:
  1. Terfi GERIYE gidiyordu. Tum yolu arayip "kademe kazanilmamis ilk
     dugum"u seciyordu; bos durumda yoldaki en alttaki dugume "terfi"
     edip kullaniciyi geriye goturuyordu. 4 sahte terfi uretiyordu.
  2. Duzeltmenin ilk hali fazla katiydi, hic terfi uretmedi.
     Dogrusu: terfi ILERI bakar. Yol topolojik sirada geldigi icin
     mevcut hareketin bulundugu noktadan SONRASI aranir.

  DELOAD: her 6. hafta set sayisi YARIYA, hedef tekrar AYNI, olcum yok.
  Tekrar dusurmemenin sebebi: dusunce hareket kolaylasir ve uyaran
  tamamen kesilir. Amac dinlenmek degil yorgunlugu bosaltmak.
  Hafta sayaci takvim degil KULLANICININ haftasi - ilk kayittan sayar.

  15 yeni test. Toplam 96/96.

!!! SINIR: DEPO = KALISTENIK, KISISEL PLAN = YEREL - (D-058)
  Kurucu karari: "kisisel seyler kalmasin GitHubda ama seninle kisisel
  seyleri paylasirim." Depo bir kalistenik SISTEMI, bir kisinin
  antrenman gunlugu degil.

  DEPODAN CIKANLAR: kisiye ozel salon programi (GYM_PLAN), Bugun
  ekranindaki salon karti, kisiye seslenen gerekce metinleri, ve EN
  ONEMLISI storage.ts DEFAULT_STATE icindeki saglik kisitlari
  (uygulamayi acan HERKES o kisitlarla basliyordu).

  !!! BU DOSYA DA DEPODA. Temizligi ANLATIRKEN veriyi tekrar yazma
  hatasi iki kez yapildi. Ornek verme, "kisiye seslenen gerekce" de.

  !!! DERS: kisisel veri yalnizca metinde degil VARSAYILAN DEGERLERDE
  de sizar. DEFAULT_STATE'e saglik kisiti yazmak README'ye yazmakla
  ayni sey, hatta daha kotu cunku goze carpmiyor.

  KISISEL OLANLAR NEREDE: PROFIL_YEREL.md ve ANTRENMAN_KAYDI_YEREL.md
  (ikisi de .gitignore'da). Salon programi, olculer, saglik durumu,
  haftalik kayit orada.

!!! PROGRAM v2 - BASKA ANTRENMANIN YANINDA - 2026-08-02 (D-057)
  UFUK DEGISTI: 6 ay -> EN AZ 1 YIL. Hedefler artik gercekci.
  Sablon, kullanicinin BASKA antrenman da yaptigi varsayimiyla kuruldu.

  HAFTA (depoda gun adi degil INDEKS ile anlatilir):
    1/3/5   BECERI gunu (15-20 dk, TAZE). Ayni gun baska antrenman
            varsa kalistenik ONCE.
    2/6     HAFIF gun, RIR 3-4, basarisizlik YOK
    4/7     tam dinlenme

  NEDEN BECERI ONCE: motor ogrenme yorgunken yanlis kalip ogretir.
  NEDEN YUK AYNI GUNE TOPLANIR: dagitilirsa 6 antrenman gunu olur,
  tendon hic bosta kalmiyor.
  NEDEN YINE DE 2 HAFIF GUN: beceri SIKLIK ister.

  ITME CAKISMASI: agirlik calisan biri icin bench + omuz press ayni
  dokuyu vuruyor, o yuzden buradaki itme HACIM degil BECERI.
  BACAK minimumda; agactaki bacak kolu oncelik degil, menude.

  src/program.ts v2 · Bugun ekraninda "neden burada" satiri
  8 program testi yapiyi koruyor. Toplam 77/77.
  TASARIM KARARI TESTLE KORUNMUYORSA ZAMANLA ASINIR.

DOSYA DUZENI - 2026-08-02
  Kok dizin temizlendi. Cop tek klasorde: "_SIL - bu klasoru silebilirsin"
  Icinde: eski .gitBAK_* klasorleri, eski prototip, eskimis araclar.
  Windows'tan sag tik > sil ile gidebilir, hicbiri gerekli degil.

  !!! MOUNT KURALI: bu diskte dosya SILINEMIYOR (Operation not permitted),
  sadece TASINABILIYOR. Silmek yerine _SIL klasorune tasi.

  KULLANICI KISAYOLLARI (depoda degil, .gitignore'da):
    "UYGULAMAYI AC.html"   buyuk buton + telefon icin karekod
    "PROJECT ASCEND.url"   cift tiklayinca siteyi acar

  README BASTAN YAZILDI. Iki gorsel eklendi (docs/img/):
    hareketler.gif   figur animasyonu (tools/rig/render.py uretti)
    agac.png         197 dugumluk agac (layout.json'dan uretildi)
  Sayilar guncellendi: 67 test, 25 poz, 56 karar kaydi.

KRONOMETRE + UCTAN UCA TEST - 2026-08-02 (D-056)
  src/ui/Timer.tsx      HoldTimer (plank/aski) + RestTimer (set arasi)
                        Sure BASLANGIC ZAMAN DAMGASINDAN hesaplanir;
                        sekme arkada kalinca setInterval yavasliyor.
  src/ui/flow.test.tsx  18 test, GERCEK React bilesenleri jsdom'da
                        kalibrasyon -> seans -> kutlama -> tum ekranlar

  DOGRULANDI: 30 sinav girilince pushup MASTER kademeye cikiyor, XP
  geliyor. Kalibrasyon gercekten isliyor, uygulama bos acilmiyor.

  Test ortami: vite.config.ts icinde environmentMatchGlobs ile
  *.test.tsx -> jsdom, *.test.ts -> node (motor testleri hizli kalsin).
  Yeni devDeps: jsdom, @testing-library/react + dom + user-event.

  !!! HALA EKSIK: gorsel dogrulama. Sandbox'a tarayici kurulamadi
  (playwright indirme engelli, sudo yok). Bu testler COKMEDIGINI
  kanitlar, GUZEL GORUNDUGUNU degil.

  DERS: birim testi sayisi calisan uygulama demek degil. 52 test
  geciyordu ve hicbiri uygulamayi ACMAMISTI.

!!! FIGUR ISKELETI ACI TABANLI - 2026-08-01 (D-055)
  Kurucu: "adamlar uyusturucu icmis gibiler." Sebep: poz = eklem KONUMU
  idi, ara degerde on kol uzayip kisaliyordu. Kemik boyu sabit olmali.

  ARTIK: poz = kok nokta + ACILAR (ileri kinematik). Kemik boyu yapi
  geregi sabit, aci interpolasyonu uzvu dogal yayda tasiyor.
  Temas noktalari (yerdeki el, bardaki el, ayak) ters kinematikle cakili.
  Her uzuv iki kez cizilir: arka plan renginde kontur + dolgu.

  !!! POZLAR URETILIR, ELLE YAZILMAZ:
      tools/rig/poses.py    <- pozlari burada duzenle
      tools/rig/emit.py     <- src/ui/figure/poses.ts uretir
      tools/rig/render.py   <- sheet / strip onizleme

      cd tools/rig
      python3 emit.py > ../../src/ui/figure/poses.ts
      python3 render.py strip PUSHUP,PULLUP,DIP && convert -density 120 strip.svg s.png

  DERS: gorsel isi GOZLE dogrula. tsc temizdi, 52 test geciyordu ve
  figurler sarhos gorunuyordu. Poz degistiysen serit bas ve bak.

!!! SERVICE WORKER TUZAGI - 2026-08-01 (D-054)
  sw.js v1 CACHE-FIRST idi. index.html bir kez onbellege girince sonsuza
  kadar oradan servis edildi. IKI SURUM boyunca kullanici hicbir
  degisiklik goremedi; push basariliydi, teslim degildi.

  KURAL: adi degismeyen bir dosyayi cache-first servis etme.
    HTML/gezinme -> ONCE AG   (guncellik onemli)
    /assets/*    -> once onbellek (dosya adinda hash var, icerik sabit)
  Ayrica main.tsx'te controllerchange -> tek seferlik reload.

  DERS: "push ettim, canlida" != "kullanici goruyor". Paket hash'ini
  dogrulamak yetmez; teslim yolunun tamami dogrulanmali.

  Kullanici hala eskisini goruyorsa: telefonda site verilerini temizle
  ya da PWA'yi ana ekrandan kaldirip yeniden ekle. (Bir kerelik.)

SIRADAKI KOD ISI:
  1. Veriye sessionBlock + handLoad/wristLoad alanlari
  2. Planner'i Bugun ekranina bagla (su an program.ts sabit sablon;
     planner slotlari uretebiliyor ama UI hala sablonu kullaniyor)
  3. Gunluk gorev ureticisi (18.7) — kurallı, rastgele degil
     (2'den SONRA yapilmali; sabit sablonda gorev anlamsiz)
  4. Sezon sistemi (18.12) — ertelendi

ANTRENMAN DURUMU:
  Kullaniciya ait hicbir sey burada YAZILMAZ - olcu, saglik, baslangic
  sayilari, takvim, aliskanlik. Hepsi yerel dosyalarda:
    PROFIL_YEREL.md            profil, kisitlar, ekipman, hedefler
    ANTRENMAN_KAYDI_YEREL.md   haftalik plan ve kayit
  Ikisi de .gitignore'da ve depoya ASLA girmez. (D-014, D-044, D-058)

--------------------------------------------------------------------------------
SON GUNCELLEME : 2026-08-14  (dort gozle inceleme + dayaniklilik katmani)
DURUM          : Faz 0 BITTI  (veri temeli, 196 hareket, 0 hata 0 uyari)
                 Faz 0.5 DEVAM (PLAN - v2.0 yazildi, 1 haftalik takvim var)
                 Faz 1 prototipi calisiyor, 61/61 test geciyor
                 !!! KOD YAZILMIYOR - once 7 gunluk planlama bitecek
SIRADAKI       : 1 HAFTALIK PLANLAMA TAKVIMI
                 Gun 1: Agac incelemesi (B-01)
                 Gun 2: Yerlestirme testi
                 Gun 3: Seans nesnesi
                 Gun 4: Aktif kadro + node ici ilerleme
                 Gun 5: Ekran akisi
                 Gun 6: Veri semasi v2
                 Gun 7: Gozden gecirme + Faz 1 KAPSAM KILIDI
                 (detay: SECOND_BRAIN bolum 26)

--------------------------------------------------------------------------------
GITHUB
--------------------------------------------------------------------------------
Depo    : https://github.com/kuurtali/project-ascend
Dal     : main
Durum   : yayinlandi, 8 commit

GORUNURLUK: PUBLIC olacak (D-041 revize edildi - aktiflik gorunur olmali).
  >>> SON ADIM KULLANICIDA: GitHub'da Settings > General > en alt
      "Danger Zone" > "Change visibility" > Change to public
  Bu bir hesap ayari degisikligi oldugu icin Claude yapamaz.

PUBLIC ONCESI YAPILAN TEMIZLIK (onemli - sirasi kritikti):
  1. Kisisel veri depodan cikarildi (D-044)
     Olculer, saglik kisiti detayi, mezuniyet + CV gerekcesi
     -> PROFIL_YEREL.md dosyasina tasindi (.gitignore'da, ASLA gonderilmez)
     -> Depoda tasarim gerekcelerinin TAMAMI kaldi
     -> Saglik kisiti GENEL bir sisteme donustu: kisit semasi + handLoad
        etiketleme + guvenli alternatif onerisi
  2. Commit gecmisindeki e-posta gizlendi (D-045)
     Kisisel adres -> GitHub noreply adresi (ID'li format)
     ID'li format ZORUNLU: eski format 2017 sonrasi hesaplarda katki
     grafigine sayilmaz.
     Gecmis yeniden yazildi, --force ile gonderildi. Baska katkici
     olmadigi icin guvenliydi; katkici olursa BIR DAHA YAPILMAZ.

  NOT: Bu dosya da depoda. Kisisel deger/adres YAZMAYIN - sadece
  "olculer", "kisisel adres" gibi genel ifadeler kullanin.
  (Bu hata bir kez yapildi ve yakalandi.)

  Sira tersine cevrilirse saglik verisi kalici olarak aciga cikar.

DEGISIKLIK GONDERME (iki yol):
  1) GitHub Desktop ac -> "Push origin" butonuna bas
  2) GITHUBA_GONDER.bat dosyasina cift tikla  (yerel, depoya dahil degil)

ONEMLI - satir sonu tuzagi:
  Sandbox (Linux) LF yazar, Windows git CRLF ister. Bu yuzden .gitattributes
  eklendi (* text=auto eol=lf) ve depo ayarina core.autocrlf=false yazildi.
  Bunlar olmadan her dosya "degismis" gorunuyor ve 26 dosyalik hayalet
  commit olusuyordu.

ONEMLI - yedek .git klasorleri:
  Mount uzerinde dosya SILINEMIYOR (Operation not permitted). Bu yuzden
  git kilit dosyasi takildiginda depo /tmp'de yeniden kurulup .git geri
  kopyalandi, eskisi .git_* / .gitTMP_* / .gitBAK_* olarak birakildi.
  Hepsi .gitignore'da. Windows'tan elle silinebilirler, zararsizlar.

--------------------------------------------------------------------------------
v2.0'DA NE DEGISTI (ozet)
--------------------------------------------------------------------------------
DENETIM: 9 kaynak dosyadan 67 kavram tarandi, 14'u EKSIKTI.
  Sebep bilgi kaybi degil IKAME: kurucunun cercevesi okunmus ama yerine
  yenisi konmustu. En net ornek: MASTER_PROMPT'taki 8 PROJECT PRINCIPLES
  yerine kendi 9 First Principles listesi yazilmisti.

GERI KONANLAR:
  - Kurucunun 8 ilkesi (Beginner First, Mastery Before Difficulty,
    Visible Progress, Quality Before Quantity, Consistency Wins,
    Science Before Ego, Expand Forever, Game First)
    -> Bunlar First Principles'in USTUNDE. Celisirlerse bunlar kazanir.
  - Ranks (Titles'tan AYRI sistem)
  - Localization Ready / Accessibility Ready (mimari kontrol listesi)
  - Knowledge XP, Custom Trees, Automatic Progression, Marketplace
  - "Operating system for learning calisthenics" cercevesi

CHARTER TAMAMEN YENIDEN YAZILDI (en onemli degisiklik):
  ESKI (YANLIS): "haftada 4 gun antrenman yapan, 5 ayda elit temel"
  DOGRU        : antrenman gecmisi VAR, ARA VERMIS, yeniden basliyor
  Sabit hedefler (3x15 pushup, 3x10 pullup) KALDIRILDI
  -> yerlestirmeye gore GORELI hedefler

  IKINCI KULLANICI da degisti:
  ESKI: "mutlak baslangic" (Faz 4)
  DOGRU: "ara vermis, yeniden baslayan" (Faz 2-3) = kurucuyla AYNI kisi

  PROJENIN IKI AMACI VAR:
  1. Kisisel arac (birincil)
  2. Portfolyo - kurucu Subat'ta AKTUERYA mezunu olacak
     Hikaye: "spora ilgi duydum, kendim icin yaptim, paylasiyorum"
     Sonuc: BITMISLIK teknik gosteristen degerli
     CV sinyali arayuz kodunda DEGIL, veri/modelleme katmaninda
     (196 node graf, XP egrileri, denge puani = aktuerya ile uyumlu)

  APP STORE: "simdilik sadece fikir" -> React Native catali KAPANDI
  Tek platform: web. Mobil gerekirse Capacitor.

5 YENI SISTEM (v1.0'da HIC YOKTU, en buyuk bosluklardi):
  18.11 Seans Nesnesi     - "bu aksam 45 dk'da ne yapacagim" cevabi yoktu
  18.12 Aktif Kadro       - 182 acik node varken sorun erisim degil SECIM
  18.13 Node Ici Ilerleme - plato problemi; tempo/duraklama/ROM/agirlik
  18.16 Comeback Modeli   - ara vermis kullanici ANA senaryo
  18.17 Yerlestirme       - "nereden basliyorum" cevabi yoktu

VERI HATASI DUZELTILDI:
  shoulder-mobility sadece ["band"] idi. Omuz mobilitesi ekipmansiz yapilir.
  O node dip/pike-pushup/german-hang kapisi oldugu icin bantsiz kullanici
  39 node ve 8 boss kaybediyordu.
  Duzeltildi -> kurucunun ekipmaniyla erisim %72'den %93'e cikti
  (141 -> 182 node, 8 -> 17 boss)
  NOT: Direnc bandi SISTEMDE KALIR - diger kullanicilar icin degerli.
  Dogrulayiciya 11. kontrol eklendi: "ekipman kaskadi"
--------------------------------------------------------------------------------


================================================================================
1. PROJE NEDIR (tek paragraf)
================================================================================
Project Ascend, RPG mantigiyla calisan uzun vadeli bir kalistenik gelisim
platformu. Antrenman kaydedici DEGIL. Her hareket bir skill node; her node
onkosullari tamamlaninca acilir; XP / seviye / mastery / boss / gorev
sistemleriyle oyunlastirilir. Hedef kitle sirasi: 1) kurucu, 2) mutlak
baslangic, 3) ileri sporcu, 4) antrenor. Kurucu (L) uygulamayi kendisi de
kullanacak: haftada 4 gun, ilk 5 ay elit temel; ekipman = power tower
(barfiks + dip), zemin, duvar, ip.

Vizyon cumlesi:
  "Bir insani sifirdan elit kalistenik seviyesine tasiyan, her adimi gorunur
   ve kilitli-acik mantigiyla yonetilen, on yillarca yasayabilen bir
   ilerleme sistemi."

CALISMA SIRASI KURALI: Once planin tamami biter, sonra uygulama baslar.
Bu kural bir kez ihlal edildi (bkz. bolum 3, D-019).


================================================================================
2. TAMAMLANAN ISLER
================================================================================

[BITTI] FAZ 0 - VERI TEMELI
  AMAC   : "Skill tree"yi konusmaktan cikarip veriye cevirmek.
  BULGU  : 9 vizyon dosyasi vardi, HIC KOD YOKTU. Ayni hareket listesi
           2 dosyada birbirinden farkliydi. Hicbir yerde onkosul grafi
           yoktu. XP/mastery tek bir sayi icermiyordu.
  CIKTI  : data/movements.json - 196 hareket
           196 hareket / 22 boss / 23 kok node / 49 aksesuar
           234 baglanti / maks derinlik 11 / maks tier 9
           Toplam kazanilabilir XP: 525.480
           Push 25, Vertical Push 12, Explosive 8, Dips 10, Pull 43,
           Core 25, Legs 20, Balance 16, Mobility 11, Conditioning 11,
           Elite 11, Recovery 4
  DOGRULAMA: 10 otomatik kontrol -> 0 HATA, 0 UYARI
           (kirik referans / dongu / derinlik / tier monotonlugu /
            yetim node / yaprak node / aksesuar tutarliligi /
            boss erisilebilirligi / ekipman-kategori gecerliligi /
            mastery esik sirasi)
  KANIT  : Sadece bronz kademeye cikarak 196 node'un TAMAMI 5 iterasyonda
           aciliyor. Yani agacta kilitlenme yok, 22 boss'un hepsi gercekten
           ulasilabilir.

[BITTI] FAZ 0.5 - PLAN (ANA IS)
  AMAC   : Kullanicinin asil talebi. 31 bolumlu, 7 Part'li tek dosya:
           "Claude'a sadece bunu ver, devam etsin."
  CIKTI  : PROJECT_ASCEND_SECOND_BRAIN.md
           3029 satir / 114 KB / 31 bolum / 7 Part
           31 anchor, 31 ic link, 0 kirik link
           Etiket dagilimi: 51 [KESIN], 35 [TASARIM], 34 [RESEARCH],
                            15 [TODO], 10 [BRAINSTORM], 8 [RED]
           28 karar kaydi (D-001..D-028)
           25 acik soru (S-01..S-25)
           196 hareketin tamami listede, 22 boss'un tamami islenmis
  ICERIK :
    Part 1 FOUNDATION      01 Vision · 02 Mission · 03 First Principles ·
                           04 Constitution · 05 Manifesto · 06 Charter ·
                           07 Non Goals · 08 Philosophy
    Part 2 ARCHITECTURE    09 Skill Tree Theory · 10 Movement Database ·
                           11 Skill Genome · 12 Knowledge Graph ·
                           13 AI Architecture · 16 Architecture · 17 Database
    Part 3 CALIS. BIBLE    19 Skill Trees · 20 Movement List (tam liste)
    Part 4 GAME DESIGN     18 Game Systems (11 alt sistem, formullerle)
    Part 5 AI              14 AI Council · 15 Governance · 21 Research
    Part 6 PRODUCT         22 Roadmap · 23 Business · 24 GitHub ·
                           25 Documentation · 26 Backlog
    Part 7 BRAIN           27 Idea Vault · 28 Timeline ·
                           29 Decision History · 30 Open Questions ·
                           31 Future Vision
  ONEMLI : Onceki 00_AMAC_VE_PLAN.md ve 01_YOL_HARITASI.md bu dosyaya
           ENTEGRE EDILDI ve arsiv/ klasorune tasindi. Kural M-7
           (tek dogruluk kaynagi) geregi.

[BITTI] FAZ 1 PROTOTIPI (erken uretildi - bkz. D-019)
  AMAC   : Mekaniklerin gercekten calistigini KANITLAMAK.
  CIKTI  : prototype/ascend_prototype.html - 88 KB, tek dosya,
           kurulum gerektirmez, cift tiklayip acilir
  OZELLIK: 196 node'lu zoom/pan SVG skill tree, 12 kategori bandi,
           234 kenar; node durumlari (kilitli/acik/bronz/gumus/altin/
           master); detay paneli (onkosullar, ne acar, mastery esikleri,
           ipuclari, sik hatalar, kaslar, ekipman); kayit girisi +
           otomatik mastery degerlendirmesi + XP; Skill GPS (hedefe giden
           tum yolu vurgular); 5 filtre; boss HP gostergeleri;
           denge puani; disa/ice aktarma; sifirlama
  TEKNIK : Yerlesim (x,y) Python'da onceden hesaplandi.
           Veri 64 KB'a sikistirildi (tips/mistakes aileye tasindi).
           Kayit: localStorage (try/catch korumali) + JSON disa aktarma.

[BITTI] PROTOTIP TESTI - 61 TEST
  NOT    : jsdom bu ortamda calismiyor; kendi DOM shim'i yazildi.
           Gercek uygulama kodunu vm ile calistirir, uretilen SVG/HTML
           metni uzerinden sayim yapar.
  KAPSAM : yukleme+cizim 11 / detay paneli 7 / kilit mantigi 4 /
           kayit-XP-kilit acma 7 / gecersiz kayit reddi 5 /
           seviye egrisi 4 / Skill GPS 5 / filtreler 6 / denge 2 /
           boss HP 2 / tam erisilebilirlik 4 / sifirlama 4
  SONUC  : 61/61 GECTI
  KRITIK : Test GERCEK BIR FORMUL HATASI yakaladi (D-016).
           Denge puani "her kategori esit pay almali" (1/N) varsayiyordu.
           Pull'da 43, Explosive'de 8 hareket var; esit pay beklemek
           Pull'da DOGRU ilerleyen kullaniciyi cezalandiriyordu.
           Simulasyonda her hareket bronza cikarildiginda puan 100 degil
           62 geldi -> formul yanlisti. Kategori buyuklugune gore
           normalize edildi; artik her sey bitince 96-100.


================================================================================
3. YAPILAN HATA VE DERSI (onemli - tekrarlanmamali)
================================================================================
D-019 · SIRALAMA IHLALI

Kullanicinin niyeti "once planin tamami, sonra uygulama"ydi ve bu niyet
"Yeni Metin Belgesi.txt"nin son bolumunde acikca yaziliydi
(PROJECT_ASCEND_SECOND_BRAIN.md talebi, 31 bolumluk yapi, 7 Part semasi,
"Ben bunu tek dosya yapmam" ifadesi).

Bu bolum OKUNMADI. 9 dosyanin 8'i bastan sona okundu; 9'u (837 satir)
yalnizca ilk 200 satiri okunup gerisi baslik taramasiyla gecildi.
Asil talep 195. satirdan sonrasindaydi. Sonuc: prototip erken uretildi,
plan geride kaldi.

DERS: Bir dosyanin uzunlugu onemsizliginin gostergesi degil. En son
degistirilen dosya en guncel niyeti tasir ve ILK TAM OKUNMALIDIR.
Baslik taramasi okuma sayilmaz.

SONUC: Prototip cope atilmadi - Faz 1 icin gecerli bir cikti ve
mekanikleri dogruladi. Ama sira duzeltildi: plan (Second Brain)
tamamlandi, uygulama ondan sonra.


================================================================================
4. DOSYA ENVANTERI
================================================================================
ASCEND/
  PROJECT_ASCEND_SECOND_BRAIN.md  <- ANA DOKUMAN (3029 satir)
  _CHECKPOINT.txt                 <- BU DOSYA (nerede kaldik)

  data/
    movements.json                <- TEK DOGRULUK KAYNAGI (196 hareket)
    validation_report.txt         <- son dogrulama (0 hata 0 uyari)

  build/
    movements_data.py             <- ELLE DUZENLENEN YER (kaynak veri)
    build_db.py                   <- genisletici + dogrulayici + JSON yazici
    make_layout.py                <- yerlesim hesabi + sikistirma
    template.html                 <- prototip sablonu (__ASCEND_DATA__)
    test_prototype.js             <- 61 fonksiyonel test

  prototype/
    ascend_prototype.html         <- CALISAN PROTOTIP (cift tikla)

  arsiv/
    00_AMAC_VE_PLAN.md            <- Second Brain'e entegre edildi
    01_YOL_HARITASI.md            <- Second Brain'e entegre edildi
    _NEDEN_ARSIVDE.txt

  # Orijinal vizyon notlari (DEGISTIRILMEDI, arsiv statusunde):
  PROJECT_ASCEND_AI_BRIEF.txt
  PROJECT_ASCEND_MASTER_PROMPT.txt
  PROJECT_ASCEND_MASTER_PROMPT_V2.txt
  PROJECT_ASCEND_GAMEPLAY_RULES.txt
  PROJECT_ASCEND_MISSING_SYSTEMS_AUDIT.txt
  PROJECT_ASCEND_FUTURE_IDEAS_AND_ARCHITECT_GUIDE.txt
  Project_Ascend_Master_Movement_List.txt
  Project_Ascend_V2_Master_Movement_Database.txt
  Yeni Metin Belgesi.txt          <- 837 satir, Turkce beyin firtinasi.
                                     Second Brain talebi burada.


================================================================================
5. URETIM ZINCIRI (veri degisince sirayla calistir)
================================================================================
  cd build
  python3 build_db.py          -> movements.json + validation_report.txt
                                  0 HATA vermezse DEVAM ETME
  python3 make_layout.py       -> ascend_data.js
  python3 -c "d=open('ascend_data.js',encoding='utf-8').read();
    t=open('template.html',encoding='utf-8').read();
    open('ascend_prototype.html','w',encoding='utf-8').write(
      t.replace('__ASCEND_DATA__',d))"
  node test_prototype.js       -> 61/61 GECMELI
  # sonra kopyala:
  cp movements.json validation_report.txt ../data/
  cp ascend_prototype.html ../prototype/

KURAL: movements.json ELLE DUZENLENMEZ. build/movements_data.py duzenlenir.


================================================================================
6. SIRADAKI ADIMLAR
================================================================================
>>> B-01 · AGACIN ICERIK INCELEMESI  (ONCELIK 1)
    Prototipi acip agaci elestirmek: yanlis siralanmis onkosul, eksik ara
    adim, gereksiz kapi, yanlis mastery esigi.
    NEDEN SIMDI: Veri duzeltmesi en ucuz bu asamada. Kod bindikten sonra
    her degisiklik pahalanir.
    BILINEN SUPHELI NOKTALAR (inceleme baslangici):
      - Nordic Curl derinlik 3'te ama tier 6 -> zincir cok kisa
      - deep-pushup / dive-bomber / v-pushup gercekten aksesuar mi
      - Push'ta archer'a giden iki ayri yol (wide ve uneven) - ikisi de
        gerekli mi
      - mike-tyson-pushup explosive ailesinde ama push kategorisinde
      - Mastery esikleri: pull-up bronz 3 tekrar gercekten
        "yapabiliyorum" mu?

    B-02 · Mastery dogrulama kuralini uygula (14 gun / 2 seans)
           Prototipte YOK, tek kayitla kademe veriyor. Seans tarihi
           tutulmali.

    B-03 · Skill Genome verisi yaz (196 x 18 oznitelik)
           BLOKE: oznitelik listesi kesinlesmeli (S-06).
           NOT: Bu, projenin EN YUKSEK KALDIRACLI isi - tek veri
           eklemesi 5 ayri sistemi (Skill Radar, Weak Point Detector,
           Skill Synergy, Recommendation Engine, Failure Analytics)
           mumkun kiliyor.

    B-04 · Gercek MVP projesi kur (Vite + TypeScript + React)
           Motor katmani ayri modullere cikar, IndexedDB kalici kayit,
           4 gunluk program gorunumu.
           UYARI: Prototipin ilerleme kaydi TASINABILIR DEGIL sayilmali.
           Gecis oncesi "Disa aktar" ile JSON alinmali.

    B-05 · progressTest alani tanimla (olcum protokolu)
    B-06 · Eksik knowledge graph iliskileri
           (regression_of, variation_of, antagonist_of)


================================================================================
7. KARARA BAGLANMIS ONEMLI NOKTALAR
================================================================================
Tam liste ve gerekceler: SECOND_BRAIN bolum 29 (D-001..D-028).
Ozet:

  Platform    : web oncelikli, yerel-oncelikli, sunucusuz
                TypeScript + React + Vite + Tailwind + IndexedDB
                Mobil gerekirse ayni koddan Capacitor
  Kilit       : onkosullar AND; bronz kademe kilidi acar
  Mastery     : 4 kademe; 14 gunde 2 ayri seansta dogrulanir
  XP          : 30 x 1.53^tier; carpanlar 1.0/1.6/2.6/4.2
                XP her sette DEGIL, kademe atlanınca verilir
  Seviye      : 100 x (N-1)^1.6
  Seri        : HAFTALIK (gunluk degil); deload seriyi kirmaz
  Denge puani : kategori BUYUKLUGUNE gore normalize
  Gorevler    : kurallı (aktif progression + zayif kategori + bakim)
  Mobilite    : GERCEK onkosul (8 kapi tanimli)
  Faz 3 AI    : LLM YOK, tamami deterministik hesaplama
  Bulut       : Faz 4    Antrenor modu: Faz 4
  Gelir       : Faz 4'e kadar dusunulmez; kilit ASLA paraya baglanmaz
  Yok         : liderlik tablosu, sosyal karsilastirma, prestige,
                new game+, skill fusion, endless tree, inventory,
                genetics/body analysis, reklam, pay-to-unlock


================================================================================
8. BIR SONRAKI AJANA NOTLAR
================================================================================
- ANA DOKUMANI OKU: PROJECT_ASCEND_SECOND_BRAIN.md. Her kararin gerekcesi
  orada. Bir sey tartismali gorunuyorsa cevap bolum 03 (First Principles)
  veya 04 (Constitution) icinde.
- movements.json'u ELLE DUZENLEMEYIN. build/movements_data.py duzenlenir,
  build_db.py calistirilir. 0 hata vermezse degisiklik kabul edilmez.
- Hareket id'leri KALICIDIR. Isim degisebilir, id degismez; tum ilerleme
  kayitlari id'ye bagli.
- Yeni hareket eklerken: onkosul zinciri kok node'a kadar tam olmali,
  tier onkosullarindan kucuk olmamali, yaprak kalacaksa ACCESSORY setine
  eklenmeli. Dogrulayici bunlari yakalar.
- YENI MEKANIK = YENI TEST. test_prototype.js su an 61 test kosuyor.
  "Calisiyor" demenin sarti testin gecmesidir (kural M-8).
- KAPSAM PATLAMASI bu projenin bir numarali olum nedeni. Yeni fikir
  geldiginde SECOND_BRAIN bolum 07'deki 4 soruyu uygula. Reddedilmis
  fikirleri (bolum 27) gerekce okumadan yeniden acma.
- Kullanici KOD YAZMIYOR. Ciktilar calisir durumda teslim edilmeli;
  "su komutu calistir" seklinde birakilmamali.
- jsdom bu ortamda calismiyor; prototip testi kendi DOM shim'ini kullaniyor.
  Test altyapisini degistirmeden once test_prototype.js basindaki shim'i oku.
- HER OTURUM BU DOSYANIN GUNCELLENMESIYLE BITER (Checkpoint Discipline).
  Kalici karar alindiysa SECOND_BRAIN bolum 29'a da kayit girilir.


================================================================================
OTURUM OZETI (2026-07-25)
================================================================================
BASLANGIC : 9 vizyon dosyasi, hic kod yok, celisen 2 hareket listesi,
            sifir sayisallastirilmis mekanik, tanimsiz 60+ fikir,
            hangi dosyanin gecerli oldugu belirsiz.

BITIS     : PROJECT_ASCEND_SECOND_BRAIN.md - 3029 satirlik tek referans
            dokumani (31 bolum, 7 Part, 28 karar kaydi, 25 acik soru,
            60+ fikrin tam tasnifi, 9 gerekceli red)
            196 hareketlik dogrulanmis skill tree (0 hata)
            Sayisallastirilmis oyun mekanikleri (formullerle)
            Calisan prototip (88 KB tek dosya)
            61/61 gecen test paketi

URETILEN  : 1 ana dokuman + 1 checkpoint + 5 kod dosyasi + 1 prototip
            + 1 test paketi + arsiv duzeni
================================================================================
