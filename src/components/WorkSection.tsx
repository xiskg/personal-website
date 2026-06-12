import { ArrowUpRight } from '@phosphor-icons/react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { projects } from '../data/projects';
import { sizedImage } from '../lib/img';
import { springs } from '../lib/motion';
import { PaperReveal } from './PaperReveal';
import { SectionHeader } from './SectionHeader';

/* Bordas rasgadas (jagged paths irregulares, preenchidas com a cor da tira) */
const TORN_TOP =
  'M0 22 L0 11 L38 16 L74 5 L120 13 L164 4 L212 15 L260 7 L302 16 L354 6 L400 14 L452 8 L506 17 L550 5 L602 12 L656 6 L702 15 L756 8 L806 16 L852 5 L906 13 L954 7 L1002 15 L1050 6 L1102 14 L1152 8 L1200 12 L1200 22 Z';
const TORN_BOTTOM =
  'M0 0 L1200 0 L1200 10 L1162 16 L1118 7 L1064 15 L1010 5 L956 13 L900 7 L848 16 L794 9 L740 15 L688 5 L640 14 L588 8 L532 16 L488 6 L430 13 L378 5 L324 14 L272 8 L220 15 L170 6 L118 13 L66 5 L24 12 L0 8 Z';

/** A seção mais importante: uma tira de papel pautado rasgada de outro
 *  caderno e colada com fita por cima do papel da página. */
