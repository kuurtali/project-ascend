# -*- coding: utf-8 -*-
from rig import solve, ik2, UARM, FARM

G = 90.0     # zemin
BAR = 9.0    # barfiks
PB  = 52.0   # paralel bar

P = {}

# ── ITME ────────────────────────────────────────────────────────────
# Govde duz bir hat: gogus -> pelvis -> diz -> ayak, hepsi ayni acida.
P['PUSHUP'] = dict(props=['ground'], dur=2.6, frames=[
    solve((32,76), 14, 14, 14, 194, pin=(20,G), flip=-1),   # alt
    solve((32,69), 21, 21, 21, 197, pin=(20,G), flip=-1),   # ara
    solve((30,60), 29, 29, 29, 200, pin=(20,G), flip=-1),   # ust
])
P['EXPLOSIVE'] = dict(props=['ground'], dur=1.5, frames=[
    solve((32,76), 14, 14, 14, 194, pin=(20,G), flip=-1),
    solve((28,50), 27, 27, 27, 200, arm=(112,108)),         # eller havada
])
P['PIKE'] = dict(props=['ground'], dur=2.8, frames=[
    solve((36,68), 316, 44, 44, 158, pin=(26,G), flip=-1),
    solve((36,60), 316, 44, 44, 158, pin=(26,G), flip=-1),
    solve((36,52), 316, 44, 44, 158, pin=(26,G), flip=-1),
])
P['HSPU'] = dict(props=['ground','wall'], dur=3.0, frames=[
    solve((50,76), 270, 270, 270, 40, pin=(52,G), flip=1),
    solve((50,69), 270, 270, 270, 50, pin=(52,G), flip=1),
    solve((50,62), 270, 270, 270, 60, pin=(52,G), flip=1),
])
P['HANDSTAND'] = dict(props=['ground'], dur=4.0, hold=True, frames=[
    solve((50,62), 270, 270, 270, 60, pin=(52,G), flip=1),
    solve((50,63), 270, 272, 268, 60, pin=(52,G), flip=1),
])
P['PLANCHE'] = dict(props=['ground'], dur=4.0, hold=True, frames=[
    solve((36,56), 8, 4, 0, 186, pin=(40,G), flip=1),
    solve((36,58), 8, 4, 0, 186, pin=(40,G), flip=1),
])

# ── DIPS ────────────────────────────────────────────────────────────
P['DIP'] = dict(props=['parallettes'], dur=2.8, frames=[
    solve((44,44), 96, 74, 32, 296, pin=(38,PB), flip=1),
    solve((44,35), 94, 74, 32, 298, pin=(38,PB), flip=1),
    solve((44,25), 92, 74, 32, 300, pin=(38,PB), flip=1),
])
P['LSIT'] = dict(props=['parallettes'], dur=4.0, hold=True, frames=[
    solve((44,26), 94, 6, 0, 280, pin=(38,PB), flip=1),
    solve((44,28), 94, 6, 0, 280, pin=(38,PB), flip=1),
])

# ── CEKIS ───────────────────────────────────────────────────────────
P['PULLUP'] = dict(props=['bar'], dur=3.0, frames=[
    solve((52,38), 92, 76, 34, 268, pin=(44,BAR), flip=-1),
    solve((52,31), 92, 76, 34, 268, pin=(44,BAR), flip=-1),
    solve((52,23), 92, 76, 34, 266, pin=(44,BAR), flip=-1),
])
P['HANG'] = dict(props=['bar'], dur=4.0, hold=True, frames=[
    solve((52,38), 92, 88, 88, 268, pin=(44,BAR), flip=-1),
    solve((52,40), 92, 88, 88, 268, pin=(44,BAR), flip=-1),
])
P['LEG_RAISE'] = dict(props=['bar'], dur=3.0, frames=[
    solve((52,38), 92, 88, 88, 268, pin=(44,BAR), flip=-1),
    solve((52,38), 92, 44, 22, 268, pin=(44,BAR), flip=-1),
    solve((52,38), 92,  6,  0, 268, pin=(44,BAR), flip=-1),
])
P['FRONT_LEVER'] = dict(props=['bar'], dur=4.0, hold=True, frames=[
    solve((30,44), 4, 2, 0, 184, pin=(30,BAR), flip=-1),
    solve((30,46), 4, 2, 0, 184, pin=(30,BAR), flip=-1),
])
P['BACK_LEVER'] = dict(props=['bar'], dur=4.0, hold=True, frames=[
    solve((30,46), 356, 358, 0, 172, pin=(30,BAR), flip=1),
    solve((30,48), 356, 358, 0, 172, pin=(30,BAR), flip=1),
])
P['MUSCLEUP'] = dict(props=['bar'], dur=2.2, frames=[
    solve((52,38), 92, 76, 34, 268, pin=(44,BAR), flip=-1),
    solve((52,27), 96, 72, 30, 268, pin=(44,BAR), flip=-1),
    solve((50,16), 100, 68, 26, 272, pin=(44,BAR), flip=1),   # bar ustu
])
P['ROW'] = dict(props=['lowbar'], dur=2.8, frames=[
    solve((40,64), 16, 12, 10, 192, pin=(34,PB-1), flip=-1),
    solve((40,57), 16, 12, 10, 192, pin=(34,PB-1), flip=-1),
])

