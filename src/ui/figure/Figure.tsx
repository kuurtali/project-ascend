/**
 * FİGÜR — hareketi gerçekten yapan siluet
 *
 * İskelet açı tabanlı (bkz. poses.ts): kemik boyları sabit olduğu için
 * uzuvlar uzayıp kısalmıyor ve dirsek doğal yay üzerinde hareket ediyor.
 * Önceki konum tabanlı sürüm "sarhoş" görünüyordu; sebebi buydu.
 *
 * Animasyon SMIL ile (SVG'nin kendi <animate> etiketi): JavaScript
 * döngüsü yok, ekranda 6 figür olsa bile pil maliyeti sıfıra yakın.
 * Telefonda antrenman boyunca açık duracak.
 *
 * Her uzuv İKİ KEZ çizilir: önce arka plan renginde geniş kontur, sonra
 * dolgu. Kontursuz çizimde kol gövdenin önünden geçtiğinde kayboluyordu.
 */

import { BONE, poseFor, type Pose, type PoseSet, type Prop } from './poses';

type P = [number, number];

/** Arka plan rengi — kontur bununla çizilir. */
const BG = '#0b0d12';
const OUTLINE = 3;
/** Uzak uzuvları kaydırma — bedava derinlik */
const DEPTH: P = [4, 2];

function tip(o: P, deg: number, len: number): P {
  const r = (deg * Math.PI) / 180;
  return [o[0] + len * Math.cos(r), o[1] + len * Math.sin(r)];
}

interface Joints {
  chest: P; head: P; elbow: P; hand: P; pelvis: P; knee: P; foot: P;
  elbow2: P; hand2: P; knee2: P; foot2: P;
}

function jointsOf(p: Pose): Joints {
  const chest: P = [p.x, p.y];
  const pelvis = tip(chest, p.spine, BONE.spine);
  const elbow = tip(chest, p.armU, BONE.uarm);
  const elbow2 = tip(chest, p.armU2 ?? p.armU, BONE.uarm);
  const knee = tip(pelvis, p.legU, BONE.thigh);
  const knee2 = tip(pelvis, p.legU2 ?? p.legU, BONE.thigh);
  return {
    chest, pelvis, elbow, knee,
    head: tip(chest, p.head, BONE.head),
    hand: tip(elbow, p.armL, BONE.farm),
    foot: tip(knee, p.legL, BONE.shin),
    elbow2, knee2,
    hand2: tip(elbow2, p.armL2 ?? p.armL, BONE.farm),
    foot2: tip(knee2, p.legL2 ?? p.legL, BONE.shin),
  };
}

/** En kısa yönden açı geçişi — 350°'den 10°'ye giderken geri sarmasın */
function lerpAngle(a: number, b: number, t: number): number {
  return a + (((b - a + 180) % 360) - 180) * t;
}

function blend(a: Pose, b: Pose, t: number): Pose {
  const k = (x: number | undefined, y: number | undefined, ang: boolean) => {
    const v1 = x ?? y ?? 0; const v2 = y ?? x ?? 0;
    return ang ? lerpAngle(v1, v2, t) : v1 + (v2 - v1) * t;
  };
  return {
    x: k(a.x, b.x, false), y: k(a.y, b.y, false),
    head: k(a.head, b.head, true), spine: k(a.spine, b.spine, true),
    armU: k(a.armU, b.armU, true), armL: k(a.armL, b.armL, true),
    legU: k(a.legU, b.legU, true), legL: k(a.legL, b.legL, true),
    armU2: k(a.armU2 ?? a.armU, b.armU2 ?? b.armU, true),
    armL2: k(a.armL2 ?? a.armL, b.armL2 ?? b.armL, true),
    legU2: k(a.legU2 ?? a.legU, b.legU2 ?? b.legU, true),
    legL2: k(a.legL2 ?? a.legL, b.legL2 ?? b.legL, true),
  };
}

/** Yumuşak giriş-çıkış — dönüş noktalarında yavaşlar */
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Bir tekrarın tüm kareleri. Poz listesi gidiş yönünü tarif eder,
 * dönüş otomatik eklenir: a → b → c → b → a.
 */
function cycleOf(ps: PoseSet, steps: number): Joints[] {
  const keys = [...ps.frames, ...ps.frames.slice(0, -1).reverse()];
  const segs = Math.max(1, keys.length - 1);
  const out: Joints[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * segs;
    const s = Math.min(segs - 1, Math.floor(t));
    out.push(jointsOf(blend(keys[s]!, keys[s + 1]!, ease(t - s))));
  }
  out.push(out[0]!);   // döngü kapansın
  return out;
}

const STEPS = 16;

interface Props {
  movementId: string;
  family: string;
  size?: number;
  color?: string;
  /** Hedef önizlemesi: soluk, kesikli, hareketsiz */
  ghost?: boolean;
  animate?: boolean;
}

