# Project Ascend - Movement source data
# Format: (id, name, category, tier, mtype, equipment, prereqs, thresholds, muscles, family, boss)
# mtype: reps | reps_side | hold(sec) | count | dist(m)
# thresholds: (bronze, silver, gold, master)

FAMILIES = {
    "pushup": {
        "cues": ["Gövde tek parça: kalça düşmesin, popo yükselmesin.",
                 "Dirsekler 45 derece, kanatlanmasın.",
                 "Göğüs yere yaklaşsın, tam kilitle bitir."],
        "mistakes": ["Kalça sarkması", "Boyun öne düşmesi", "Yarım hareket açıklığı",
                     "Dirseklerin 90 derece açılması"],
    },
    "vertical_push": {
        "cues": ["Kalça bileklerin üstüne gelsin, ağırlık ellere binsin.",
                 "Baş elleri arasından geçsin, üçgen dursun.",
                 "Omuz kürekleri yukarı doğru itilsin (elevation)."],
        "mistakes": ["Kalçanın geride kalması", "Alnı yere değdirmemek",
                     "Bel çukurunu bozmak"],
    },
    "explosive_push": {
        "cues": ["İnişte yumuşak karşıla, dirsekleri kilitli tutma.",
                 "Yukarı itişte tüm gövde aynı anda kalksın.",
                 "Set başına düşük tekrar, yüksek kalite."],
        "mistakes": ["Sert iniş (dirsek/bilek riski)", "Yorgunken devam etmek",
                     "Kalçayı kullanarak hile yapmak"],
    },
    "dip": {
        "cues": ["Omuz kürekleri aşağı-geri, kulaklardan uzaklaşsın.",
                 "Dirsekler gövdeye yakın, öne hafif eğil.",
                 "Omuz dirsek seviyesinin altına inmesin (esneklik yoksa)."],
        "mistakes": ["Omuzların kulaklara yükselmesi", "Aşırı derin inip omuz zorlaması",
                     "Sallanarak momentum almak"],
    },
    "hang": {
        "cues": ["Aktif askıda omuz kürekleri aşağı çekili.",
                 "Kaburgalar aşağı, karın kilitli.",
                 "Süreyi haftada %10'dan fazla artırma."],
        "mistakes": ["Tamamen gevşek omuz (pasif) ile ağır yüklenme",
                     "Nefes tutmak", "Bilek/dirsek ağrısını görmezden gelmek"],
    },
    "row": {
        "cues": ["Vücut çubuk gibi düz, topuktan omuza tek hat.",
                 "Göğüs çubuğa dokunsun.",
                 "Ayakları yaklaştırmak hareketi kolaylaştırır."],
        "mistakes": ["Kalçanın sarkması", "Yarım çekiş", "Boynu öne uzatmak"],
    },
    "pullup": {
        "cues": ["Ölü askıdan başla, önce kürekleri indir.",
                 "Dirsekleri cebe doğru çek, çene çubuğu geçsin.",
                 "İnişi kontrollü yap (2-3 saniye)."],
        "mistakes": ["Kipping/sallanma", "Yarım hareket", "Omuzları kulaklarda bırakmak"],
    },
    "muscleup": {
        "cues": ["Yüksek çekiş + hızlı bilek geçişi tek akışta olsun.",
                 "Göğsü çubuğa değdirecek güç olmadan geçişe çalışma.",
                 "False grip halkalarda zorunlu."],
        "mistakes": ["Tek kol önce geçmek", "Aşırı kip ile bel zorlaması",
                     "Geçiş sonrası dip gücü olmadan denemek"],
    },
    "front_lever": {
        "cues": ["Kürekler geri-aşağı (retraksiyon + depresyon), kollar düz.",
                 "Kalça kilitli, hollow pozisyon korunsun.",
                 "Tuck→adv tuck→tek bacak→straddle sırasını atlama."],
        "mistakes": ["Dirsek bükmek", "Kalça düşmesi", "Nefes tutup gövde kontrolünü kaybetmek"],
    },
    "back_lever": {
        "cues": ["Omuz esnekliği şart: german hang'de rahat ol.",
                 "Kollar düz, kürekler geri.",
                 "Dirsek/omuz ön kısmında zorlanma varsa geri adım at."],
        "mistakes": ["Isınmadan denemek", "Bel aşırı çukurlaşması",
                     "Omuz mobilitesi yetersizken tam pozisyona geçmek"],
    },
    "planche": {
        "cues": ["Kürekler öne-aşağı protraksiyon + depresyon.",
                 "Kalça kilitli, gövde hollow, ağırlık öne.",
                 "Bilek hazırlığı olmadan lean süresini artırma."],
        "mistakes": ["Kalçayı yükseltmek", "Kürek protraksiyonu yapmamak",
                     "Bilek ısınmasını atlamak"],
    },
    "core_hold": {
        "cues": ["Kaburgaları aşağı çek, bel yere yapışsın.",
                 "Nefes almaya devam et.",
                 "Titreme başladığında formu bozmadan bitir."],
        "mistakes": ["Bel boşluğu", "Nefes tutmak", "Süreyi form pahasına uzatmak"],
    },
    "leg_raise": {
        "cues": ["Önce kürekleri aktive et, sonra kalçayı topla.",
                 "Sallanmayı kes, her tekrar durarak başlasın.",
                 "Bacakları düz tutamıyorsan tuck'a dön."],
        "mistakes": ["Momentum ile sallanma", "Sadece kalçadan çalışıp karnı devre dışı bırakmak"],
    },
    "lsit": {
        "cues": ["Omuzları aşağı it, kollar düz.",
                 "Kompresyon esnekliği (pike) süreyi belirler.",
                 "Bacaklar kalça hizasının üstüne çıksın."],
        "mistakes": ["Kalçanın altta kalması", "Dizlerin bükülmesi", "Omuz elevasyonu"],
    },
    "squat": {
        "cues": ["Topuklar yerde, diz ayak hizasında.",
                 "Kalça derinliği diz altına insin.",
                 "Bel nötr, göğüs açık."],
        "mistakes": ["Topuk kalkması", "Dizlerin içe düşmesi", "Yarım derinlik"],
    },
    "single_leg": {
        "cues": ["Ayak bileği esnekliği ilk sınırlayıcı.",
                 "Yavaş iniş, dizi kontrol et.",
                 "İki taraf arası fark %20'yi geçmesin."],
        "mistakes": ["Dizin içe kaçması", "Kontrolsüz düşme", "Zayıf tarafı ihmal etmek"],
    },
    "handstand": {
        "cues": ["Parmaklarla zemini kavra, denge parmaklardan gelir.",
                 "Kaburgalar kapalı, kalça kilitli, hafif hollow.",
                 "Günde kısa ve sık pratik > uzun tek seans."],
        "mistakes": ["Muz sırt (aşırı bel çukuru)", "Bilek ısınmasını atlamak",
                     "Düşme becerisini öğrenmemek"],
    },
    "balance_arm": {
        "cues": ["Bakış öne, ağırlık parmak uçlarına.",
                 "Dirsekler hafif bükülü, kürekler öne itili.",
                 "Bilek hazırlığı zorunlu."],
        "mistakes": ["Bakışın aşağıda kalması", "Nefes tutmak", "Bilek ağrısını yok saymak"],
    },
    "mobility": {
        "cues": ["Günlük kısa tekrar, haftada tek uzun seanstan iyidir.",
                 "Ağrı değil gerilme hissi ara.",
                 "Aktif kontrol (yüklü esneklik) pasif esneklikten değerli."],
        "mistakes": ["Isınmadan zorlamak", "Nefes tutmak", "İlerlemeyi ölçmemek"],
    },
    "grip": {
        "cues": ["Başparmak sarmalı kavrayışı güçlendirir.",
                 "Nasır bakımı yap, yırtılma antrenman kaybettirir.",
                 "Hacmi yavaş artır: tendon kastan yavaş uyum sağlar."],
        "mistakes": ["Çok hızlı hacim artışı", "Dirsek iç ağrısını yok saymak"],
    },
    "jump_rope": {
        "cues": ["Sıçrama 2-3 cm yeterli, bilekten çevir.",
                 "Dirsekler gövdeye yakın.",
                 "Hataya değil ritme odaklan."],
        "mistakes": ["Kolların tamamıyla çevirmek", "Yüksek zıplamak", "Sert zeminde uzun seans"],
    },
    "run": {
        "cues": ["Kadans 170+, adım gövdenin altına düşsün.",
                 "Haftalık hacmi %10'dan fazla artırma."],
        "mistakes": ["Aşırı uzun adım", "Ani hacim artışı"],
    },
    "oa_push": {
        "cues": ["Ayaklar geniş, gövde rotasyonunu minimumda tut.",
                 "Serbest el sırtta veya yanda sabit.",
                 "Tek kol öncesi archer/typewriter hakimiyeti şart."],
        "mistakes": ["Gövdeyi çevirerek hile yapmak", "Kalçayı yükseltmek",
                     "Yetersiz temel güçle denemek"],
    },
    "oa_pull": {
        "cues": ["Tek kol negatifleri ve lastikli asistans temel yöntemdir.",
                 "Dirsek tendonuna dikkat: haftada 2 seanstan fazla yapma.",
                 "20+ temiz pull-up olmadan başlamayın."],
        "mistakes": ["Erken başlamak", "Aşırı hacim", "Tek tarafı ihmal etmek"],
    },
    "rings_elite": {
        "cues": ["Yıllarla ölçülen hedef: eklem hazırlığı önce gelir.",
                 "Lastik/makine asistansı ile kademeli yüklen.",
                 "Dirsek ve omuz ön kapsülü en riskli bölge."],
        "mistakes": ["Hazırlıksız denemek", "Ağrıyı ilerleme sanmak", "Deload atlamak"],
    },
    "recovery": {
        "cues": ["Uyku en güçlü performans arttırıcıdır.",
                 "4-6 haftada bir deload planla.",
                 "Ağrı ile yorgunluğu ayırt et."],
        "mistakes": ["Her hafta maksimuma çıkmak", "Uykuyu antrenmana feda etmek"],
    },
}

