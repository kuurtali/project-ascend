/**
 * FİGÜR — hareketi gerçekten yapan siluet
 *
 * Animasyon SMIL ile (SVG'nin kendi <animate> etiketi). Sebep: JavaScript
 * döngüsü yok, requestAnimationFrame yok, ekranda 6 figür olsa bile CPU
 * maliyeti sıfıra yakın. Telefonda antrenman sırasında açık duracak —
 * pil önemli.
 *
 * Uzak taraftaki kol ve bacak, yakındakinin kaydırılmış ve soluk kopyası.
 * Bedava derinlik: tek bir ekstra poz tanımı gerektirmiyor.
 */

import { poseFor, type P, type Pose, type PoseSet, type Prop } from './poses';

const DEPTH: P = [5, 2];
const off = (p: P): P => [p[0] + DEPTH[0], p[1] + DEPTH[1]];

interface Props {
  movementId: string;
  family: string;
  size?: number;
  color?: string;
  /** Hedef önizlemesi: soluk, kesikli, hareketsiz */
  ghost?: boolean;
  animate?: boolean;
  className?: string;
}

export function Figure({
  movementId, family, size = 88, color = '#e6e8ee',
  ghost = false, animate = true, className,
}: Props) {
  const ps = poseFor(movementId, family);
  const a = ps.a;
  const b = ghost ? ps.a : ps.b;
  const on = animate && !ghost;
  const dur = `${ps.dur}s`;
  const opacity = ghost ? 0.26 : 1;

  /** Bir çizgi + iki uç arasında gidip gelen animasyon */
  const Seg = (
    key: string, p1a: P, p2a: P, p1b: P, p2b: P,
    w: number, dim = false,
  ) => (
    <line key={key}
      x1={p1a[0]} y1={p1a[1]} x2={p2a[0]} y2={p2a[1]}
      stroke={color} strokeWidth={w} strokeLinecap="round"
      opacity={(dim ? 0.42 : 1) * opacity}
      strokeDasharray={ghost ? '5 4' : undefined}>
      {on && <>
        <animate attributeName="x1" dur={dur} repeatCount="indefinite"
                 values={`${p1a[0]};${p1b[0]};${p1a[0]}`} calcMode="spline"
                 keyTimes="0;0.5;1" keySplines=".4 0 .3 1;.4 0 .3 1" />
        <animate attributeName="y1" dur={dur} repeatCount="indefinite"
                 values={`${p1a[1]};${p1b[1]};${p1a[1]}`} calcMode="spline"
                 keyTimes="0;0.5;1" keySplines=".4 0 .3 1;.4 0 .3 1" />
        <animate attributeName="x2" dur={dur} repeatCount="indefinite"
                 values={`${p2a[0]};${p2b[0]};${p2a[0]}`} calcMode="spline"
                 keyTimes="0;0.5;1" keySplines=".4 0 .3 1;.4 0 .3 1" />
        <animate attributeName="y2" dur={dur} repeatCount="indefinite"
                 values={`${p2a[1]};${p2b[1]};${p2a[1]}`} calcMode="spline"
                 keyTimes="0;0.5;1" keySplines=".4 0 .3 1;.4 0 .3 1" />
      </>}
    </line>
  );

  const arm = (p: Pose) => ({
    e: p.elbow2 ?? p.elbow, h: p.hand2 ?? p.hand,
  });
  const leg = (p: Pose) => ({
    k: p.knee2 ?? p.knee, f: p.foot2 ?? p.foot,
  });

  const farA = { arm: arm(a), leg: leg(a) };
  const farB = { arm: arm(b), leg: leg(b) };
  const useOff = (p: Pose, q: P) => (p.elbow2 || p.knee2 ? q : off(q));

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
         className={className} style={{ overflow: 'visible' }}>
      <Props_ props={ps.props} color={color} ghost={ghost} />

      {/* uzak taraf — derinlik */}
      {Seg('fa1', useOff(a, a.neck), useOff(a, farA.arm.e),
                  useOff(b, b.neck), useOff(b, farB.arm.e), 5, true)}
      {Seg('fa2', useOff(a, farA.arm.e), useOff(a, farA.arm.h),
                  useOff(b, farB.arm.e), useOff(b, farB.arm.h), 4.5, true)}
      {Seg('fl1', useOff(a, a.hip), useOff(a, farA.leg.k),
                  useOff(b, b.hip), useOff(b, farB.leg.k), 6, true)}
      {Seg('fl2', useOff(a, farA.leg.k), useOff(a, farA.leg.f),
                  useOff(b, farB.leg.k), useOff(b, farB.leg.f), 5, true)}

      {/* gövde */}
      {Seg('torso', a.neck, a.hip, b.neck, b.hip, 8.5)}

      {/* baş */}
      <circle cx={a.head[0]} cy={a.head[1]} r={7.5}
              fill={ghost ? 'none' : color} stroke={color}
              strokeWidth={ghost ? 2 : 0} opacity={opacity}
              strokeDasharray={ghost ? '4 3' : undefined}>
        {on && <>
          <animate attributeName="cx" dur={dur} repeatCount="indefinite"
                   values={`${a.head[0]};${b.head[0]};${a.head[0]}`}
                   calcMode="spline" keyTimes="0;0.5;1"
                   keySplines=".4 0 .3 1;.4 0 .3 1" />
          <animate attributeName="cy" dur={dur} repeatCount="indefinite"
                   values={`${a.head[1]};${b.head[1]};${a.head[1]}`}
                   calcMode="spline" keyTimes="0;0.5;1"
                   keySplines=".4 0 .3 1;.4 0 .3 1" />
        </>}
      </circle>

      {/* yakın taraf */}
      {Seg('a1', a.neck, a.elbow, b.neck, b.elbow, 5.5)}
      {Seg('a2', a.elbow, a.hand, b.elbow, b.hand, 5)}
      {Seg('l1', a.hip, a.knee, b.hip, b.knee, 6.5)}
      {Seg('l2', a.knee, a.foot, b.knee, b.foot, 5.5)}
    </svg>
  );
}

function Props_({ props, color, ghost }: {
  props: Prop[]; color: string; ghost: boolean;
}) {
  const c = ghost ? color : '#5b6376';
  const o = ghost ? 0.2 : 0.75;
  return (
    <g stroke={c} opacity={o} fill="none" strokeLinecap="round">
      {props.includes('ground') && <line x1={2} y1={91} x2={98} y2={91} strokeWidth={2} />}
      {props.includes('bar') && <line x1={14} y1={9} x2={86} y2={9} strokeWidth={3} />}
      {props.includes('lowbar') && <line x1={14} y1={51} x2={72} y2={51} strokeWidth={3} />}
      {props.includes('parallettes') && <>
        <line x1={22} y1={51} x2={58} y2={51} strokeWidth={3} />
        <line x1={26} y1={51} x2={26} y2={80} strokeWidth={2} />
      </>}
      {props.includes('wall') && <line x1={68} y1={2} x2={68} y2={62} strokeWidth={2}
                                       strokeDasharray="3 4" />}
      {props.includes('rope') && (
        <path d="M36 54 Q 50 106 64 54" strokeWidth={1.8}>
          <animate attributeName="d" dur="0.9s" repeatCount="indefinite"
                   values="M36 54 Q 50 106 64 54;M36 48 Q 50 -14 64 48;M36 54 Q 50 106 64 54" />
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