# ── BACAK ───────────────────────────────────────────────────────────
P['SQUAT'] = dict(props=['ground'], dur=2.8, frames=[
    solve((46,50), 74, 0,0, 258, arm=(6,352), footPin=(48,G), footFlip=-1),
    solve((48,41), 84, 0,0, 264, arm=(30,10),  footPin=(49,G), footFlip=-1),
    solve((50,30), 90, 0,0, 270, arm=(100,95), footPin=(50,G), footFlip=-1),
])
P['PISTOL'] = dict(props=['ground'], dur=3.2, frames=[
    solve((46,50), 74, 0,0, 258, arm=(4,350), footPin=(48,G), footFlip=-1,
          leg2=(332,346)),
    solve((48,32), 88, 0,0, 268, arm=(12,356), footPin=(48,G), footFlip=-1,
          leg2=(356,348)),
])
P['RUN'] = dict(props=['ground'], dur=0.8, frames=[
    solve((48,32), 88, 62, 105, 268, arm=(150,215), leg2=(118,60)),
    solve((50,32), 92, 118, 62, 272, arm=(30,335),  leg2=(62,105)),
])
P['JUMPROPE'] = dict(props=['ground','rope'], dur=0.9, frames=[
    solve((50,32), 90, 0,0, 270, arm=(140,20), footPin=(50,G), footFlip=-1),
    solve((50,26), 90, 96, 78, 270, arm=(140,20)),
])

# ── GOVDE / DIGER ───────────────────────────────────────────────────
P['PLANK'] = dict(props=['ground'], dur=4.0, hold=True, frames=[
    solve((32,64), 16, 16, 16, 194, pin=(24,G-1), flip=-1),
    solve((32,66), 16, 16, 16, 194, pin=(24,G-1), flip=-1),
])
P['HOLLOW'] = dict(props=['ground'], dur=4.0, hold=True, frames=[
    solve((40,68), 20, 340, 330, 200, arm=(196,192)),
    solve((40,70), 22, 342, 332, 200, arm=(198,194)),
])
P['BEAR'] = dict(props=['ground'], dur=2.4, frames=[
    solve((34,58), 16, 62, 116, 190, pin=(22,G), flip=-1, leg2=(96,54)),
    solve((36,58), 16, 96, 54, 190, pin=(38,G), flip=-1, leg2=(62,116)),
])
P['MOBILITY'] = dict(props=['ground'], dur=3.4, frames=[
    solve((50,30), 90, 90, 90, 270, arm=(255,250)),
    solve((50,30), 90, 90, 90, 270, arm=(300,20)),
    solve((50,30), 90, 90, 90, 270, arm=(80,110)),
])
P['REST'] = dict(props=['ground'], dur=5.0, hold=True, frames=[
    solve((36,82), 4, 2, 0, 186, arm=(10,350)),
    solve((36,83), 4, 2, 0, 186, arm=(12,352)),
])
P['STAND'] = dict(props=['ground'], dur=4.0, hold=True, frames=[
    solve((50,30), 90, 90, 90, 270, arm=(100,95)),
    solve((50,31), 90, 90, 90, 270, arm=(101,96)),
])
