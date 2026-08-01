import re, json, math

src = open('/sessions/hopeful-fervent-dijkstra/mnt/ASCEND/src/ui/figure/poses.ts', encoding='utf-8').read()

# Poz bloklarini ayikla
blocks = re.findall(r'const (\w+): PoseSet = \{(.*?)\n\};', src, re.S)
poses = {}
for name, body in blocks:
    props = re.search(r"props: \[(.*?)\]", body)
    props = [p.strip().strip("'") for p in props.group(1).split(',')] if props else []
    frames = {}
    for f in ('a','b'):
        m = re.search(rf"\n  {f}: \{{(.*?)\}},", body, re.S)
        if not m: continue
        d = {}
        for k, x, y in re.findall(r"(\w+): \[(-?[\d.]+), (-?[\d.]+)\]", m.group(1)):
            d[k] = (float(x), float(y))
        frames[f] = d
    poses[name] = (props, frames)

def limb(p, key2, key1):
    return p.get(key2, p[key1])

def draw(p, props, col="#e6e8ee"):
    o = []
    # props
    if 'ground' in props: o.append('<line x1="2" y1="91" x2="98" y2="91" stroke="#5b6376" stroke-width="2"/>')
    if 'bar' in props: o.append('<line x1="14" y1="9" x2="86" y2="9" stroke="#5b6376" stroke-width="3"/>')
    if 'lowbar' in props: o.append('<line x1="14" y1="51" x2="72" y2="51" stroke="#5b6376" stroke-width="3"/>')
    if 'parallettes' in props:
        o.append('<line x1="26" y1="51" x2="52" y2="51" stroke="#5b6376" stroke-width="3"/>')
        o.append('<line x1="30" y1="51" x2="30" y2="78" stroke="#5b6376" stroke-width="2"/>')
    if 'wall' in props: o.append('<line x1="68" y1="2" x2="68" y2="62" stroke="#5b6376" stroke-width="2" stroke-dasharray="3 4"/>')
    if 'rope' in props: o.append('<path d="M36 54 Q 50 106 64 54" stroke="#5b6376" fill="none" stroke-width="1.8"/>')

    asym = ('elbow2' in p) or ('knee2' in p)
    dx, dy = (0,0) if asym else (5,2)
    def O(pt): return (pt[0]+dx, pt[1]+dy)
    fe = limb(p,'elbow2','elbow'); fh = limb(p,'hand2','hand')
    fk = limb(p,'knee2','knee');   ff = limb(p,'foot2','foot')
    def L(p1,p2,w,op=1.0):
        return f'<line x1="{p1[0]}" y1="{p1[1]}" x2="{p2[0]}" y2="{p2[1]}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" opacity="{op}"/>'
    o.append(L(O(p['neck']), O(fe), 5, .42))
    o.append(L(O(fe), O(fh), 4.5, .42))
    o.append(L(O(p['hip']), O(fk), 6, .42))
    o.append(L(O(fk), O(ff), 5, .42))
    o.append(L(p['neck'], p['hip'], 8.5))
    o.append(f'<circle cx="{p["head"][0]}" cy="{p["head"][1]}" r="7.5" fill="{col}"/>')
    o.append(L(p['neck'], p['elbow'], 5.5))
    o.append(L(p['elbow'], p['hand'], 5))
    o.append(L(p['hip'], p['knee'], 6.5))
    o.append(L(p['knee'], p['foot'], 5.5))
    return ''.join(o)

names = [n for n in poses if poses[n][1]]
COLS = 6
CELL = 120
rows = math.ceil(len(names)*2 / COLS)
W, H = COLS*CELL, rows*(CELL+18)
out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="#0b0d12"/>']
i = 0
for n in names:
    props, fr = poses[n]
    for f in ('a','b'):
        if f not in fr: continue
        cx = (i % COLS)*CELL; cy = (i//COLS)*(CELL+18)
        out.append(f'<g transform="translate({cx+10},{cy+16}) scale(1.0)">{draw(fr[f], props)}</g>')
        out.append(f'<text x="{cx+10}" y="{cy+12}" fill="#8b93a5" font-size="11" font-family="sans-serif">{n}.{f}</text>')
        out.append(f'<rect x="{cx+8}" y="{cy+14}" width="102" height="102" fill="none" stroke="#20252f"/>')
        i += 1
out.append('</svg>')
open('/tmp/poses.svg','w').write(''.join(out))
print("poz sayisi:", len(names), "kare:", i)
