import { Check, EnvelopeSimple, LinkedinLogo, PencilSimple, Scissors } from '@phosphor-icons/react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { profile } from '../data/profile';
import { durations, springs } from '../lib/motion';
import { PaperReveal } from './PaperReveal';
import { SectionHeader } from './SectionHeader';

/** Contato como carta: linha de recorte, papel pautado, selo, assinatura,
 *  e um aviãozinho de papel levando a carta embora. */
export function ContactSection() {
  // gatilho de visibilidade num elemento HTML: o Safari não dispara
  // IntersectionObserver/whileInView em filhos de SVG (<path>, <g>)
  const planeRef = useRef<HTMLDivElement>(null);
  const planeInView = useInView(planeRef, { once: true, margin: '-100px' });

  return (
    <section id="contact" className="pb-16">
      {/* linha de recorte separando da seção anterior */}
      <div
        aria-hidden="true"
        className="relative mb-16 flex items-center"
        style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
      >
        <div
          className="w-full"
          style={{
            borderTop: '3px dashed var(--ink)',
            opacity: 0.3,
            filter: 'url(#hand-drawn-subtle)',
          }}
        />
        <Scissors
          size={26}
          className="absolute left-[10%] px-0.5"
          style={{
            color: 'var(--ink-soft)',
            backgroundColor: 'var(--paper)',
            transform: 'rotate(90deg)',
          }}
        />
      </div>

      <SectionHeader kicker="contact" title="Let's put pencil to paper" />

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,42rem)_1fr]">
        <PaperReveal>
          <motion.div
            className="tape relative p-8 pt-10 md:p-10"
            style={{
              backgroundColor: 'var(--paper)',
              border: 'var(--border-width) solid var(--ink)',
              borderRadius: 'var(--radius-wobbly)',
              filter: 'url(#hand-drawn)',
              boxShadow: 'var(--shadow-sketch-lg)',
              rotate: '0.6deg',
              backgroundImage: 'linear-gradient(var(--paper-line) 1px, transparent 1px)',
              backgroundSize: '100% 34px',
            }}
            whileHover={{ rotate: 0 }}
          >
            {/* selo postal + carimbo de correio */}
            <div aria-hidden="true" className="absolute top-6 right-6 hidden sm:block">
              <div
                className="flex h-20 w-16 p-1.5"
                style={{
                  border: '2px dashed var(--ink)',
                  backgroundColor: 'var(--surface)',
                  transform: 'rotate(3deg)',
                }}
              >
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-1"
                  style={{ border: '1.5px solid var(--ink)' }}
                >
                  <PencilSimple size={20} style={{ color: 'var(--ink)' }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '1.5px',
                      color: 'var(--ink)',
                    }}
                  >
                    BRASIL
                  </span>
                </div>
              </div>
              <div
                className="absolute top-0 -left-11 h-16 w-16 rounded-full"
                style={{
                  border: '2.5px solid var(--ink-soft)',
                  opacity: 0.5,
                  transform: 'rotate(-12deg)',
                  filter: 'url(#hand-drawn)',
                }}
              />
              <svg
                className="absolute top-7 -left-20 w-16"
                viewBox="0 0 60 20"
                fill="none"
                style={{ opacity: 0.45 }}
              >
                <path
                  d="M2 3 Q 9 0 16 3 T 30 3 T 44 3 T 58 3 M2 10 Q 9 7 16 10 T 30 10 T 44 10 T 58 10 M2 17 Q 9 14 16 17 T 30 17 T 44 17 T 58 17"
                  stroke="var(--ink-soft)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p
              className="mb-5"
              style={{ fontFamily: 'var(--font-accent)', fontSize: 'var(--text-lg)' }}
            >
              Dear future partner,
            </p>

            <p className="max-w-[46ch]" style={{ fontSize: 'var(--text-md)' }}>
              If you've got a brand that deserves better than a template, I'd love to hear about
              it. I'm open for select projects and full-time opportunities — anywhere paper and
              pixels reach.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <motion.a
                href={`mailto:${profile.email}`}
                className="btn btn--primary btn--lg no-underline scribble-hover"
                whileTap={{ scale: 0.96 }}
              >
                <EnvelopeSimple size={22} weight="bold" /> Write back
              </motion.a>
              <motion.a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn btn--secondary no-underline scribble-hover"
                whileTap={{ scale: 0.96 }}
              >
                <LinkedinLogo size={20} weight="bold" /> LinkedIn
              </motion.a>
            </div>

            <p
              className="mt-8 mb-0"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'var(--text-xl)',
                rotate: '-2deg',
                width: 'max-content',
              }}
            >
              — {profile.name}
            </p>

            <p className="text-soft mt-5 mb-0" style={{ fontSize: 'var(--text-sm)' }}>
              P.S. — replies come in PT, EN or ES. Pick your favorite.
            </p>
          </motion.div>
        </PaperReveal>

        {/* a carta indo embora: avião no alto à direita, infos ancoradas na base */}
        <div ref={planeRef} className="hidden h-full flex-col justify-between gap-8 lg:flex">
          <svg viewBox="0 0 320 240" fill="none" className="w-full max-w-72 self-end">
            <motion.path
              d="M14 228 C 80 200, 56 124, 128 92 S 240 64, 282 36"
              stroke="var(--ink-soft)"
              strokeWidth="2.5"
              strokeDasharray="2 12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: planeInView ? 1 : 0 }}
              transition={{ duration: durations.drawSlow, ease: 'easeInOut' }}
            />
            <motion.g
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              animate={
                planeInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.4 }
              }
              transition={{ ...springs.wobble, delay: durations.drawSlow }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <path
                d="M308 12 L236 50 L264 62 Z"
                fill="var(--surface)"
                stroke="var(--ink)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#hand-drawn-subtle)"
              />
              <path
                d="M308 12 L264 62 L260 86 L272 66 Z"
                fill="var(--surface)"
                stroke="var(--ink)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#hand-drawn-subtle)"
              />
            </motion.g>
          </svg>

          <div>
            <p
              className="mb-1"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'var(--text-md)',
                rotate: '-1deg',
                width: 'max-content',
              }}
            >
              allergic to buttons? plain old email:
            </p>
            <a href={`mailto:${profile.email}`} style={{ fontSize: 'var(--text-md)' }}>
              {profile.email}
            </a>

            {/* checklist do que escrever */}
            <div className="mt-8 max-w-xs">
            <p
              className="mb-3"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'var(--text-md)',
                rotate: '-1deg',
                width: 'max-content',
              }}
            >
              what to scribble in it:
            </p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {[
                'the brand & the problem it has',
                'a rough timeline',
                'budget ballpark — sketchy is fine',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="wobbly-subtle relative inline-flex h-5 w-5 shrink-0 items-center justify-center"
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    <Check
                      size={20}
                      weight="bold"
                      className="absolute -top-1.5 left-0.5"
                      style={{ color: 'var(--accent)', transform: 'rotate(-6deg)' }}
                    />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