M = []  # movement rows

# ---------------------------------------------------------------- PUSH (yatay)
M += [
 ("wall-pushup","Wall Push-up","push",0,"reps",["floor"],[],(8,12,15,20),["göğüs","omuz","triceps"],"pushup",0),
 ("incline-pushup","Incline Push-up","push",0,"reps",["floor","box"],["wall-pushup"],(8,12,15,20),["göğüs","omuz","triceps"],"pushup",0),
 ("knee-pushup","Knee Push-up","push",0,"reps",["floor"],["wall-pushup"],(8,12,15,20),["göğüs","triceps","core"],"pushup",0),
 ("pushup","Standard Push-up","push",1,"reps",["floor"],["incline-pushup","knee-pushup"],(5,10,15,25),["göğüs","omuz","triceps","core"],"pushup",0),
 ("wide-pushup","Wide Push-up","push",1,"reps",["floor"],["pushup"],(5,10,15,20),["göğüs","omuz"],"pushup",0),
 ("close-grip-pushup","Close Grip Push-up","push",2,"reps",["floor"],["pushup"],(5,8,12,18),["triceps","göğüs"],"pushup",0),
 ("diamond-pushup","Diamond Push-up","push",2,"reps",["floor"],["close-grip-pushup"],(5,8,12,18),["triceps","göğüs iç"],"pushup",0),
 ("knuckle-pushup","Knuckle Push-up","push",2,"reps",["floor"],["pushup"],(5,8,12,18),["bilek","göğüs","triceps"],"pushup",0),
 ("decline-pushup","Decline Push-up","push",2,"reps",["floor","box"],["pushup"],(5,8,12,18),["üst göğüs","omuz"],"pushup",0),
 ("deep-pushup","Deep Push-up","push",2,"reps",["parallettes"],["pushup"],(5,8,12,18),["göğüs","omuz"],"pushup",0),
 ("hindu-pushup","Hindu Push-up","push",2,"reps",["floor"],["pushup"],(5,8,12,15),["omuz","göğüs","thoracic"],"pushup",0),
 ("dive-bomber","Dive Bomber Push-up","push",3,"reps",["floor"],["hindu-pushup"],(5,8,12,15),["omuz","göğüs","core"],"pushup",0),
 ("sphinx-pushup","Sphinx Push-up","push",3,"reps",["floor"],["diamond-pushup"],(3,6,10,15),["triceps"],"pushup",0),
 ("fingertip-pushup","Fingertip Push-up","push",3,"reps",["floor"],["knuckle-pushup","finger-mobility"],(3,6,10,15),["parmak","önkol","göğüs"],"grip",0),
 ("finger-pushup","Finger Push-up","push",5,"reps",["floor"],["fingertip-pushup"],(1,3,5,8),["parmak","önkol"],"grip",0),
 ("offset-pushup","Offset Push-up","push",2,"reps_side",["floor"],["pushup"],(5,8,12,15),["göğüs","triceps","core"],"pushup",0),
 ("uneven-pushup","Uneven Push-up","push",3,"reps_side",["floor","box"],["offset-pushup"],(5,8,12,15),["göğüs","triceps"],"pushup",0),
 ("archer-pushup","Archer Push-up","push",4,"reps_side",["floor"],["uneven-pushup","wide-pushup"],(3,6,10,12),["göğüs","triceps"],"oa_push",0),
 ("typewriter-pushup","Typewriter Push-up","push",5,"reps_side",["floor"],["archer-pushup"],(3,5,8,10),["göğüs","omuz","core"],"oa_push",0),
 ("assisted-oap","Assisted One Arm Push-up","push",5,"reps_side",["floor","band"],["archer-pushup"],(3,5,8,10),["göğüs","triceps","core"],"oa_push",0),
 ("negative-oap","Negative One Arm Push-up","push",6,"reps_side",["floor"],["assisted-oap"],(2,3,5,8),["göğüs","triceps","core"],"oa_push",0),
 ("one-arm-pushup","One Arm Push-up","push",7,"reps_side",["floor"],["negative-oap","typewriter-pushup"],(1,3,5,8),["göğüs","triceps","oblik","core"],"oa_push",1),
 ("pseudo-planche-pushup","Pseudo Planche Push-up","push",4,"reps",["floor"],["diamond-pushup","decline-pushup","wrist-mobility"],(3,6,10,15),["ön omuz","göğüs","core"],"planche",0),
 ("mike-tyson-pushup","Mike Tyson Push-up","push",4,"reps",["floor"],["pushup","hollow-hold"],(3,6,10,15),["göğüs","core","kalça fleksör"],"explosive_push",0),
 ("russian-pushup","Russian Push-up","push",5,"reps",["floor"],["diamond-pushup","sphinx-pushup"],(3,5,8,12),["triceps","göğüs"],"pushup",0),
]