export function WorkSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 250, damping: 25 });
  const y = useSpring(rawY, { stiffness: 250, damping: 25 });

  const project = hovered !== null ? projects[hovered] : null;

  return (
    <section
      id="work"
      className="relative my-12"
      style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        // tom da tira: papel levemente "sujo" de tinta — outro caderno
        ['--work-paper' as string]: 'color-mix(in srgb, var(--ink) 5%, var(--paper))',
      }}
      onMouseMove={(e) => {
        rawX.set(e.clientX);
        rawY.set(e.clientY);
      }}
    >
      {/* fitas adesivas segurando a tira */}
      <span
        aria-hidden="true"
        className="absolute z-10 hidden md:block"
        style={{
          top: 6,
          left: '11%',
          width: 92,
          height: 26,
          backgroundColor: 'var(--highlight)',
          opacity: 0.8,
          transform: 'rotate(-4deg)',
          borderLeft: '1px dashed rgba(0, 0, 0, 0.12)',
          borderRight: '1px dashed rgba(0, 0, 0, 0.12)',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute z-10 hidden md:block"
        style={{
          top: 4,
          right: '9%',
          width: 92,
          height: 26,
          backgroundColor: 'var(--highlight)',
          opacity: 0.8,
          transform: 'rotate(3deg)',
          borderLeft: '1px dashed rgba(0, 0, 0, 0.12)',
          borderRight: '1px dashed rgba(0, 0, 0, 0.12)',
        }}
      />

      {/* borda rasgada superior */}
      <svg
        aria-hidden="true"
        className="block w-full"
        height="22"
        viewBox="0 0 1200 22"
        preserveAspectRatio="none"
      >
        <path d={TORN_TOP} style={{ fill: 'var(--work-paper)' }} />
      </svg>

      {/* a tira de papel pautado */}
      <div
        className="py-14"
        style={{
          backgroundColor: 'var(--work-paper)',
          backgroundImage: 'linear-gradient(var(--paper-line) 1.5px, transparent 1.5px)',
          backgroundSize: '100% 30px',
        }}
      >
        <div className="container">
          <SectionHeader kicker="the work" title="Selected projects" />

          <PaperReveal>
            <div onMouseLeave={() => setHovered(null)}>
              {projects.map((p, i) => (
                <Link
                  key={p.slug}
                  to={`/work/${p.slug}`}
                  className="no-underline group relative grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 border-b-3 border-dashed py-6 md:gap-7"
                  style={{ borderColor: 'var(--paper-line)' }}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                >
                  {/* marca-texto riscando a linha no hover */}
                  <AnimatePresence>
                    {hovered === i && (
                      <motion.span
                        className="absolute -inset-x-3 inset-y-4"
                        style={{
                          // sem filter url(): bug de região de filtro do Safari
                          // espalha o amarelo pelo fundo em elementos grandes
                          backgroundColor: 'var(--highlight)',
                          borderRadius: 'var(--radius-highlight)',
                          originX: 0,
                          rotate: '-0.4deg',
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>

                  <span
                    className="relative"
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: 'var(--text-md)',
                      color: 'var(--accent)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}.
                  </span>

                  {/* mini-polaroid sempre visível (imagem em destaque do projeto) */}
                  <span
                    className={`relative block w-24 shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-0 sm:w-32 md:w-36 ${
                      i % 2 === 0 ? 'rotate-2' : '-rotate-2'
                    }`}
                  >
                    <span
                      className="block p-1.5"
                      style={{
                        backgroundColor: 'var(--paper)',
                        border: '2px solid var(--ink)',
                        borderRadius: 'var(--radius-wobbly-xs)',
                        boxShadow: 'var(--shadow-sketch-xs)',
                      }}
                    >
                      <span
                        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
                        style={{ backgroundColor: 'var(--surface)', border: '1.5px solid var(--ink)' }}
                      >
                        {p.thumbnail ? (
                          <img
                            src={sizedImage(p.thumbnail, 640)}
                            alt={p.thumbnailAlt}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <svg
                              className="absolute inset-0 h-full w-full"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              style={{ stroke: 'var(--paper-line)', strokeWidth: 2 }}
                            >
                              <line x1="0" y1="0" x2="100" y2="100" />
                              <line x1="100" y1="0" x2="0" y2="100" />
                            </svg>
                            <span
                              className="relative font-bold"
                              style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}
                            >
                              {p.title[0]}
                            </span>
                            <span
                              className="absolute top-1 right-1 h-2 w-2 rounded-full"
                              style={{ backgroundColor: p.pen, border: '1.5px solid var(--ink)' }}
                            />
                          </>
                        )}
                      </span>
                    </span>
                    {/* fitinha */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2"
                      style={{
                        backgroundColor: 'var(--highlight)',
                        opacity: 0.8,
                        transform: 'translateX(-50%) rotate(-3deg)',
                        borderLeft: '1px dashed rgba(0, 0, 0, 0.12)',
                        borderRight: '1px dashed rgba(0, 0, 0, 0.12)',
                      }}
                    />
                  </span>

                  <span className="relative min-w-0">
                    <span
                      className="block leading-tight font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.6rem, 4.2vw, 2.6rem)',
                      }}
                    >
                      {p.title}
                    </span>
                    <span className="text-soft block" style={{ fontSize: 'var(--text-sm)' }}>
                      {p.service} · {p.client} · {p.year}
                    </span>
                  </span>

                  <ArrowUpRight
                    size={30}
                    weight="bold"
                    className="relative transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: 'var(--accent)' }}
                  />
                </Link>
              ))}
            </div>
          </PaperReveal>
        </div>
      </div>

      {/* borda rasgada inferior, com sombra caindo na página */}
      <svg
        aria-hidden="true"
        className="block w-full"
        height="22"
        viewBox="0 0 1200 22"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 3px 0 color-mix(in srgb, var(--ink) 12%, transparent))' }}
      >
        <path d={TORN_BOTTOM} style={{ fill: 'var(--work-paper)' }} />
      </svg>

      {/* Polaroid que persegue o cursor (fora de qualquer ancestral com transform) */}
      <AnimatePresence>
        {project && (
          <motion.div
            key={project.slug}
            className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:block"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: hovered! % 2 === 0 ? 3 : -3 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={springs.wobble}
          >
            <div
              className="tape relative w-60 p-3 pb-2"
              style={{
                translate: '28px -105%',
                backgroundColor: 'var(--paper)',
                border: 'var(--border-width) solid var(--ink)',
                borderRadius: 'var(--radius-wobbly-sm)',
                boxShadow: 'var(--shadow-sketch-md)',
              }}
            >
              <div
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
                style={{
                  border: '2px solid var(--ink)',
                  borderRadius: 'var(--radius-wobbly-xs)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                {project.thumbnail ? (
                  <img
                    src={sizedImage(project.thumbnail, 640)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      style={{ stroke: 'var(--paper-line)', strokeWidth: 1.5 }}
                    >
                      <line x1="0" y1="0" x2="100" y2="100" />
                      <line x1="100" y1="0" x2="0" y2="100" />
                    </svg>
                    <span
                      className="relative font-bold"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '3.4rem' }}
                    >
                      {project.title[0]}
                    </span>
                    <span
                      className="absolute top-2 right-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: project.pen, border: '2px solid var(--ink)' }}
                    />
                  </>
                )}
              </div>
              <p
                className="m-0 pt-2 text-center"
                style={{ fontFamily: 'var(--font-accent)', fontSize: 'var(--text-sm)' }}
              >
                open the case study ✏️
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
