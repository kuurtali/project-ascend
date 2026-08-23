# -*- coding: utf-8 -*-
import sys; sys.path.insert(0,'/tmp/rig')
from poses import P

FAMILY = {
 'pushup':'PUSHUP','explosive_push':'EXPLOSIVE','oa_push':'PUSHUP',
 'vertical_push':'PIKE','handstand':'HANDSTAND','planche':'PLANCHE',
 'pullup':'PULLUP','oa_pull':'PULLUP','hang':'HANG','grip':'HANG',
 'row':'ROW','band_pull':'BAND_ROW','muscleup':'MUSCLEUP','dip':'DIP','front_lever':'FRONT_LEVER',
 'back_lever':'BACK_LEVER','lsit':'LSIT','leg_raise':'LEG_RAISE',
 'core_hold':'PLANK','squat':'SQUAT','single_leg':'PISTOL','hinge':'HINGE',
 'balance_arm':'BEAR','jump_rope':'JUMPROPE','run':'RUN',
 'mobility':'MOBILITY','recovery':'REST','rings_elite':'PLANCHE',
}
BYID = {
 'hspu':'HSPU','wall-hspu':'HSPU','freestanding-hspu':'HSPU',
 'one-arm-hspu':'HSPU','hollow-hold':'HOLLOW','hollow-rock':'HOLLOW',
 'dead-bug':'HOLLOW','plank':'PLANK','fingertip-pushup':'PUSHUP',
 'knuckle-pushup':'PUSHUP','finger-pushup':'PUSHUP',
 'bodyweight-squat':'SQUAT','band-face-pull':'FACE_PULL','sleep-hygiene':'REST',
}
ORDER = ['x','y','head','spine','armU','armL','legU','legL',
         'armU2','armL2','legU2','legL2']

def frame_ts(f):
    parts=[]
    for k in ORDER:
        if k in f:
            v=f[k]
            parts.append(f'{k}: {v:g}')
    return '{ ' + ', '.join(parts) + ' }'

L=[]
L.append('''/**
 * POZ KÜTÜPHANESİ — açı tabanlı iskelet
 *
 * !!! BU DOSYA ÜRETİLİR. Elle düzenleme: tools/rig/poses.py
 *     python3 tools/rig/emit.py > src/ui/figure/poses.ts
 *
 * Önceki sürümün hatası: poz = eklem KONUMLARI idi. İki kare arasında
 * ara değer alınırken ön kol uzayıp kısalıyordu; göz bunu lastik gibi,
 * "sarhoş" olarak okuyor. Kurucunun tarifi buydu ve haklıydı.
 *
 * Doğrusu ileri kinematik: kök nokta + AÇILAR. Kemik boyu sabit,
 * değişmesi mümkün değil. Ayrıca açı interpolasyonu uzvu doğal YAY
 * üzerinde taşır — dirsek artık gövdenin içinden geçmiyor.
 *
 * Açı: derece, 0=sağ, 90=aşağı, 180=sol, 270=yukarı.
 * Kök = göğüs (kollar oradan çıkar). Zemin y=90, barfiks y=8.
 *
 * Temas noktaları (yerdeki el, bardaki el, yerdeki ayak) poz üretilirken
 * ters kinematikle çakılır; yoksa çömelmede ayak havada kalıyordu.
 */

export type Prop = 'ground' | 'bar' | 'lowbar' | 'parallettes' | 'wall'
  | 'rope' | 'rings' | 'band' | 'band-floor';

/** Kemik boyları — tüm pozlarda aynı, asla değişmez. */
export const BONE = {
  head: 12, uarm: 14, farm: 14, spine: 26, thigh: 17, shin: 17,
  headR: 6.4,
} as const;

export interface Pose {
  /** Göğüs (kök) konumu */
  x: number; y: number;
  head: number; spine: number;
  armU: number; armL: number;
  legU: number; legL: number;
  /** Uzak taraf — verilmezse yakın tarafla aynı */
  armU2?: number; armL2?: number;
  legU2?: number; legL2?: number;
}

export interface PoseSet {
  /** Sıra: başlangıç → (ara) → bitiş. Geri dönüş otomatik. */
  frames: Pose[];
  props: Prop[];
  /** Bir tekrarın saniyesi */
  dur: number;
  /** Statik tutuş — nefes gibi hafif salınır */
  hold?: boolean;
}
''')
for name,d in P.items():
    props = ', '.join(f"'{x}'" for x in d['props'])
    hold = ', hold: true' if d.get('hold') else ''
    L.append(f"const {name}: PoseSet = {{")
    L.append(f"  props: [{props}], dur: {d['dur']:g}{hold},")
    L.append("  frames: [")
    for f in d['frames']:
        L.append(f"    {frame_ts(f)},")
    L.append("  ],")
    L.append("};")
    L.append("")

L.append("/** Aile → poz. Yeni hareket geldiğinde ailesi zaten bir poza düşer. */")
L.append("const BY_FAMILY: Record<string, PoseSet> = {")
for k,v in FAMILY.items(): L.append(f"  {k}: {v},")
L.append("};")
L.append("")
L.append("/** Ailenin ortalaması yanlış kalan ikonik hareketler. */")
L.append("const BY_ID: Record<string, PoseSet> = {")
for k,v in BYID.items(): L.append(f"  '{k}': {v},")
L.append("};")
L.append("")
L.append("""export function poseFor(movementId: string, family: string): PoseSet {
  return BY_ID[movementId] ?? BY_FAMILY[family] ?? STAND;
}

export { STAND };""")
print('\n'.join(L))