# ------------------------------------------------------- PUSH (dikey / vertical)
M += [
 ("pike-pushup","Pike Push-up","vertical_push",2,"reps",["floor"],["pushup","shoulder-mobility"],(5,8,12,18),["omuz","triceps"],"vertical_push",0),
 ("v-pushup","V Push-up","vertical_push",3,"reps",["floor"],["pike-pushup"],(5,8,12,15),["omuz","triceps"],"vertical_push",0),
 ("elevated-pike-pushup","Elevated Pike Push-up","vertical_push",3,"reps",["box"],["pike-pushup"],(5,8,12,15),["omuz","triceps"],"vertical_push",0),
 ("box-pike-pushup","Box Pike Push-up","vertical_push",4,"reps",["box"],["elevated-pike-pushup"],(3,6,10,12),["omuz","triceps","core"],"vertical_push",0),
 ("wall-walk","Wall Walk","vertical_push",3,"reps",["wall"],["pike-pushup","wrist-mobility"],(3,5,8,10),["omuz","core"],"handstand",0),
 ("wall-hspu","Wall Handstand Push-up","vertical_push",5,"reps",["wall"],["box-pike-pushup","wall-handstand"],(2,5,8,12),["omuz","triceps","üst sırt"],"vertical_push",0),
 ("negative-hspu","Negative Handstand Push-up","vertical_push",6,"reps",["wall"],["wall-hspu"],(2,4,6,8),["omuz","triceps"],"vertical_push",0),
 ("partial-hspu","Partial Handstand Push-up","vertical_push",6,"reps",["wall"],["negative-hspu"],(2,4,6,8),["omuz","triceps"],"vertical_push",0),
 ("hspu","Handstand Push-up","vertical_push",7,"reps",["floor","wall"],["partial-hspu","freestanding-handstand"],(1,3,5,8),["omuz","triceps","core"],"vertical_push",1),
 ("tiger-bend","Tiger Bend Push-up","vertical_push",8,"reps",["floor","wall"],["hspu"],(1,2,4,6),["triceps","omuz"],"vertical_push",0),
 ("90-degree-pushup","90 Degree Push-up","vertical_push",9,"reps",["floor","parallettes"],["hspu","full-planche"],(1,2,3,5),["omuz","triceps","core"],"planche",1),
 ("one-arm-hspu","One Arm Handstand Push-up","vertical_push",9,"reps_side",["wall"],["hspu","one-arm-handstand"],(1,1,2,3),["omuz","triceps","core"],"rings_elite",1),
]

# ------------------------------------------------------------- EXPLOSIVE PUSH
M += [
 ("dynamic-pushup","Dynamic Push-up","explosive",3,"reps",["floor"],["pushup"],(5,8,12,15),["göğüs","triceps"],"explosive_push",0),
 ("explosive-pushup","Explosive Push-up","explosive",3,"reps",["floor"],["dynamic-pushup"],(5,8,10,15),["göğüs","triceps"],"explosive_push",0),
 ("clap-pushup","Clap Push-up","explosive",4,"reps",["floor"],["explosive-pushup"],(3,6,10,15),["göğüs","triceps","core"],"explosive_push",0),
 ("double-clap-pushup","Double Clap Push-up","explosive",6,"reps",["floor"],["clap-pushup"],(1,3,5,8),["göğüs","triceps"],"explosive_push",0),
 ("behind-back-clap","Behind the Back Clap Push-up","explosive",7,"reps",["floor"],["double-clap-pushup"],(1,2,3,5),["göğüs","triceps","omuz"],"explosive_push",0),
 ("superman-pushup","Superman Push-up","explosive",7,"reps",["floor"],["clap-pushup","hollow-rocks"],(1,2,4,6),["göğüs","core","omuz"],"explosive_push",0),
 ("aztec-pushup","Aztec Push-up","explosive",8,"reps",["floor"],["superman-pushup"],(1,2,3,5),["göğüs","core","kalça fleksör"],"explosive_push",0),
 ("plyo-dip","Plyometric Dip","explosive",4,"reps",["dip-station"],["parallel-bar-dip"],(3,5,8,12),["triceps","göğüs"],"explosive_push",0),
]

