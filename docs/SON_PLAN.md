# SON PLAN — ağaç oturdu, geriye ne kaldı

*21 Ağustos 2026. Ağaç sistemi tamamlandı ve kullanıcı onayladı. Bu
belge, projeyi "çalışıyor"dan "bitti" noktasına taşıyan son listeyi
sıraya koyuyor.*

---

## Nerede duruyoruz

Çekirdek mantık artık tek cümle: **şu hareketten şu kadar yap, sonraki
açılsın.** Ağaç bunu hem gösteriyor hem uyguluyor.

```
GÖREV
360 tekrar Standard Push-up yap → Incline Push-up açılır
BİRİKEN TEKRAR · bugün +50                    51 / 360
310 tekrar kaldı. Arada gün atlaman önemli değil, toplam düşmez.
```

Ön koşulu bitmemiş düğüme sayı girilemiyor; kilit engelleyenleri
listeliyor ve dokununca oraya atlıyor. Israr edilirse geçiliyor ama
uyarı kalıyor — sistemin görüşü net, karar kullanıcının.

Yanında duranlar: uyarlama kuralı, kademe doğrulaması, deload, geri
dönüş, program dışı yük, süreklilik şeridi, koç raporu. 213 test.

---

## Sıra

### A · İlerleme grafiği · **en yüksek öncelik**

README'nin kendi kabul ettiği eksik, ve projenin var oluş sebeplerinden
biri: *"sekiz haftada şınavı 12'den 16'ya çıkardı ama bunu kimse
kaydetmedi, o yüzden hissedilmedi."*

Şu an uygulama "bir sonraki kademeye ne kadar kaldı"yı gösteriyor;
**seni oraya getiren eğriyi** göstermiyor. Kullanıcı da bunu sordu:
*"gelişiyor mu anlamadım."*

İki grafik yeter:

- **Hareket başına haftalık en iyi** — çizgi. "8 hafta önce 12, bugün 16."
- **Biriken hacim eğrisi** — alan. Aynı zamanda terfi kapısının göstergesi.

İlerleme ekranına, çalıştıklarım listesindeki hareketler için. Yeni
kütüphane gerekmez; SVG ile çizilir, ağacın kendisi zaten SVG.

### B · Kalibrasyon özet ekranı

Ölçüm bitince kullanıcı sessizce Bugün ekranına atılıyor. *"Değerleri
girince de bir şey olmamış"* izlenimi büyük ölçüde buradan geldi —
D-064 ölçümün **etkisini** düzeltti, **görünürlüğünü** düzeltmedi.

Gösterilecek: kaç düğüm açıldı, rütbe nereye oturdu, ilk seansın
hedefleri ne oldu. Tek ekran, bir düğme.

### C · Hedefi elle değiştirebilme

Kullanıcı *"geri kalan her şeyi ben ayarlarım"* dedi ama hedefe dokunmanın
yolu hâlâ yok. Sistem önerir, kullanıcı üstüne yazar, yazdığı kalıcı olur
ve uyarlama kuralı oradan devam eder.

Uyarlama kuralını iptal etmiyor — **önerinin statüsünü** değiştiriyor.
Aynı ilke terfi kapısında zaten uygulandı; tutarlılık için burada da
olmalı.

### D · Eşikler veriden üretilsin · **portfolyo değeri en yüksek**

Hacim kapısı formülden çıkıyor (`altın hedef × set × 8`) ama arkasındaki
bronz/gümüş/altın sayıları hâlâ **elle atılmış yargı.**

Öneri: her harekete **vücut ağırlığının yüzdesi** olarak bir yük katsayısı
— şınav ~%64, pike ~%73, duvar HSPU ~%92, serbest HSPU ~%100 — ve
eşikleri bu katsayıdan türetmek. Aynı model "bir sonraki hareketi 5 tekrar
yapabilir misin" sorusunu da cevaplar, yani terfi mantığının kendisi de
oradan çıkar.

`build_db.py` bunu doğrular: katsayı arttıkça eşik düşmeli, yol boyunca
tutarlı olmalı. 197 hareketin eşiği "birinin kanaati" olmaktan çıkıp
üretilmiş veriye dönüşür.

### E · Ekran görüntüleri · *kullanıcının işi*

Depoda ağaç diyagramı ve figür animasyonu var, **uygulamanın kendi
arayüzünden tek kare yok.** Depoya giren biri "bu neye benziyor"
sorusunun cevabını bulamıyor. Telefondan üç kare: Bugün · Ağaç · İlerleme.

### F · Görsel regresyon testi

Bilinen eksik. 213 test çökmediğini kanıtlıyor, doğru göründüğünü değil.
Figürler bir kez zaten sessizce bozulmuştu (D-055).

### G · Yabancı kullanıcı · **bilinçli olarak ertelendi**

Gün seçimi, hedef seçimi, "nasıl çalışıyor" ekranı, İngilizce arayüz.
Sonda çünkü uygulama önce **bir** kişide çalışsın. Bu bir eksik değil,
bir sıralama kararı — README'de de öyle yazıyor.

---

## Zamanlama

```
Bu hafta      A · B          görünürlük — kullanıcının en çok eksikliğini duyduğu şey
Sonra         C · E
Sonra         D              tek başına bir hafta sonu, ama depoyu bambaşka yapar
Açık uçlu     F · G
```

---

## Ne değişmeyecek

Bunlar tartışmaya kapalı; değişirlerse proje başka bir proje olur:

- **Motor deterministik kalır.** LLM yok, sunucu yok, ağ yok.
- **Veri elle düzenlenmez.** `movements.json` üretilir ve doğrulanır.
- **Karar kullanıcının.** Sistem önerir, kilitlemez.
- **Bağlam ilerleme değildir.** Dış yük ve alışkanlık işaretleri
  kademelere ve XP'ye girmez; ağaç yalan söylemez.
- **Sıralama sağlıktan önce gelmez.** Ön koşulun hedefi bitmeden
  sonraki hareket önerilmez.
- **Kişisel veri depoya girmez.** Kök dizinde ne varsa depoya aittir;
  gerisi `_yerel/`.
