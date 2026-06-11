import { ArrowDown, MapPin, PencilSimple } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import portrait from '../assets/portrait-sketch.jpg';
import { profile } from '../data/profile';
import { durations, springs } from '../lib/motion';

const TITLE_WORDS = ['Every', 'great', 'brand', 'starts', 'as', 'a'];
const HIGHLIGHT_WORD = 'sketch.';

interface Props {
  onPickPencil: () => void;
}

export function Hero({ onPickPencil }: Props) {
  const reduce = useReducedMotion();
  const wordDelay = 0.18;
  const highlightDelay = wordDelay + TITLE_WORDS.length * 0.07 + 0.15;

  return (
    <section
      id="top"
      className="grid min-h-[78vh] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]"
    >
      {/* Coluna de texto */}
      <div className="flex flex-col items-start gap-6">
        {/* Badge "carimbada" no papel */}
        <motion.span
          className="badge"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={springs.wobble}
        >
          {profile.role}
        </motion.span>

        {/* Título: palavras assentam uma a uma, marca-texto passa por último */}
        <h1 className="m-0 max-w-[14ch]" style={{ fontSize: 'var(--text-hero)' }}>
          {TITLE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              className="inline-block"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ ...springs.paper, delay: wordDelay + i * 0.07 }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
          <motion.span
            className="relative inline-block"
            style={{ zIndex: 1 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ ...springs.paper, delay: wordDelay + TITLE_WORDS.length * 0.07 }}
          >
            {HIGHLIGHT_WORD}
            <motion.span
              className="marker-highlight"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: durations.draw, ease: 'easeInOut', delay: highlightDelay }}
            />
          </motion.span>
        </h1>

        <motion.p
          className="m-0 max-w-[52ch] text-soft"
          style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: highlightDelay + 0.2 }}
        >
          I'm {profile.name.split(' ')[0]} — a strategic brand designer turning business goals into
          identities people actually remember. 5+ years shipping brands across LATAM and North
          America, from the first pencil stroke to the final guideline.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: highlightDelay + 0.35 }}
        >
          <motion.a
            href="#work"
            className="btn btn--primary btn--lg no-underline scribble-hover"
            whileTap={{ scale: 0.96 }}
          >
            See the work <ArrowDown size={20} weight="bold" />
          </motion.a>
          <motion.button
            onClick={onPickPencil}
            className="btn btn--secondary scribble-hover"
            whileTap={{ scale: 0.96 }}
          >
            <PencilSimple size={20} weight="bold" /> Pick up the pencil
          </motion.button>
          <span className="flex items-center gap-1 text-soft" style={{ fontSize: 'var(--text-sm)' }}>
            <MapPin size={16} /> {profile.location} · working worldwide
          </span>
        </motion.div>
      </div>

      {/* Coluna do retrato: polaroid colado com fita */}
      <div className="relative flex justify-center">
        {/* Seta doodle que se desenha apontando pro retrato */}
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -left-10 hidden w-24 xl:block"
          viewBox="0 0 100 60"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: highlightDelay + 0.5 }}
        >
          <motion.path
            d="M4 50 C 30 55, 55 40, 78 18 M78 18 l -14 2 M78 18 l -2 14"
            stroke="var(--ink-soft)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#hand-drawn)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: durations.draw, delay: highlightDelay + 0.5, ease: 'easeInOut' }}
          />
          <motion.text
            x="2"
            y="38"
            style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', fill: 'var(--ink-soft)' }}
            transform="rotate(-8 2 38)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: highlightDelay + 0.9 }}
          >
            me, irl
          </motion.text>
        </motion.svg>

        <motion.div
          className="tape relative w-full max-w-72 lg:max-w-85"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, rotate: 8 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ ...springs.wobble, delay: reduce ? 0 : highlightDelay + 0.15 }}
          whileHover={{ rotate: -1, scale: 1.02 }}
        >
          <div
            className="p-3 pb-2"
            style={{
              backgroundColor: 'var(--paper)',
              border: 'var(--border-width) solid var(--ink)',
              borderRadius: 'var(--radius-wobbly-sm)',
              boxShadow: 'var(--shadow-sketch-lg)',
            }}
          >
            <img
              src={portrait}
              alt={`Hand-drawn pencil portrait of ${profile.name}`}
              className="block w-full"
              style={{
                border: '2px solid var(--ink)',
                borderRadius: 'var(--radius-wobbly-xs)',
              }}
            />
            <p
              className="m-0 pt-2 text-center"
              style={{ fontFamily: 'var(--font-accent)', fontSize: 'var(--text-sm)' }}
            >
              yes, hand-drawn — like everything else here
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