# -------------------------------------------------------------------- DIPS
M += [
 ("bench-dip","Bench Dip","dips",1,"reps",["box"],[],(8,12,18,25),["triceps","omuz"],"dip",0),
 ("parallel-bar-dip","Parallel Bar Dip","dips",2,"reps",["dip-station"],["bench-dip","shoulder-mobility"],(5,10,15,25),["triceps","göğüs","omuz"],"dip",0),
 ("deep-dip","Deep Dip","dips",3,"reps",["dip-station"],["parallel-bar-dip"],(5,8,12,20),["göğüs","triceps"],"dip",0),
 ("straight-bar-dip","Straight Bar Dip","dips",3,"reps",["pullup-bar"],["parallel-bar-dip"],(5,8,12,20),["göğüs","triceps","core"],"dip",0),
 ("ring-dip","Ring Dip","dips",4,"reps",["rings"],["parallel-bar-dip"],(3,6,10,15),["triceps","göğüs","stabilizatör"],"dip",0),
 ("rto-dip","Ring Turned Out Dip","dips",5,"reps",["rings"],["ring-dip"],(3,5,8,12),["göğüs","triceps","biceps tendon"],"dip",0),
 ("archer-dip","Archer Dip","dips",5,"reps_side",["dip-station"],["deep-dip"],(3,5,8,10),["triceps","göğüs"],"dip",0),
 ("korean-dip","Korean Dip","dips",5,"reps",["pullup-bar"],["straight-bar-dip","shoulder-mobility"],(3,5,8,12),["göğüs","omuz ön","triceps"],"dip",0),
 ("impossible-dip","Impossible Dip","dips",8,"reps",["pullup-bar"],["korean-dip","straight-bar-dip"],(1,2,3,5),["göğüs","triceps","core"],"rings_elite",0),
 ("weighted-dip","Weighted Dip","dips",5,"reps",["dip-station","vest"],["parallel-bar-dip"],(5,8,10,12),["triceps","göğüs"],"dip",0),
]

# -------------------------------------------------------------------- PULL
M += [
 ("passive-hang","Passive Hang","pull",0,"hold",["pullup-bar"],[],(20,40,60,90),["kavrama","omuz"],"hang",0),
 ("active-hang","Active Hang","pull",1,"hold",["pullup-bar"],["passive-hang"],(15,30,45,60),["kürek","sırt","kavrama"],"hang",0),
 ("scapular-pullup","Scapular Pull-up","pull",1,"reps",["pullup-bar"],["active-hang"],(5,10,15,20),["kürek","alt trapez"],"hang",0),
 ("false-grip-hang","False Grip Hang","pull",3,"hold",["rings"],["active-hang"],(10,20,30,45),["önkol","kavrama"],"grip",0),
 ("australian-row","Australian Row","pull",1,"reps",["pullup-bar"],[],(8,12,18,25),["sırt","biceps"],"row",0),
 ("inverted-row","Inverted Row","pull",2,"reps",["pullup-bar"],["australian-row"],(8,12,15,20),["sırt","biceps","core"],"row",0),
 ("ring-row","Ring Row","pull",2,"reps",["rings"],["australian-row"],(8,12,15,20),["sırt","biceps","stabilizatör"],"row",0),
 ("negative-pullup","Negative Pull-up","pull",2,"reps",["pullup-bar"],["scapular-pullup"],(3,5,8,10),["sırt","biceps"],"pullup",0),
 ("chin-up","Chin-up","pull",3,"reps",["pullup-bar"],["negative-pullup","inverted-row"],(3,6,10,15),["biceps","sırt"],"pullup",0),
 ("neutral-pullup","Neutral Grip Pull-up","pull",3,"reps",["pullup-bar"],["negative-pullup"],(3,6,10,15),["sırt","biceps"],"pullup",0),
 ("pull-up","Pull-up","pull",3,"reps",["pullup-bar"],["chin-up"],(3,8,12,20),["latissimus","sırt","biceps"],"pullup",0),
 ("wide-pullup","Wide Pull-up","pull",4,"reps",["pullup-bar"],["pull-up"],(3,6,10,15),["latissimus","üst sırt"],"pullup",0),
 ("close-pullup","Close Grip Pull-up","pull",4,"reps",["pullup-bar"],["pull-up"],(3,6,10,15),["latissimus","biceps"],"pullup",0),
 ("commando-pullup","Commando Pull-up","pull",4,"reps_side",["pullup-bar"],["pull-up"],(3,5,8,12),["sırt","core","oblik"],"pullup",0),
 ("mixed-grip-pullup","Mixed Grip Pull-up","pull",4,"reps",["pullup-bar"],["pull-up"],(3,6,10,12),["sırt","biceps"],"pullup",0),
 ("weighted-pullup","Weighted Pull-up","pull",5,"reps",["pullup-bar","vest"],["pull-up"],(3,5,8,10),["latissimus","biceps"],"pullup",0),
 ("l-sit-pullup","L-Sit Pull-up","pull",5,"reps",["pullup-bar"],["pull-up","l-sit"],(3,5,8,12),["sırt","core"],"pullup",0),
 ("chest-to-bar","Chest-to-Bar Pull-up","pull",5,"reps",["pullup-bar"],["pull-up"],(2,4,6,10),["sırt","biceps"],"pullup",0),
 ("explosive-pullup","Explosive Pull-up","pull",5,"reps",["pullup-bar"],["pull-up"],(3,5,8,10),["sırt","biceps","güç"],"pullup",0),
 ("high-pullup","High Pull-up","pull",6,"reps",["pullup-bar"],["explosive-pullup","chest-to-bar"],(2,3,5,8),["sırt","biceps"],"muscleup",0),
 ("archer-pullup","Archer Pull-up","pull",6,"reps_side",["pullup-bar"],["wide-pullup"],(2,4,6,10),["latissimus","biceps"],"oa_pull",0),
 ("typewriter-pullup","Typewriter Pull-up","pull",7,"reps_side",["pullup-bar"],["archer-pullup"],(1,3,5,8),["latissimus","core"],"oa_pull",0),
 ("ice-cream-maker","Ice Cream Maker","pull",7,"reps",["pullup-bar"],["chest-to-bar","tuck-front-lever"],(1,3,5,8),["sırt","core"],"front_lever",0),
 ("bar-muscle-up","Bar Muscle-Up","pull",7,"reps",["pullup-bar"],["high-pullup","straight-bar-dip"],(1,3,5,10),["sırt","göğüs","triceps"],"muscleup",1),
 ("ring-muscle-up","Ring Muscle-Up","pull",7,"reps",["rings"],["bar-muscle-up","false-grip-hang","ring-dip"],(1,3,5,8),["sırt","göğüs","triceps"],"muscleup",1),
 ("oap-progression","One Arm Pull-up Progression","pull",8,"reps_side",["pullup-bar","band"],["archer-pullup","typewriter-pullup"],(1,2,3,5),["latissimus","biceps","kavrama"],"oa_pull",0),
 ("one-arm-pullup","One Arm Pull-up","pull",9,"reps_side",["pullup-bar"],["oap-progression"],(1,1,2,3),["latissimus","biceps","core"],"oa_pull",1),
 ("towel-hang","Towel Hang","pull",4,"hold",["pullup-bar"],["active-hang"],(15,25,40,60),["kavrama","önkol"],"grip",0),
 ("fingertip-hang","Fingertip Hang","pull",5,"hold",["pullup-bar"],["active-hang","finger-mobility"],(10,20,30,45),["parmak","önkol"],"grip",0),
 ("one-arm-hang","One Arm Hang","pull",6,"hold",["pullup-bar"],["towel-hang"],(10,20,30,45),["kavrama","omuz","core"],"grip",0),
 ("pelican-curl","Pelican Curl","pull",7,"reps",["rings"],["ring-row","german-hang"],(1,3,5,8),["biceps","göğüs","tendon"],"rings_elite",0),
]

