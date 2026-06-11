import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { springs } from '../lib/motion';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Entrada "papel colado": assenta na página com leve rotação (MOTION.md). */
export function PaperReveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...springs.paper, delay }}
    >
      {children}
    </motion.div>
  );
}
