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

  /**
   * Bir tekrarın kare sırası: alt -> (ara) -> üst -> (ara) -> alt.
   * Ara kare varsa 5 nokta, yoksa 3. Dönüş noktalarında yavaşlar
   * (spline), ortada hızlanır — gerçek tekrarın ritmi böyle.
   */
  const seq = <T,>(fa: T, fm: T | null, fb: T): T[] =>
    fm ? [fa, fm, fb, fm, fa] : [fa, fb, fa];

  const KT = ps.m ? '0;0.28;0.5;0.78;1' : '0;0.5;1';
  const KS = ps.m
    ? '.35 0 .25 1;.35 0 .25 1;.35 0 .25 1;.35 0 .25 1'
    : '.4 0 .3 1;.4 0 .3 1';

  const Anim = ({ attr, va }: { attr: string; va: (number)[] }) => (
    <animate attributeName={attr} dur={dur} repeatCount="indefinite"
             values={va.join(';')} calcMode="spline"
             keyTimes={KT} keySplines={KS} />
  );

  /** Bir çizgi + uçlarının kare kare yolu */
  const Seg = (
    key: string, e1: P[], e2: P[], w: number, dim = false,
  ) => (
    <line key={key}
      x1={e1[0]![0]} y1={e1[0]![1]} x2={e2[0]![0]} y2={e2[0]![1]}
      stroke={color} strokeWidth={w} strokeLinecap="round"
      opacity={(dim ? 0.42 : 1) * opacity}
      strokeDasharray={ghost ? '5 4' : undefined}>
      {on && <>
        <Anim attr="x1" va={e1.map((p) => p[0])} />
        <Anim attr="y1" va={e1.map((p) => p[1])} />
        <Anim attr="x2" va={e2.map((p) => p[0])} />
        <Anim attr="y2" va={e2.map((p) => p[1])} />
      </>}
    </line>
  );

  /** Bu poz asimetrik mi — öyleyse uzak uzuvlar kaydırılmaz */
  const asym = !!(a.elbow2 || a.knee2);
  const shift = (q: P): P => (asym ? q : off(q));

  const frames: Pose[] = seq(a, ghost ? null : (ps.m ?? null), b);

  /** Bir eklemin kare kare yolu */
  const path = (pick: (p: Pose) => P): P[] => frames.map(pick);
  const farPath = (pick: (p: Pose) => P): P[] => frames.map((f) => shift(pick(f)));

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
         className={className} style={{ overflow: 'visible' }}>
      <Props_ props={ps.props} color={color} ghost={ghost} />

      {/* uzak taraf — derinlik */}
      {Seg('fa1', farPath((p) => p.neck), farPath((p) => p.elbow2 ?? p.elbow), 5, true)}
      {Seg('fa2', farPath((p) => p.elbow2 ?? p.elbow),
                  farPath((p) => p.hand2 ?? p.hand), 4.5, true)}
      {Seg('fl1', farPath((p) => p.hip), farPath((p) => p.knee2 ?? p.knee), 6, true)}
      {Seg('fl2', farPath((p) => p.knee2 ?? p.knee),
                  farPath((p) => p.foot2 ?? p.foot), 5, true)}

      {/* gövde */}
      {Seg('torso', path((p) => p.neck), path((p) => p.hip), 8.5)}

      {/* baş */}
      <circle cx={a.head[0]} cy={a.head[1]} r={7.5}
              fill={ghost ? 'none' : color} stroke={color}
              strokeWidth={ghost ? 2 : 0} opacity={opacity}
              strokeDasharray={ghost ? '4 3' : undefined}>
        {on && <>
          <Anim attr="cx" va={path((p) => p.head).map((p) => p[0])} />
          <Anim attr="cy" va={path((p) => p.head).map((p) => p[1])} />
        </>}
      </circle>

      {/* yakın taraf */}
      {Seg('a1', path((p) => p.neck), path((p) => p.elbow), 5.5)}
      {Seg('a2', path((p) => p.elbow), path((p) => p.hand), 5)}
      {Seg('l1', path((p) => p.hip), path((p) => p.knee), 6.5)}
      {Seg('l2', path((p) => p.knee), path((p) => p.foot), 5.5)}
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