# -------------------------------------------------------- BACK / FRONT LEVER
M += [
 ("german-hang","German Hang","pull",3,"hold",["rings","pullup-bar"],["active-hang","shoulder-mobility"],(10,20,30,45),["omuz","göğüs","tendon"],"back_lever",0),
 ("skin-the-cat","Skin the Cat","pull",4,"reps",["rings","pullup-bar"],["german-hang"],(3,5,8,10),["omuz","core","sırt"],"back_lever",0),
 ("tuck-back-lever","Tuck Back Lever","pull",4,"hold",["pullup-bar","rings"],["skin-the-cat"],(5,10,20,30),["sırt","omuz","core"],"back_lever",0),
 ("adv-tuck-back-lever","Advanced Tuck Back Lever","pull",5,"hold",["pullup-bar","rings"],["tuck-back-lever"],(5,10,15,25),["sırt","omuz","core"],"back_lever",0),
 ("straddle-back-lever","Straddle Back Lever","pull",6,"hold",["pullup-bar","rings"],["adv-tuck-back-lever"],(5,10,15,20),["sırt","omuz","core"],"back_lever",0),
 ("back-lever","Back Lever","pull",7,"hold",["pullup-bar","rings"],["straddle-back-lever"],(3,8,15,20),["sırt","omuz","core"],"back_lever",1),
 ("tuck-front-lever","Tuck Front Lever","pull",5,"hold",["pullup-bar","rings"],["pull-up","hollow-hold"],(5,10,20,30),["latissimus","core"],"front_lever",0),
 ("adv-tuck-front-lever","Advanced Tuck Front Lever","pull",6,"hold",["pullup-bar","rings"],["tuck-front-lever"],(5,10,15,25),["latissimus","core"],"front_lever",0),
 ("one-leg-front-lever","One Leg Front Lever","pull",7,"hold",["pullup-bar","rings"],["adv-tuck-front-lever"],(5,8,12,20),["latissimus","core"],"front_lever",0),
 ("straddle-front-lever","Straddle Front Lever","pull",7,"hold",["pullup-bar","rings"],["one-leg-front-lever"],(3,8,12,20),["latissimus","core"],"front_lever",0),
 ("front-lever","Front Lever","pull",8,"hold",["pullup-bar","rings"],["straddle-front-lever"],(3,8,15,20),["latissimus","core","sırt"],"front_lever",1),
 ("front-lever-row","Front Lever Row","pull",9,"reps",["pullup-bar","rings"],["front-lever"],(1,2,3,5),["latissimus","core"],"front_lever",0),
]

# ------------------------------------------------------------------ PLANCHE
M += [
 ("planche-lean","Planche Lean","elite",4,"hold",["floor","parallettes"],["pseudo-planche-pushup"],(10,20,30,45),["ön omuz","kürek","core"],"planche",0),
 ("tuck-planche","Tuck Planche","elite",6,"hold",["floor","parallettes"],["planche-lean","frog-stand"],(5,10,20,30),["ön omuz","kürek","core"],"planche",0),
 ("adv-tuck-planche","Advanced Tuck Planche","elite",7,"hold",["floor","parallettes"],["tuck-planche"],(5,10,15,25),["ön omuz","core"],"planche",0),
 ("straddle-planche","Straddle Planche","elite",8,"hold",["floor","parallettes"],["adv-tuck-planche"],(3,8,12,20),["ön omuz","core"],"planche",0),
 ("full-planche","Full Planche","elite",9,"hold",["floor","parallettes"],["straddle-planche"],(2,5,10,15),["ön omuz","core","sırt"],"planche",1),
 ("tuck-planche-pushup","Tuck Planche Push-up","elite",8,"reps",["parallettes"],["tuck-planche","pseudo-planche-pushup"],(1,3,5,8),["ön omuz","göğüs"],"planche",0),
 ("planche-pushup","Planche Push-up","elite",9,"reps",["floor","parallettes"],["full-planche"],(1,2,3,5),["ön omuz","göğüs","core"],"planche",1),
]

