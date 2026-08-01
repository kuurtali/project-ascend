# -*- coding: utf-8 -*-
import sys, math, os, subprocess
sys.path.insert(0,'/tmp/rig')
from rig import joints, HEAD_R
from poses import P

def props_svg(props):
    o=[]
    if 'ground' in props: o.append('<line x1="2" y1="91" x2="98" y2="91" stroke="#5b6376" stroke-width="2"/>')
    if 'bar' in props: o.append('<line x1="12" y1="8" x2="88" y2="8" stroke="#5b6376" stroke-width="3"/>')
    if 'lowbar' in props: o.append('<line x1="12" y1="51" x2="74" y2="51" stroke="#5b6376" stroke-width="3"/>')
    if 'parallettes' in props:
        o.append('<line x1="20" y1="52" x2="60" y2="52" stroke="#5b6376" stroke-width="3"/>')
        o.append('<line x1="24" y1="52" x2="24" y2="82" stroke="#5b6376" stroke-width="2"/>')
    if 'wall' in props: o.append('<line x1="66" y1="2" x2="66" y2="62" stroke="#5b6376" stroke-width="2" stroke-dasharray="3 4"/>')
    return ''.join(o)

BG = "#0b0d12"
OUT = 3.0          # kontur kalinligi (her iki yana 1.5)

def body(p, props, col="#e6e8ee"):
    """Her uzuv iki kez cizilir: once arka plan renginde genis kontur,
    sonra dolgu. Kol govdenin onunden gectiginde kayboluyordu; kontur
    onu ayiriyor. Cizim sirasi = derinlik sirasi."""
    j = joints(p)
    def L(a,b,w,op=1.0):
        d=(f'x1="{a[0]:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]:.2f}" '
           f'stroke-linecap="round"')
        return (f'<line {d} stroke="{BG}" stroke-width="{w+OUT}" opacity="{op}"/>'
                f'<line {d} stroke="{col}" stroke-width="{w}" opacity="{op}"/>')
    o=[props_svg(props)]
    o += [L(j['chest'],j['elbow2'],4.6,.42), L(j['elbow2'],j['hand2'],4.0,.42),
          L(j['pelvis'],j['knee2'],5.4,.42), L(j['knee2'],j['foot2'],4.8,.42),
          L(j['chest'],j['pelvis'],8.0),
          f'<circle cx="{j["head"][0]:.2f}" cy="{j["head"][1]:.2f}" r="{HEAD_R+1.5}" fill="{BG}"/>'
          f'<circle cx="{j["head"][0]:.2f}" cy="{j["head"][1]:.2f}" r="{HEAD_R}" fill="{col}"/>',
          L(j['pelvis'],j['knee'],6.0), L(j['knee'],j['foot'],5.2),
          L(j['chest'],j['elbow'],5.2), L(j['elbow'],j['hand'],4.6)]
    return ''.join(o)

KEYS = ['x','y','head','spine','legU','legL','armU','armL','armU2','armL2','legU2','legL2']
def lerp_ang(a,b,t):
    d = (b-a+180)%360-180
    return a + d*t
def blend(p1,p2,t):
    out={}
    for k in set(p1)|set(p2):
        v1 = p1.get(k, p2.get(k)); v2 = p2.get(k, p1.get(k))
        out[k] = (v1+(v2-v1)*t) if k in ('x','y') else lerp_ang(v1,v2,t)
    return out
def ease(t): return t*t*(3-2*t)

def cycle(name, n):
    d = P[name]; f = d['frames']
    keys = f + f[-2::-1]
    segs = len(keys)-1
    out=[]
    for i in range(n):
        t = i/n*segs; s = min(segs-1,int(t))
        out.append(blend(keys[s], keys[s+1], ease(t-s)))
    return out, d['props']

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv)>1 else 'sheet'
    if mode == 'sheet':
        names = list(P)
        COLS, CELL, N = 6, 118, 8
        rows = math.ceil(len(names)/COLS)
        W,H = COLS*CELL, rows*(CELL+18)
        out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="#0b0d12"/>']
        for k,nm in enumerate(names):
            fs,props = cycle(nm, N)
            cx=(k%COLS)*CELL; cy=(k//COLS)*(CELL+18)
            out.append(f'<text x="{cx+8}" y="{cy+13}" fill="#8b93a5" font-size="10" font-family="sans-serif">{nm}</text>')
            out.append(f'<g transform="translate({cx+6},{cy+16})">{body(fs[0],props)}</g>')
            out.append(f'<rect x="{cx+4}" y="{cy+15}" width="104" height="104" fill="none" stroke="#20252f"/>')
        out.append('</svg>')
        open('/tmp/rig/sheet.svg','w').write(''.join(out))
    elif mode == 'strip':
        names = sys.argv[2].split(',')
        N=24; PICK=[0,3,6,9,12,15,18,21]; CELL=112
        W,H = len(PICK)*CELL, len(names)*(CELL+18)
        out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="#0b0d12"/>']
        for r,nm in enumerate(names):
            fs,props = cycle(nm,N)
            out.append(f'<text x="6" y="{r*(CELL+18)+12}" fill="#8b93a5" font-size="10" font-family="sans-serif">{nm}</text>')
            for c,i in enumerate(PICK):
                out.append(f'<g transform="translate({c*CELL+5},{r*(CELL+18)+16})">{body(fs[i],props)}</g>')
                out.append(f'<rect x="{c*CELL+3}" y="{r*(CELL+18)+15}" width="104" height="104" fill="none" stroke="#20252f"/>')
        out.append('</svg>')
        open('/tmp/rig/strip.svg','w').write(''.join(out))
