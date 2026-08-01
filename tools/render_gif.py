import re, math, os, subprocess, shutil

src = open('/sessions/hopeful-fervent-dijkstra/mnt/ASCEND/src/ui/figure/poses.ts', encoding='utf-8').read()
blocks = re.findall(r'const (\w+): PoseSet = \{(.*?)\n\};', src, re.S)
poses = {}
for name, body in blocks:
    pr = re.search(r"props: \[(.*?)\]", body)
    pr = [p.strip().strip("'") for p in pr.group(1).split(',')] if pr else []
    dur = float(re.search(r"dur: ([\d.]+)", body).group(1))
    fr = {}
    for f in ('a','b','m'):
        mm = re.search(rf"\n  {f}: \{{(.*?)\}},", body, re.S)
        if not mm: continue
        d = {}
        for k, x, y in re.findall(r"(\w+): \[(-?[\d.]+), (-?[\d.]+)\]", mm.group(1)):
            d[k] = (float(x), float(y))
        fr[f] = d
    poses[name] = (pr, fr, dur)

def props_svg(props):
    o=[]
    if 'ground' in props: o.append('<line x1="2" y1="91" x2="98" y2="91" stroke="#5b6376" stroke-width="2"/>')
    if 'bar' in props: o.append('<line x1="14" y1="9" x2="86" y2="9" stroke="#5b6376" stroke-width="3"/>')
    if 'lowbar' in props: o.append('<line x1="14" y1="51" x2="72" y2="51" stroke="#5b6376" stroke-width="3"/>')
    if 'parallettes' in props:
        o.append('<line x1="22" y1="51" x2="58" y2="51" stroke="#5b6376" stroke-width="3"/>')
        o.append('<line x1="26" y1="51" x2="26" y2="80" stroke="#5b6376" stroke-width="2"/>')
    if 'wall' in props: o.append('<line x1="68" y1="2" x2="68" y2="62" stroke="#5b6376" stroke-width="2" stroke-dasharray="3 4"/>')
    return ''.join(o)

def body_svg(p, props, col="#f5c542"):
    o=[props_svg(props)]
    asym = ('elbow2' in p) or ('knee2' in p)
    dx,dy = (0,0) if asym else (5,2)
    def O(q): return (q[0]+dx, q[1]+dy)
    fe = p.get('elbow2', p['elbow']); fh = p.get('hand2', p['hand'])
    fk = p.get('knee2', p['knee']);   ff = p.get('foot2', p['foot'])
    def L(p1,p2,w,op=1.0):
        return f'<line x1="{p1[0]:.2f}" y1="{p1[1]:.2f}" x2="{p2[0]:.2f}" y2="{p2[1]:.2f}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" opacity="{op}"/>'
    o += [L(O(p['neck']),O(fe),5,.42), L(O(fe),O(fh),4.5,.42),
          L(O(p['hip']),O(fk),6,.42), L(O(fk),O(ff),5,.42),
          L(p['neck'],p['hip'],8.5),
          f'<circle cx="{p["head"][0]:.2f}" cy="{p["head"][1]:.2f}" r="7.5" fill="{col}"/>',
          L(p['neck'],p['elbow'],5.5), L(p['elbow'],p['hand'],5),
          L(p['hip'],p['knee'],6.5), L(p['knee'],p['foot'],5.5)]
    return ''.join(o)

def lerp(p1,p2,t):
    return {k:(p1[k][0]+(p2[k][0]-p1[k][0])*t, p1[k][1]+(p2[k][1]-p1[k][1])*t) for k in p1 if k in p2}

def ease(t):  # keySplines .35 0 .25 1 yaklasimi
    return t*t*(3-2*t)

def frames_of(name, n=26):
    props, fr, dur = poses[name]
    key = [fr['a']] + ([fr['m']] if 'm' in fr else []) + [fr['b']]
    key = key + key[-2::-1]          # a m b m a
    segs = len(key)-1
    out=[]
    for i in range(n):
        t = i/n*segs
        s = min(segs-1, int(t)); local = ease(t-s)
        out.append(lerp(key[s], key[s+1], local))
    return out, props, dur

SHOW = [('PUSHUP','Şınav'), ('PULLUP','Barfiks'), ('HSPU','Handstand Push-up'),
        ('DIP','Dips'), ('SQUAT','Squat'), ('MUSCLEUP','Muscle-up')]

os.makedirs('/tmp/gifw', exist_ok=True)
COLS, CELL = 3, 150
rows = math.ceil(len(SHOW)/COLS)
W, H = COLS*CELL, rows*(CELL+20)
N = 26
for i in range(N):
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="#0b0d12"/>']
    for k,(nm,label) in enumerate(SHOW):
        fs, props, dur = frames_of(nm, N)
        # her hareket kendi hizinda donsun
        idx = int(i * (2.6/dur)) % N
        cx=(k%COLS)*CELL; cy=(k//COLS)*(CELL+20)
        parts.append(f'<text x="{cx+14}" y="{cy+18}" fill="#8b93a5" font-size="13" font-family="sans-serif">{label}</text>')
        parts.append(f'<g transform="translate({cx+14},{cy+24}) scale(1.2)">{body_svg(fs[idx],props)}</g>')
    parts.append('</svg>')
    open(f'/tmp/gifw/f{i:03d}.svg','w').write(''.join(parts))

subprocess.run('cd /tmp/gifw && for f in f*.svg; do convert -density 96 "$f" "${f%.svg}.png"; done', shell=True, check=True)
subprocess.run('cd /tmp/gifw && convert -delay 6 -loop 0 f*.png -layers Optimize /tmp/hareketler.gif', shell=True, check=True)
print("gif hazir")