# -------------------------------------------------------------------- CORE
M += [
 ("dead-bug","Dead Bug","core",0,"reps",["floor"],[],(8,12,16,20),["derin core"],"core_hold",0),
 ("plank","Plank","core",0,"hold",["floor"],[],(20,40,60,90),["core","omuz"],"core_hold",0),
 ("arch-hold","Arch Hold","core",1,"hold",["floor"],["plank"],(15,30,45,60),["arka zincir","bel"],"core_hold",0),
 ("side-plank","Side Plank","core",1,"hold",["floor"],["plank"],(20,30,45,60),["oblik","kalça"],"core_hold",0),
 ("copenhagen-plank","Copenhagen Plank","core",3,"hold",["box","bench"],["side-plank"],(10,20,30,45),["adduktör","oblik"],"core_hold",0),
 ("reverse-plank","Reverse Plank","core",1,"hold",["floor"],["plank"],(20,30,45,60),["arka zincir","omuz"],"core_hold",0),
 ("hollow-hold","Hollow Hold","core",1,"hold",["floor"],["dead-bug","plank"],(15,30,45,60),["core ön","kalça fleksör"],"core_hold",0),
 ("reverse-hollow-hold","Reverse Hollow Hold","core",2,"hold",["floor"],["hollow-hold","arch-hold"],(15,30,45,60),["arka zincir"],"core_hold",0),
 ("hollow-rocks","Hollow Rocks","core",2,"reps",["floor"],["hollow-hold"],(10,20,30,40),["core ön"],"core_hold",0),
 ("boat-hold","Boat Hold","core",1,"hold",["floor"],["hollow-hold"],(20,30,45,60),["core","kalça fleksör"],"core_hold",0),
 ("reverse-crunch","Reverse Crunch","core",1,"reps",["floor"],["dead-bug"],(8,12,18,25),["alt karın"],"core_hold",0),
 ("v-up","V-Up","core",2,"reps",["floor"],["reverse-crunch","hollow-hold"],(8,12,18,25),["karın","kalça fleksör"],"core_hold",0),
 ("hanging-knee-raise","Hanging Knee Raise","core",2,"reps",["pullup-bar"],["active-hang"],(5,10,15,20),["alt karın","kavrama"],"leg_raise",0),
 ("hanging-leg-raise","Hanging Leg Raise","core",3,"reps",["pullup-bar"],["hanging-knee-raise"],(5,10,15,20),["karın","kalça fleksör"],"leg_raise",0),
 ("toes-to-bar","Toes to Bar","core",4,"reps",["pullup-bar"],["hanging-leg-raise","pike-stretch"],(3,8,12,18),["karın","sırt"],"leg_raise",0),
 ("windshield-wipers","Windshield Wipers","core",6,"reps",["pullup-bar"],["toes-to-bar"],(3,5,8,12),["oblik","karın"],"leg_raise",0),
 ("compression-hold","Compression Hold","core",3,"hold",["floor"],["pike-stretch"],(10,20,30,45),["kalça fleksör","karın"],"lsit",0),
 ("compression-lift","Compression Lift","core",4,"reps",["floor"],["compression-hold"],(3,6,10,15),["kalça fleksör"],"lsit",0),
 ("tuck-l-sit","Tuck L-Sit","core",2,"hold",["parallettes","floor"],["hollow-hold"],(10,20,30,45),["karın","triceps","omuz"],"lsit",0),
 ("l-sit","L-Sit","core",4,"hold",["parallettes","floor","dip-station"],["tuck-l-sit","compression-hold"],(10,20,30,45),["karın","kalça fleksör","omuz"],"lsit",0),
 ("adv-l-sit","Advanced L-Sit","core",5,"hold",["parallettes"],["l-sit"],(5,15,25,35),["karın","omuz"],"lsit",0),
 ("v-sit","V-Sit","core",7,"hold",["parallettes"],["adv-l-sit","pancake-stretch"],(3,8,15,20),["karın","kalça fleksör","omuz"],"lsit",0),
 ("manna","Manna","core",9,"hold",["parallettes"],["v-sit"],(2,5,8,12),["omuz","karın","kalça fleksör"],"rings_elite",1),
 ("dragon-flag-negative","Dragon Flag Negative","core",5,"reps",["bench","pullup-bar","dip-station"],["hollow-hold","reverse-hollow-hold"],(3,5,8,12),["tüm core"],"core_hold",0),
 ("dragon-flag","Dragon Flag","core",6,"reps",["bench","pullup-bar","dip-station"],["dragon-flag-negative"],(3,5,8,12),["tüm core"],"core_hold",1),
]

# -------------------------------------------------------------------- LEGS
M += [
 ("bodyweight-squat","Bodyweight Squat","legs",0,"reps",["floor"],[],(15,25,40,60),["quadriceps","kalça"],"squat",0),
 ("calf-raise","Calf Raise","legs",0,"reps",["floor"],[],(15,25,40,60),["baldır"],"squat",0),
 ("sl-calf-raise","Single Leg Calf Raise","legs",1,"reps_side",["floor"],["calf-raise"],(10,15,25,35),["baldır"],"single_leg",0),
 ("split-squat","Split Squat","legs",1,"reps_side",["floor"],["bodyweight-squat"],(10,15,20,25),["quadriceps","kalça"],"single_leg",0),
 ("walking-lunge","Walking Lunge","legs",1,"reps_side",["floor"],["bodyweight-squat"],(10,15,20,30),["quadriceps","kalça"],"single_leg",0),
 ("reverse-lunge","Reverse Lunge","legs",1,"reps_side",["floor"],["bodyweight-squat"],(10,15,20,30),["kalça","hamstring"],"single_leg",0),
 ("sl-rdl","Single Leg Romanian Deadlift","legs",2,"reps_side",["floor"],["bodyweight-squat"],(8,12,18,25),["hamstring","kalça","denge"],"single_leg",0),
 ("bulgarian-split-squat","Bulgarian Split Squat","legs",2,"reps_side",["box"],["split-squat"],(8,12,18,25),["quadriceps","kalça"],"single_leg",0),
 ("jump-squat","Jump Squat","legs",2,"reps",["floor"],["bodyweight-squat"],(10,15,20,30),["quadriceps","patlayıcılık"],"squat",0),
 ("box-jump","Box Jump","legs",2,"reps",["box"],["jump-squat"],(8,12,18,25),["quadriceps","patlayıcılık"],"squat",0),
 ("tuck-jump","Tuck Jump","legs",3,"reps",["floor"],["jump-squat"],(8,12,18,25),["quadriceps","core"],"squat",0),
 ("broad-jump","Broad Jump","legs",3,"reps",["floor"],["jump-squat"],(5,8,12,18),["kalça","quadriceps"],"squat",0),
 ("cossack-squat","Cossack Squat","legs",3,"reps_side",["floor"],["bodyweight-squat","hip-mobility"],(5,10,15,20),["adduktör","quadriceps","kalça"],"single_leg",0),
 ("sissy-squat","Sissy Squat","legs",4,"reps",["floor"],["bodyweight-squat"],(5,10,15,20),["quadriceps","diz tendonu"],"squat",0),
 ("assisted-pistol","Assisted Pistol Squat","legs",3,"reps_side",["floor","band"],["bulgarian-split-squat"],(5,8,12,18),["quadriceps","kalça"],"single_leg",0),
 ("shrimp-squat","Shrimp Squat","legs",4,"reps_side",["floor"],["bulgarian-split-squat","ankle-mobility"],(3,6,10,15),["quadriceps","denge"],"single_leg",0),
 ("pistol-squat","Pistol Squat","legs",5,"reps_side",["floor"],["assisted-pistol","ankle-mobility"],(3,6,10,15),["quadriceps","kalça","denge"],"single_leg",1),
 ("dragon-squat","Dragon Squat","legs",7,"reps_side",["floor"],["pistol-squat","shrimp-squat","cossack-squat"],(1,3,5,8),["quadriceps","kalça","mobilite"],"single_leg",0),
 ("nordic-negative","Nordic Curl Negative","legs",4,"reps",["floor"],["reverse-lunge","sl-rdl"],(3,5,8,10),["hamstring"],"single_leg",0),
 ("nordic-curl","Nordic Curl","legs",6,"reps",["floor"],["nordic-negative"],(1,3,5,8),["hamstring"],"single_leg",1),
]

