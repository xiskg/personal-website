import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { experience } from '../data/profile';
import { durations, springs } from '../lib/motion';
import { PaperReveal } from './PaperReveal';
import { SectionHeader } from './SectionHeader';

/** Bio com anotações à mão + artefatos físicos + timeline que se desenha. */
export function DesignerSection() {
  // gatilho num elemento HTML: Safari não dispara whileInView em <path>
  const circleRef = useRef<HTMLSpanElement>(null);
  const circleInView = useInView(circleRef, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-16">
      <SectionHeader kicker="the designer" title="Who's holding the pencil" />

      <div className="grid items-start gap-12 lg:grid-cols-2">
        {/* Bio com correções de professor */}
        <PaperReveal>
          <p style={{ fontSize: 'var(--text-md)' }}>
            I'm João — Brazilian, brand-obsessed, and convinced that{' '}
            <span ref={circleRef} className="relative inline-block">
              strategy and craft
              {/* elipse de caneta circulando a frase, desenhada no scroll */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{ left: -10, right: -10, top: -7, bottom: -7, width: 'calc(100% + 20px)', height: 'calc(100% + 14px)' }}
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
                fill="none"
              >
                <motion.path
                  d="M16 30 C 22 8, 172 4, 186 24 C 194 46, 34 58, 14 40 C 8 34, 22 18, 40 14"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#hand-drawn)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: circleInView ? 1 : 0 }}
                  transition={{ duration: durations.draw, delay: 0.4, ease: 'easeInOut' }}
                />
              </svg>
            </span>{' '}
            are the same discipline held in one hand.
          </p>
          <p>
            Right now I lead a four-designer team at DotBrands. Before that: a creative-studio
            sprint across US &amp; LATAM tech and luxury, a typography specialization in Toronto,
            and 550+ shipped assets that taught me speed without sloppiness.
          </p>
          <p>
            Brands live or die on the gap between what a business <em>means</em> and what people{' '}
            <em>see</em>. My job is closing that gap — and teaching the team beside me to close it
            without me.
          </p>

          {/* Artefatos: post-it, carimbo de passaporte, canhoto de ingresso */}
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <motion.div
              className="sticky-note tape"
              style={{ rotate: '-2deg' }}
              whileHover={{ rotate: 0, scale: 1.04 }}
            >
              currently leading brand at{' '}
              <span style={{ textDecoration: 'underline wavy', textDecorationThickness: '1.5px' }}>
                DotBrands
              </span>
            </motion.div>

            {/* Carimbo de passaporte — idiomas */}
            <motion.div
              className="flex h-28 w-28 flex-col items-center justify-center rounded-full text-center"
              style={{
                border: '3px solid var(--accent)',
                color: 'var(--accent)',
                rotate: '8deg',
                opacity: 0.85,
                filter: 'url(#hand-drawn)',
              }}
              initial={{ scale: 1.6, opacity: 0, rotate: -4 }}
              whileInView={{ scale: 1, opacity: 0.85, rotate: 8 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={springs.wobble}
              whileHover={{ rotate: 0 }}
            >
              <span
                className="block h-full w-full rounded-full pt-5"
                style={{ border: '2px dashed var(--accent)', margin: 3 }}
              >
                <span className="block" style={{ fontSize: '0.6rem', letterSpacing: '2px', fontWeight: 'bold' }}>
                  ★ SPEAKS ★
                </span>
                <span
                  className="block font-bold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}
                >
                  PT · EN
                </span>
                <span
                  className="block font-bold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}
                >
                  · ES ·
                </span>
              </span>
            </motion.div>

            {/* Canhoto de ingresso — formação */}
            <motion.div
              className="px-5 py-3"
              style={{
                backgroundColor: 'var(--surface)',
                border: '2px dashed var(--ink)',
                borderRadius: 'var(--radius-wobbly-xs)',
                rotate: '2deg',
                boxShadow: 'var(--shadow-sketch-xs)',
              }}
              whileHover={{ rotate: -1 }}
            >
              <span
                className="text-soft block"
                style={{ fontSize: '0.6rem', letterSpacing: '2px', fontWeight: 'bold' }}
              >
                EDUCATION · ADMIT ONE
              </span>
              <span
                className="block font-bold"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}
              >
                Humber College — Toronto
              </span>
              <span className="text-soft block" style={{ fontSize: 'var(--text-sm)' }}>
                Advanced Typography · top 5% of class
              </span>
            </motion.div>
          </div>
        </PaperReveal>

        {/* Timeline que se desenha */}
        <div className="relative pl-9">
          {/* linha de lápis vertical */}
          <motion.div
            aria-hidden="true"
            className="absolute top-1 bottom-1 origin-top"
            style={{
              left: 10,
              width: 2.5,
              backgroundColor: 'var(--ink)',
              opacity: 0.4,
              filter: 'url(#hand-drawn-subtle)',
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: durations.drawSlow, ease: 'easeInOut' }}
          />

          {experience.map((entry, i) => (
            <motion.div
              key={entry.org}
              className="relative pb-9 last:pb-0"
              whileHover={{ x: 5 }}
              transition={springs.sketch}
            >
              {/* ponto da timeline pipoca quando a linha passa */}
              <motion.span
                aria-hidden="true"
                className="absolute h-3.5 w-3.5 rounded-full"
                style={{
                  left: -32,
                  top: 7,
                  border: '3px solid var(--ink)',
                  backgroundColor: entry.current ? 'var(--accent)' : 'var(--paper)',
                }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...springs.wobble, delay: 0.25 + i * 0.25 }}
              />
              <PaperReveal delay={i * 0.08}>
                <span className="timeline__date">
                  {entry.period}
                  {entry.current && (
                    <span
                      className="ml-2 px-2"
                      style={{
                        fontFamily: 'var(--font-accent)',
                        backgroundColor: 'var(--highlight)',
                        borderRadius: 'var(--radius-highlight)',
                      }}
                    >
                      ← we are here
                    </span>
                  )}
                </span>
                <h4 className="timeline__title">
                  {entry.title} · {entry.org}
                </h4>
                <p className="timeline__desc">{entry.description}</p>
              </PaperReveal>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
