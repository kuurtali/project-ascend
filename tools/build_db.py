#!/usr/bin/env python3
"""Project Ascend - movement database builder + validator.
Reads movements_data.py, expands to the full schema, validates the graph,
emits movements.json + validation_report.txt
"""
import json, sys, math
from collections import defaultdict, deque
from movements_data import M, FAMILIES, CATEGORIES, EQUIPMENT, ACCESSORY

SCHEMA_VERSION = "1.0.0"
MASTERY_TIERS = ["bronze", "silver", "gold", "master"]
# XP awarded on reaching each mastery tier = base_xp * multiplier
MASTERY_XP_MULT = {"bronze": 1.0, "silver": 1.6, "gold": 2.6, "master": 4.2}

def base_xp(tier):
    """Difficulty-scaled XP. Tier 0 = 30 XP, tier 9 = ~1300 XP."""
    return int(round(30 * (1.53 ** tier) / 5) * 5)

def unit_for(mtype):
    return {"reps": "tekrar", "reps_side": "tekrar/taraf", "hold": "saniye",
            "count": "adet", "dist": "metre"}[mtype]

def sets_for(mtype):
    return 1 if mtype in ("hold", "count", "dist") else 3

# ---------------------------------------------------------------- expand rows
moves = {}
order = []
for row in M:
    mid, name, cat, tier, mtype, equip, prereqs, thr, muscles, family, boss = row
    if mid in moves:
        print(f"FATAL duplicate id: {mid}"); sys.exit(1)
    fam = FAMILIES[family]
    bxp = base_xp(tier)
    moves[mid] = {
        "id": mid,
        "name": name,
        "category": cat,
        "tier": tier,
        "isBoss": bool(boss),
        "isAccessory": mid in ACCESSORY,
        "measure": {"type": mtype, "unit": unit_for(mtype), "sets": sets_for(mtype)},
        "equipment": list(equip),
        "prerequisites": list(prereqs),
        "unlocks": [],
        "mastery": {t: {"target": thr[i],
                        "sets": sets_for(mtype),
                        "xp": int(round(bxp * MASTERY_XP_MULT[t] / 5) * 5)}
                    for i, t in enumerate(MASTERY_TIERS)},
        "xp": {"base": bxp,
               "total": sum(int(round(bxp * MASTERY_XP_MULT[t] / 5) * 5) for t in MASTERY_TIERS)},
        "muscles": list(muscles),
        "family": family,
        "tips": fam["cues"],
        "commonMistakes": fam["mistakes"],
        "media": {"icon": None, "video": None, "animation": None},
        "lore": None,
        "depth": None,
    }
    order.append(mid)

# --------------------------------------------------------------- derive graph
for mid, mv in moves.items():
    for p in mv["prerequisites"]:
        if p in moves:
            moves[p]["unlocks"].append(mid)

# --------------------------------------------------------------- validation
errors, warnings = [], []

# 1. broken prerequisite references
for mid, mv in moves.items():
    for p in mv["prerequisites"]:
        if p not in moves:
            errors.append(f"[BROKEN REF] {mid} -> bilinmeyen prerequisite '{p}'")

# 2. cycle detection (Kahn)
indeg = {mid: sum(1 for p in mv["prerequisites"] if p in moves) for mid, mv in moves.items()}
q = deque([m for m, d in indeg.items() if d == 0])
topo = []
while q:
    n = q.popleft(); topo.append(n)
    for c in moves[n]["unlocks"]:
        indeg[c] -= 1
        if indeg[c] == 0: q.append(c)
if len(topo) != len(moves):
    stuck = [m for m in moves if m not in set(topo)]
    errors.append(f"[CYCLE] Döngü tespit edildi, etkilenen node'lar: {stuck}")

# 3. depth (longest path from any root)
for mid in topo:
    ps = [p for p in moves[mid]["prerequisites"] if p in moves]
    moves[mid]["depth"] = 0 if not ps else max(moves[p]["depth"] for p in ps) + 1