# ------------------------------------------------------------------ BALANCE
M += [
 ("bear-crawl","Bear Crawl","balance",0,"dist",["floor"],[],(10,20,30,50),["omuz","core"],"balance_arm",0),
 ("frog-stand","Frog Stand","balance",2,"hold",["floor"],["bear-crawl","wrist-mobility"],(10,20,30,45),["omuz","core","bilek"],"balance_arm",0),
 ("crow","Crow Pose","balance",3,"hold",["floor"],["frog-stand"],(10,20,30,45),["omuz","core"],"balance_arm",0),
 ("crane","Crane Pose","balance",4,"hold",["floor"],["crow"],(10,15,25,40),["omuz","core"],"balance_arm",0),
 ("elbow-lever","Elbow Lever","balance",4,"hold",["floor","parallettes"],["frog-stand"],(10,15,25,40),["core","omuz"],"balance_arm",0),
 ("tripod-headstand","Tripod Headstand","balance",2,"hold",["floor"],["frog-stand"],(15,30,45,60),["omuz","boyun","core"],"balance_arm",0),
 ("headstand","Headstand","balance",3,"hold",["floor","wall"],["tripod-headstand"],(20,40,60,90),["omuz","core"],"balance_arm",0),
 ("wall-handstand","Wall Handstand","balance",3,"hold",["wall"],["wall-walk","wrist-mobility","headstand"],(20,40,60,90),["omuz","core"],"handstand",0),
 ("shoulder-tap","Handstand Shoulder Tap","balance",4,"reps",["wall"],["wall-handstand"],(5,10,15,20),["omuz","core"],"handstand",0),
 ("freestanding-handstand","Freestanding Handstand","balance",5,"hold",["floor"],["wall-handstand","shoulder-tap"],(5,15,30,60),["omuz","core","bilek"],"handstand",1),
 ("handstand-walk","Handstand Walk","balance",6,"dist",["floor"],["freestanding-handstand"],(3,5,10,20),["omuz","core"],"handstand",0),
 ("press-to-handstand","Press to Handstand","balance",7,"reps",["floor"],["freestanding-handstand","compression-lift","pancake-stretch"],(1,3,5,8),["omuz","core","kalça fleksör"],"handstand",0),
 ("one-arm-handstand","One Arm Handstand","balance",9,"hold",["floor","wall"],["handstand-walk","press-to-handstand"],(2,5,10,15),["omuz","core","bilek"],"handstand",1),
 ("clutch-flag","Clutch Flag","balance",6,"hold",["pullup-bar"],["side-plank","tuck-back-lever"],(5,10,15,25),["oblik","omuz","core"],"balance_arm",0),
 ("human-flag-progression","Human Flag Progression","balance",7,"hold",["pullup-bar"],["clutch-flag","straddle-back-lever"],(3,8,12,20),["oblik","omuz","sırt"],"balance_arm",0),
 ("human-flag","Human Flag","balance",8,"hold",["pullup-bar"],["human-flag-progression"],(3,8,12,20),["oblik","omuz","sırt","core"],"balance_arm",1),
]

# ----------------------------------------------------------------- MOBILITY
M += [
 ("wrist-mobility","Wrist Mobility Routine","mobility",0,"hold",["floor"],[],(30,60,90,120),["bilek","önkol"],"mobility",0),
 ("finger-mobility","Finger Mobility Routine","mobility",0,"hold",["floor"],[],(30,60,90,120),["parmak","önkol"],"mobility",0),
 ("shoulder-mobility","Shoulder Mobility Routine","mobility",0,"reps",["floor","band"],[],(10,15,20,30),["omuz","kürek"],"mobility",0),
 ("thoracic-mobility","Thoracic Mobility Routine","mobility",0,"reps",["floor"],[],(10,15,20,30),["thoracic","sırt"],"mobility",0),
 ("hip-mobility","Hip Mobility Routine","mobility",0,"reps",["floor"],[],(10,15,20,30),["kalça"],"mobility",0),
 ("ankle-mobility","Ankle Mobility Routine","mobility",0,"reps",["floor"],[],(10,15,20,30),["ayak bileği"],"mobility",0),
 ("hamstring-mobility","Hamstring Mobility Routine","mobility",0,"hold",["floor"],[],(30,60,90,120),["hamstring"],"mobility",0),
 ("pike-stretch","Pike Stretch","mobility",1,"hold",["floor"],["hamstring-mobility"],(20,40,60,90),["hamstring","bel"],"mobility",0),
 ("pancake-stretch","Pancake Stretch","mobility",3,"hold",["floor"],["pike-stretch","hip-mobility"],(20,40,60,90),["adduktör","hamstring"],"mobility",0),
 ("bridge","Bridge","mobility",2,"hold",["floor"],["thoracic-mobility","shoulder-mobility"],(15,30,45,60),["omuz","thoracic","kalça"],"mobility",0),
 ("bridge-pushup","Bridge Push-up","mobility",4,"reps",["floor"],["bridge"],(3,6,10,15),["omuz","thoracic","triceps"],"mobility",0),
]

