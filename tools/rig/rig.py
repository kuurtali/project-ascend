# -*- coding: utf-8 -*-
"""
İSKELET — kemik boyları SABİT, pozlar AÇI ile tanımlanır.

Onceki surumun hatasi: poz = eklem KONUMLARI idi. Iki kare arasi
interpolasyonda on kol uzayip kisaliyordu; goz bunu lastik/sarhos
olarak okuyor. Cozum ileri kinematik: kok + acilar. Kemik boyu
degisemez, ve aci interpolasyonu uzvu DOGAL YAY uzerinde tasir.

Aci: derece, 0=sag, 90=asagi, 180=sol, 270=yukari.
Kok = gogus (kollar oradan cikar).
"""
import math, json

HEAD, UARM, FARM, SPINE, THIGH, SHIN = 12.0, 14.0, 14.0, 26.0, 17.0, 17.0
HEAD_R = 6.4

def pt(o, ang, ln):
    r = math.radians(ang)
    return (o[0] + ln*math.cos(r), o[1] + ln*math.sin(r))

def ik2(root, target, u, f, flip=1):
    """Iki uzuvlu IK: kok ve hedeften iki aci uret. flip: dirsegin yonu."""
    dx, dy = target[0]-root[0], target[1]-root[1]
    d = math.hypot(dx, dy)
    d = max(abs(u-f)+1e-6, min(u+f-1e-6, d))
    base = math.degrees(math.atan2(dy, dx))
    cosA = (d*d + u*u - f*f) / (2*d*u)
    A = math.degrees(math.acos(max(-1, min(1, cosA))))
    au = base + flip*A
    elbow = pt(root, au, u)
    al = math.degrees(math.atan2(target[1]-elbow[1], target[0]-elbow[0]))
    return round(au % 360, 1), round(al % 360, 1)

def solve(chest, spine, legU, legL, head, arm=None, pin=None, flip=1,
          arm2=None, pin2=None, flip2=1, leg2=None,
          footPin=None, footFlip=1, footPin2=None, footFlip2=1):
    """Poz sozlugu uret. arm=(au,al) ya da pin=(hedef el konumu).
    footPin verilirse bacak acilari ayagi o noktaya cakacak sekilde
    cozulur — comelmede ayak yerden kalkiyordu."""
    p = {'x': round(chest[0],1), 'y': round(chest[1],1),
         'head': head, 'spine': spine, 'legU': legU, 'legL': legL}
    if footPin is not None:
        pelvis = pt(chest, spine, SPINE)
        p['legU'], p['legL'] = ik2(pelvis, footPin, THIGH, SHIN, footFlip)
    if footPin2 is not None:
        pelvis = pt(chest, spine, SPINE)
        p['legU2'], p['legL2'] = ik2(pelvis, footPin2, THIGH, SHIN, footFlip2)
    if pin is not None:
        p['armU'], p['armL'] = ik2(chest, pin, UARM, FARM, flip)
    else:
        p['armU'], p['armL'] = arm
    if pin2 is not None:
        p['armU2'], p['armL2'] = ik2(chest, pin2, UARM, FARM, flip2)
    elif arm2 is not None:
        p['armU2'], p['armL2'] = arm2
    if leg2 is not None:
        p['legU2'], p['legL2'] = leg2
    return p

def joints(p):
    chest = (p['x'], p['y'])
    head  = pt(chest, p['head'], HEAD)
    elbow = pt(chest, p['armU'], UARM); hand = pt(elbow, p['armL'], FARM)
    pelvis= pt(chest, p['spine'], SPINE)
    knee  = pt(pelvis, p['legU'], THIGH); foot = pt(knee, p['legL'], SHIN)
    e2 = pt(chest, p.get('armU2', p['armU']), UARM)
    h2 = pt(e2,    p.get('armL2', p['armL']), FARM)
    k2 = pt(pelvis, p.get('legU2', p['legU']), THIGH)
    f2 = pt(k2,     p.get('legL2', p['legL']), SHIN)
    return dict(chest=chest, head=head, elbow=elbow, hand=hand, pelvis=pelvis,
                knee=knee, foot=foot, elbow2=e2, hand2=h2, knee2=k2, foot2=f2)
