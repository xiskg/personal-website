import { PencilSimple } from '@phosphor-icons/react';
import { motion, useScroll, useTransform } from 'motion/react';

/** Linha de lápis que se desenha na margem esquerda conforme o scroll. */
export function PencilProgress() {
  const { scrollYProgress } = useScroll();
  const tipTop = useTransform(scrollYProgress, (v) => `calc(${v * 100}% - 9px)`);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-4 z-0 hidden w-6 xl:block"
    >
      <svg className="h-full w-full" viewBox="0 0 24 1000" preserveAspectRatio="none" fill="none">
        <motion.path
          d="M12 0 C 18 80, 6 160, 12 250 S 18 420, 12 520 S 6 700, 12 800 S 18 920, 12 1000"
          stroke="var(--ink-soft)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#hand-drawn-subtle)"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <motion.div className="absolute -right-1" style={{ top: tipTop }}>
        <PencilSimple
          size={18}
          weight="fill"
          style={{ color: 'var(--ink-soft)', transform: 'rotate(135deg)', opacity: 0.7 }}
        />
      </motion.div>
    </div>
  );
}