# ------------------------------------------------------------- CONDITIONING
M += [
 ("jump-rope-basic","Jump Rope - Basic Bounce","conditioning",0,"count",["jump-rope"],[],(50,100,200,300),["baldır","kondisyon"],"jump_rope",0),
 ("jump-rope-alternate","Jump Rope - Alternate Foot","conditioning",1,"count",["jump-rope"],["jump-rope-basic"],(50,100,200,300),["baldır","koordinasyon"],"jump_rope",0),
 ("jump-rope-high-knees","Jump Rope - High Knees","conditioning",2,"count",["jump-rope"],["jump-rope-alternate"],(30,60,100,150),["kalça fleksör","kondisyon"],"jump_rope",0),
 ("crossover","Jump Rope - Crossover","conditioning",3,"count",["jump-rope"],["jump-rope-basic"],(5,15,30,50),["koordinasyon"],"jump_rope",0),
 ("double-under","Double Under","conditioning",4,"count",["jump-rope"],["jump-rope-basic"],(5,15,30,50),["baldır","patlayıcılık"],"jump_rope",0),
 ("triple-under","Triple Under","conditioning",7,"count",["jump-rope"],["double-under"],(1,3,5,10),["patlayıcılık","koordinasyon"],"jump_rope",0),
 ("mountain-climber","Mountain Climber","conditioning",1,"reps",["floor"],["plank"],(20,30,50,80),["core","kondisyon"],"core_hold",0),
 ("burpee","Burpee","conditioning",2,"reps",["floor"],["pushup","jump-squat"],(10,20,30,50),["tüm vücut","kondisyon"],"jump_rope",0),
 ("shuttle-run","Shuttle Run","conditioning",1,"dist",["floor"],[],(100,200,400,800),["bacak","kondisyon"],"run",0),
 ("running","Running","conditioning",1,"dist",["floor"],[],(1000,3000,5000,10000),["kondisyon","bacak"],"run",0),
 ("sprint-interval","Sprint Interval","conditioning",3,"count",["floor"],["running"],(4,6,8,12),["patlayıcılık","kondisyon"],"run",0),
]

# -------------------------------------------------------------------- ELITE
M += [
 ("iron-cross","Iron Cross","elite",9,"hold",["rings"],["ring-muscle-up","rto-dip"],(2,5,8,12),["göğüs","sırt","biceps"],"rings_elite",1),
 ("hefesto","Hefesto","elite",9,"reps",["pullup-bar","rings"],["pelican-curl","back-lever"],(1,1,2,3),["biceps","sırt","tendon"],"rings_elite",1),
 ("maltese","Maltese","elite",9,"hold",["rings","floor"],["full-planche"],(1,3,5,8),["göğüs","ön omuz"],"rings_elite",1),
 ("victorian","Victorian Cross","elite",9,"hold",["rings"],["back-lever","front-lever","iron-cross"],(1,2,3,5),["sırt","göğüs","core"],"rings_elite",1),
]

# ----------------------------------------------------------------- RECOVERY
M += [
 ("sleep-hygiene","Sleep Protocol (7-9h)","recovery",0,"count",[],[],(3,5,7,7),["merkezi sinir sistemi"],"recovery",0),
 ("deload-week","Deload Week","recovery",0,"count",[],[],(1,2,4,6),["eklem","tendon"],"recovery",0),
 ("stretch-routine","Daily Stretch Routine","recovery",0,"count",[],[],(3,5,7,7),["tüm vücut"],"recovery",0),
 ("soft-tissue","Soft Tissue Work","recovery",0,"count",[],[],(2,3,5,7),["kas","fasya"],"recovery",0),
]

# Bilinçli olarak yaprak (leaf) node'lar: varyasyon / kondisyon / aksesuar amaçlı.
# Hiçbir şeyin kilidini açmamaları bir veri eksikliği DEĞİLDİR.
ACCESSORY = {
 "deep-pushup","dive-bomber","v-pushup","mike-tyson-pushup","russian-pushup",
 "finger-pushup","neutral-pullup","mixed-grip-pullup","commando-pullup","close-pullup",
 "weighted-pullup","weighted-dip","l-sit-pullup","plyo-dip","archer-dip",
 "copenhagen-plank","reverse-plank","boat-hold","v-up","windshield-wipers",
 "sl-calf-raise","walking-lunge","box-jump","tuck-jump","broad-jump",
 "sissy-squat","jump-rope-high-knees","crossover","triple-under","mountain-climber",
 "burpee","shuttle-run","sprint-interval","bridge-pushup","crane",
 "elbow-lever","tiger-bend","front-lever-row","planche-pushup","impossible-dip",
 "fingertip-hang","one-arm-hang","ice-cream-maker","dragon-squat","nordic-curl",
 "behind-back-clap","aztec-pushup","tuck-planche-pushup","dragon-flag",
}

CATEGORIES = {
 "push":          {"label":"Push",           "color":"#ef4444"},
 "vertical_push": {"label":"Vertical Push",  "color":"#f97316"},
 "explosive":     {"label":"Explosive",      "color":"#eab308"},
 "dips":          {"label":"Dips",           "color":"#f59e0b"},
 "pull":          {"label":"Pull",           "color":"#3b82f6"},
 "core":          {"label":"Core",           "color":"#8b5cf6"},
 "legs":          {"label":"Legs",           "color":"#22c55e"},
 "balance":       {"label":"Balance",        "color":"#06b6d4"},
 "mobility":      {"label":"Mobility",       "color":"#14b8a6"},
 "conditioning":  {"label":"Conditioning",   "color":"#84cc16"},
 "elite":         {"label":"Elite",          "color":"#ec4899"},
 "recovery":      {"label":"Recovery",       "color":"#64748b"},
}

EQUIPMENT = {
 "floor":"Zemin", "wall":"Duvar", "box":"Yükseklik / Sehpa", "bench":"Bench",
 "pullup-bar":"Barfiks", "dip-station":"Dip Station", "parallettes":"Parallettes",
 "rings":"Halka", "band":"Direnç Bandı", "vest":"Ağırlık Yeleği", "jump-rope":"İp",
}
