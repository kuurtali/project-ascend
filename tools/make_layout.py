#!/usr/bin/env python3
"""movements.json -> ascend_data.js  (kompakt + onceden hesaplanmis yerlesim)

Yerlesim modeli: soldan saga = agac derinligi (depth).
Yukaridan asagiya = kategori bantlari. Ayni (kategori, derinlik) hucresinde
birden fazla node varsa bant icinde dikey olarak yigilir.
"""
import json, math
from collections import defaultdict

db = json.load(open("movements.json", encoding="utf-8"))
moves = db["movements"]
by_id = {m["id"]: m for m in moves}

COL_W, ROW_H, PAD_TOP, BAND_GAP = 210, 44, 26, 34

# kategori sirasi: temel -> ileri
CAT_ORDER = ["push", "vertical_push", "explosive", "dips", "pull", "core",
             "legs", "balance", "mobility", "conditioning", "elite", "recovery"]
assert set(CAT_ORDER) == set(db["categories"]), set(CAT_ORDER) ^ set(db["categories"])

cells = defaultdict(list)          # (cat, depth) -> [ids]
for m in moves:
    cells[(m["category"], m["depth"])].append(m["id"])

# her hucrede tier'a gore sirala (okunabilirlik)
for k in cells:
    cells[k].sort(key=lambda i: (by_id[i]["tier"], by_id[i]["name"]))

bands, y = {}, PAD_TOP
for cat in CAT_ORDER:
    depths = [d for (c, d) in cells if c == cat]
    rows = max((len(cells[(cat, d)]) for d in depths), default=1)
    h = rows * ROW_H
    bands[cat] = {"y": y, "h": h, "rows": rows}
    y += h + BAND_GAP
CANVAS_H = y + 20
CANVAS_W = (max(m["depth"] for m in moves) + 1) * COL_W + 200

pos = {}
for (cat, depth), ids in cells.items():
    band = bands[cat]
    n = len(ids)
    # hucreyi bant icinde dikey ortala
    off = band["y"] + (band["h"] - n * ROW_H) / 2
    for i, mid in enumerate(ids):
        pos[mid] = {"x": 110 + depth * COL_W, "y": off + i * ROW_H + ROW_H / 2}

# ---------------------------------------------------------------- kompaktla
# tips/commonMistakes 196 kez tekrarlaniyor -> aileye tasi
families = {}
for m in moves:
    families.setdefault(m["family"], {"tips": m["tips"], "mistakes": m["commonMistakes"]})

MT = db["masteryTiers"]
compact = []
for m in moves:
    compact.append({
        "id": m["id"], "n": m["name"], "c": m["category"], "t": m["tier"],
        "b": 1 if m["isBoss"] else 0, "a": 1 if m["isAccessory"] else 0,
        "mt": m["measure"]["type"], "mu": m["measure"]["unit"],
        "ms": m["measure"]["sets"],
        "eq": m["equipment"], "pr": m["prerequisites"], "un": m["unlocks"],
        "mas": [[m["mastery"][t]["target"], m["mastery"][t]["xp"]] for t in MT],
        "mus": m["muscles"], "f": m["family"], "d": m["depth"],
        "x": round(pos[m["id"]]["x"], 1), "y": round(pos[m["id"]]["y"], 1),
    })

out = {
    "categories": db["categories"], "catOrder": CAT_ORDER,
    "equipment": db["equipment"], "masteryTiers": MT,
    "levelCurve": [l["xpRequired"] for l in db["levelCurve"]],
    "families": families,
    "bands": bands,
    "canvas": {"w": round(CANVAS_W), "h": round(CANVAS_H)},
    "stats": db["stats"],
    "moves": compact,
}
js = "window.ASCEND_DATA = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";"
open("ascend_data.js", "w", encoding="utf-8").write(js)
print(f"ascend_data.js yazildi: {len(js)/1024:.0f} KB, {len(compact)} node, "
      f"canvas {CANVAS_W}x{round(CANVAS_H)}")
for cat in CAT_ORDER:
    print(f"  {cat:<15} bant y={bands[cat]['y']:.0f} h={bands[cat]['h']:.0f} satir={bands[cat]['rows']}")

# ── Uygulama icin: sadece yerlesim + kategori bandi (JSON)
import os
app = {
    "canvas": out["canvas"],
    "bands": out["bands"],
    "catOrder": out["catOrder"],
    "pos": {m["id"]: [m["x"], m["y"]] for m in compact},
}
dst = os.path.join("..", "src", "data", "layout.json")
os.makedirs(os.path.dirname(dst), exist_ok=True)
with open(dst, "w", encoding="utf-8") as f:
    json.dump(app, f, ensure_ascii=False, separators=(",", ":"))
print(f"src/data/layout.json yazildi: {len(app['pos'])} konum")