# 4. tier monotonicity: prerequisite must not be harder than the movement
for mid, mv in moves.items():
    for p in mv["prerequisites"]:
        if p in moves and moves[p]["tier"] > mv["tier"]:
            warnings.append(f"[TIER] {mid} (t{mv['tier']}) prerequisite'i {p} (t{moves[p]['tier']}) daha zor")

# 5. orphans: non-root nodes with no prerequisite and tier > 1
for mid, mv in moves.items():
    if not mv["prerequisites"] and mv["tier"] > 1:
        warnings.append(f"[ORPHAN] {mid} tier {mv['tier']} ama prerequisite yok")

# 6. dead ends: leaf node that is neither a boss nor a declared accessory
for mid, mv in moves.items():
    if (not mv["unlocks"] and not mv["isBoss"] and not mv["isAccessory"]
            and mv["category"] != "recovery"):
        warnings.append(f"[DEAD END] {mid} (t{mv['tier']}) yaprak node ama boss/aksesuar da değil "
                        f"-> ya devam progression'ı eksik ya ACCESSORY'ye eklenmeli")
# 6b. accessory listesinde olup aslında bir şeyin kilidini açan node'lar (liste güncel değil)
for mid, mv in moves.items():
    if mv["isAccessory"] and mv["unlocks"]:
        warnings.append(f"[ACCESSORY?] {mid} ACCESSORY olarak işaretli ama {len(mv['unlocks'])} node'un kilidini açıyor")

# 7. every boss must be reachable from a tier<=1 root
roots = {m for m, mv in moves.items() if not mv["prerequisites"]}
def ancestors(mid):
    seen, st = set(), [mid]
    while st:
        n = st.pop()
        for p in moves[n]["prerequisites"]:
            if p in moves and p not in seen:
                seen.add(p); st.append(p)
    return seen
bosses = [m for m, mv in moves.items() if mv["isBoss"]]
for b in bosses:
    if not (ancestors(b) & roots):
        errors.append(f"[UNREACHABLE BOSS] {b} hiçbir başlangıç node'una bağlı değil")

# 8. equipment sanity
for mid, mv in moves.items():
    for e in mv["equipment"]:
        if e not in EQUIPMENT:
            errors.append(f"[EQUIPMENT] {mid} bilinmeyen ekipman '{e}'")

# 9. category sanity
for mid, mv in moves.items():
    if mv["category"] not in CATEGORIES:
        errors.append(f"[CATEGORY] {mid} bilinmeyen kategori '{mv['category']}'")

# 10. mastery thresholds must be non-decreasing
for mid, mv in moves.items():
    t = [mv["mastery"][k]["target"] for k in MASTERY_TIERS]
    if t != sorted(t):
        errors.append(f"[MASTERY] {mid} eşikleri artan sırada değil: {t}")

# 11. EKIPMAN KASKADI  (bu kontrol gercek bir hatayi yakaladigi icin eklendi)
# Bir "kapi" node'u dar bir ekipmana baglanirsa, o ekipmani olmayan kullanici
# icin agacin buyuk bir kismi sessizce cokerse uyarir.
# Ornek yakalanan hata: shoulder-mobility sadece ["band"] idi -> bantsiz
# kullanici icin 39 node ve 8 boss erisilemez hale geliyordu.
# Herkeste var sayilan ekipman. "box" burada cunku bir sandalye/basamak/yatak
# kenari evrensel olarak mevcut; bench-dip, elevated-pike ve bulgarian-split-squat
# bunlarla yapilir. Ekipman diye saymak 30 node'u yapay olarak kilitliyordu.
BASE_EQUIPMENT = {"floor", "wall", "box"}
def reachable_with(owned):
    done, changed = set(), True
    while changed:
        changed = False
        for mid, m in moves.items():
            if mid in done:
                continue
            if m["equipment"] and not (set(m["equipment"]) & owned):
                continue
            if all(p in done for p in m["prerequisites"]):
                done.add(mid); changed = True
    return done