export function Figure({
  movementId, family, size = 88, color = '#e6e8ee',
  ghost = false, animate = true,
}: Props) {
  const ps = poseFor(movementId, family);
  const on = animate && !ghost;
  const still = jointsOf(ps.frames[0]!);
  const cyc = on ? cycleOf(ps, STEPS) : [still];
  const opacity = ghost ? 0.3 : 1;

  const seg = (
    key: string,
    from: (j: Joints) => P, to: (j: Joints) => P,
    w: number, far = false,
  ) => {
    const shift = (q: P): P => (far ? [q[0] + DEPTH[0], q[1] + DEPTH[1]] : q);
    const a = shift(from(still)); const b = shift(to(still));
    const vx1 = cyc.map((j) => shift(from(j))[0].toFixed(1)).join(';');
    const vy1 = cyc.map((j) => shift(from(j))[1].toFixed(1)).join(';');
    const vx2 = cyc.map((j) => shift(to(j))[0].toFixed(1)).join(';');
    const vy2 = cyc.map((j) => shift(to(j))[1].toFixed(1)).join(';');
    const anim = on && (
      <>
        <animate attributeName="x1" values={vx1} dur={`${ps.dur}s`} repeatCount="indefinite" />
        <animate attributeName="y1" values={vy1} dur={`${ps.dur}s`} repeatCount="indefinite" />
        <animate attributeName="x2" values={vx2} dur={`${ps.dur}s`} repeatCount="indefinite" />
        <animate attributeName="y2" values={vy2} dur={`${ps.dur}s`} repeatCount="indefinite" />
      </>
    );
    const common = {
      x1: a[0].toFixed(1), y1: a[1].toFixed(1),
      x2: b[0].toFixed(1), y2: b[1].toFixed(1),
      strokeLinecap: 'round' as const,
    };
    return (
      <g key={key} opacity={(far ? 0.42 : 1) * opacity}>
        {!ghost && <line {...common} stroke={BG} strokeWidth={w + OUTLINE}>{anim}</line>}
        <line {...common} stroke={color} strokeWidth={w}
              strokeDasharray={ghost ? '5 4' : undefined}>{anim}</line>
      </g>
    );
  };

  const headAnim = on && (
    <>
      <animate attributeName="cx" dur={`${ps.dur}s`} repeatCount="indefinite"
               values={cyc.map((j) => j.head[0].toFixed(1)).join(';')} />
      <animate attributeName="cy" dur={`${ps.dur}s`} repeatCount="indefinite"
               values={cyc.map((j) => j.head[1].toFixed(1)).join(';')} />
    </>
  );

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
         style={{ overflow: 'visible', display: 'block' }}>
      <Equipment props={ps.props} color={color} ghost={ghost} dur={ps.dur} />

      {/* uzak taraf — derinlik */}
      {seg('fa1', (j) => j.chest, (j) => j.elbow2, 4.6, true)}
      {seg('fa2', (j) => j.elbow2, (j) => j.hand2, 4.0, true)}
      {seg('fl1', (j) => j.pelvis, (j) => j.knee2, 5.4, true)}
      {seg('fl2', (j) => j.knee2, (j) => j.foot2, 4.8, true)}

      {/* gövde */}
      {seg('torso', (j) => j.chest, (j) => j.pelvis, 8)}

      {/* baş */}
      <g opacity={opacity}>
        {!ghost && (
          <circle cx={still.head[0]} cy={still.head[1]} r={BONE.headR + 1.5} fill={BG}>
            {headAnim}
          </circle>
        )}
        <circle cx={still.head[0]} cy={still.head[1]} r={BONE.headR}
                fill={ghost ? 'none' : color} stroke={color}
                strokeWidth={ghost ? 2 : 0}
                strokeDasharray={ghost ? '4 3' : undefined}>
          {headAnim}
        </circle>
      </g>

      {/* yakın taraf — en önde */}
      {seg('l1', (j) => j.pelvis, (j) => j.knee, 6)}
      {seg('l2', (j) => j.knee, (j) => j.foot, 5.2)}
      {seg('a1', (j) => j.chest, (j) => j.elbow, 5.2)}
      {seg('a2', (j) => j.elbow, (j) => j.hand, 4.6)}
    </svg>
  );
}

function Equipment({ props, color, ghost, dur }: {
  props: readonly Prop[]; color: string; ghost: boolean; dur: number;
}) {
  const c = ghost ? color : '#5b6376';
  return (
    <g stroke={c} opacity={ghost ? 0.2 : 0.7} fill="none" strokeLinecap="round">
      {props.includes('ground') && <line x1={2} y1={91} x2={98} y2={91} strokeWidth={2} />}
      {props.includes('bar') && <line x1={12} y1={8} x2={88} y2={8} strokeWidth={3} />}
      {props.includes('lowbar') && <line x1={12} y1={51} x2={74} y2={51} strokeWidth={3} />}
      {props.includes('parallettes') && <>
        <line x1={20} y1={52} x2={60} y2={52} strokeWidth={3} />
        <line x1={24} y1={52} x2={24} y2={82} strokeWidth={2} />
      </>}
      {props.includes('wall') && (
        <line x1={66} y1={2} x2={66} y2={62} strokeWidth={2} strokeDasharray="3 4" />
      )}
      {props.includes('rope') && (
        <path d="M38 52 Q 50 104 62 52" strokeWidth={1.8}>
          <animate attributeName="d" dur={`${dur}s`} repeatCount="indefinite"
                   values="M38 52 Q 50 104 62 52;M38 46 Q 50 -12 62 46;M38 52 Q 50 104 62 52" />
        </path>
      )}
      {props.includes('rings') && <>
        <line x1={34} y1={4} x2={34} y2={20} strokeWidth={1.6} />
        <line x1={66} y1={4} x2={66} y2={20} strokeWidth={1.6} />
        <circle cx={34} cy={26} r={6} strokeWidth={2.2} />
        <circle cx={66} cy={26} r={6} strokeWidth={2.2} />
      </>}
    </g>
  );
}

export { poseFor };
export type { PoseSet };
