import { motion } from 'motion/react';
import { durations } from '../lib/motion';
import { PaperReveal } from './PaperReveal';

interface Props {
  kicker: string;
  title: string;
}

/** Kicker manuscrito + h2 cujo sublinhado de marcador se desenha ao entrar na tela. */
export function SectionHeader({ kicker, title }: Props) {
  return (
    <PaperReveal className="section-header">
      <span className="section-header__kicker">{kicker}</span>
      <div className="w-fit max-w-full">
        <h2 className="section-header__title h2-bare">{title}</h2>
        <motion.span
          className="marker-stroke mt-2"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: durations.draw, ease: 'easeInOut', delay: 0.15 }}
        />
      </div>
    </PaperReveal>
  );
}