ALL_EQ = set(EQUIPMENT)
full = reachable_with(ALL_EQ)
for eq in sorted(ALL_EQ - BASE_EQUIPMENT):
    without = reachable_with(ALL_EQ - {eq})
    lost = full - without
    # bu ekipmani GERCEKTEN gerektiren node sayisi
    direct = {m for m in lost if moves[m]["equipment"] and
              set(moves[m]["equipment"]) <= {eq}}
    indirect = lost - direct
    if len(indirect) > 3 * max(len(direct), 1) and len(indirect) > 10:
        gates = sorted(direct, key=lambda m: -len(moves[m]["unlocks"]))[:3]
        warnings.append(
            f"[EKIPMAN KASKADI] '{EQUIPMENT[eq]}' olmayan kullanici {len(lost)} node "
            f"kaybediyor ama sadece {len(direct)} tanesi gercekten bu ekipmani "
            f"gerektiriyor. Kapi node'lari: {gates} -> bu node'lara alternatif "
            f"ekipman eklenmeli mi?")

# ------------------------------------------------------- player level curve
# Level N requires cumulative XP: 100 * N^1.6  (level 1 = 0)
def xp_for_level(n):
    return 0 if n <= 1 else int(round(100 * ((n - 1) ** 1.6) / 10) * 10)

levels = [{"level": n, "xpRequired": xp_for_level(n)} for n in range(1, 101)]
total_xp = sum(mv["xp"]["total"] for mv in moves.values())

db = {
    "schemaVersion": SCHEMA_VERSION,
    "project": "Project Ascend",
    "generated": "build_db.py",
    "categories": CATEGORIES,
    "equipment": EQUIPMENT,
    "masteryTiers": MASTERY_TIERS,
    "masteryXpMultipliers": MASTERY_XP_MULT,
    "levelCurve": levels,
    "stats": {
        "movementCount": len(moves),
        "bossCount": len(bosses),
        "rootCount": len(roots),
        "maxDepth": max(mv["depth"] for mv in moves.values()),
        "maxTier": max(mv["tier"] for mv in moves.values()),
        "totalObtainableXp": total_xp,
        "byCategory": {c: sum(1 for mv in moves.values() if mv["category"] == c) for c in CATEGORIES},
    },
    "movements": [moves[m] for m in order],
}

with open("movements.json", "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=1)

# ------------------------------------------------------------------- report
lines = []
lines.append("PROJECT ASCEND - VERI DOGRULAMA RAPORU")
lines.append("=" * 60)
lines.append(f"Hareket sayisi      : {len(moves)}")
lines.append(f"Boss sayisi         : {len(bosses)}")
lines.append(f"Kok (baslangic) node: {len(roots)}")
lines.append(f"Maks agac derinligi : {db['stats']['maxDepth']}")
lines.append(f"Toplam kazanilabilir XP: {total_xp:,}")
lines.append("")
lines.append("KATEGORI DAGILIMI")
for c, n in db["stats"]["byCategory"].items():
    lines.append(f"  {CATEGORIES[c]['label']:<16} {n:>3}")
lines.append("")
lines.append(f"HATA   : {len(errors)}")
for e in errors: lines.append("  " + e)
lines.append("")
lines.append(f"UYARI  : {len(warnings)}")
for w in warnings: lines.append("  " + w)
lines.append("")
lines.append("BOSS ERISIM YOLLARI (kok -> boss derinligi)")
for b in sorted(bosses, key=lambda x: moves[x]["depth"]):
    lines.append(f"  {moves[b]['name']:<32} tier {moves[b]['tier']}  derinlik {moves[b]['depth']}")
report = "\n".join(lines)
with open("validation_report.txt", "w", encoding="utf-8") as f:
    f.write(report)
print(report)
print("\nEXIT:", "FAIL" if errors else "OK")
sys.exit(1 if errors else 0)
