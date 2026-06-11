import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { useEffect } from 'react';

interface DoodleDef {
  /** path no viewBox 0 0 100 100 */
  path: string;
  /** posição em % da altura/largura do documento */
  x: string;
  y: string;
  size: number;
  /** 0 = cola na página · maior = fica "pra trás" no scroll (mais fundo) */
  lag: number;
  rotate: number;
  mobileHidden?: boolean;
}

const DOODLES: DoodleDef[] = [
  // sparkle
  { path: 'M50 12 V42 M50 58 V88 M12 50 H42 M58 50 H88', x: '88%', y: '4%', size: 64, lag: 0.3, rotate: 12 },
  // rabisco ondulado
  { path: 'M10 60 Q 25 20 45 45 T 90 35', x: '4%', y: '14%', size: 110, lag: 0.18, rotate: -8, mobileHidden: true },
  // espiral solta
  { path: 'M30 55 C 28 30, 70 25, 72 48 C 74 72, 35 78, 33 58 C 31 42, 60 38, 62 52', x: '92%', y: '24%', size: 90, lag: 0.12, rotate: 20 },
  // asterisco
  { path: 'M50 15 V85 M15 50 H85 M27 27 L73 73 M73 27 L27 73', x: '6%', y: '36%', size: 54, lag: 0.34, rotate: 8, mobileHidden: true },
  // seta curvada
  { path: 'M15 80 C 40 75 65 55 75 25 M75 25 l-14 6 M75 25 l-2 15', x: '90%', y: '48%', size: 100, lag: 0.22, rotate: -14 },
  // círculo rabiscado
  { path: 'M22 50 C 20 24, 78 18, 80 46 C 82 74, 26 84, 20 58 C 16 38, 44 28, 64 30', x: '3%', y: '58%', size: 120, lag: 0.15, rotate: 6, mobileHidden: true },
  // zigue-zague
  { path: 'M10 70 L30 40 L50 70 L70 40 L90 70', x: '87%', y: '72%', size: 70, lag: 0.28, rotate: -6 },
  // xx de revisão
  { path: 'M25 25 L75 75 M75 25 L25 75', x: '8%', y: '84%', size: 44, lag: 0.32, rotate: 14, mobileHidden: true },
];

function Doodle({ d, scrollY }: { d: DoodleDef; scrollY: MotionValue<number> }) {
  const reduce = useReducedMotion();
  // posicionado no documento; "atrasa" em relação ao scroll → parece mais fundo
  const y = useTransform(scrollY, (v) => (reduce ? 0 : v * d.lag));

  return (
    <motion.div
      className={`absolute ${d.mobileHidden ? 'hidden md:block' : ''}`}
      style={{ left: d.x, top: d.y, y }}
    >
      <svg
        width={d.size}
        height={d.size}
        viewBox="0 0 100 100"
        fill="none"
        style={{ transform: `rotate(${d.rotate}deg)`, opacity: 0.09 }}
      >
        <path
          d={d.path}
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#hand-drawn-heavy)"
        />
      </svg>
    </motion.div>
  );
}

/** Doodles de lápis espalhados pelo fundo, em profundidades diferentes
 *  (parallax sutil — camada entre o papel e o conteúdo).
 *  Scroll rastreado por listener próprio: o ScrollTimeline usado pelo
 *  useScroll do Motion não atualiza em alguns contextos embutidos. */
export function ParallaxDoodles() {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollY]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {DOODLES.map((d, i) => (
        <Doodle key={i} d={d} scrollY={scrollY} />
      ))}
    </div>
  );
}
