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

SIRADAKI KOD ISI:
  1. Agac ekrani — prototype/index.html'deki SVG'yi React'e tasi
     (kullanici agaci begendi, "Obsidian notu gibi" dedi)
  2. GitHub Actions ile Pages'e otomatik yayin
     (kullanici Pages'i bir kez tarayicidan acar)
  3. Ilerleme ekrani + TERFI ekrani (Main slot yukselince)
  4. Veriye sessionBlock + handLoad/wristLoad alanlari

ANTRENMAN DURUMU:
  Kullanici AGUSTOS basinda basliyor, alet o zamana geliyor.
  Baslangic: sinav max ~30 (master ustu), barfiks 2, hollow iyi.
  Sigarayi Agustos basinda birakiyor.
  Program: her gun (5/7) ip + sinav 2 tip + dips + cekis + core
           siklik her gun, YOGUNLUK doner (agir 2 / hafif 3 gun)
  Detay: ANTRENMAN_KAYDI_YEREL.md (depoda YOK, yerel)

--------------------------------------------------------------------------------
SON GUNCELLEME : 2026-07-26  (kod basladi)
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
