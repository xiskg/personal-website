import { Compass, Ear, PaperPlaneTilt, PenNib } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { processSteps } from '../data/profile';
import { springs } from '../lib/motion';
import { CountUp } from './CountUp';
import { PaperReveal } from './PaperReveal';
import { SectionHeader } from './SectionHeader';

const STEP_ICONS = [Ear, Compass, PenNib, PaperPlaneTilt];

/** O método em 4 passos interativos — absorve skills e métricas do CV
 *  para dentro do contexto de cada passo. */
export function ProcessSection() {
  const [active, setActive] = useState(0);
  const step = processSteps[active];
  const Icon = STEP_ICONS[active];

  return (
    <section id="method" className="py-16">
      <SectionHeader kicker="the method" title="How a brand happens here" />

      <PaperReveal>
        <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
          {/* Navegação dos passos */}
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
            {processSteps.map((s, i) => (
              <button
                key={s.num}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className="wobbly-subtle flex cursor-pointer items-baseline gap-3 px-4 py-3 text-left transition-all"
                style={{
                  backgroundColor: active === i ? 'var(--surface)' : 'transparent',
                  borderColor: active === i ? 'var(--ink)' : 'transparent',
                  boxShadow: active === i ? 'var(--shadow-sketch-xs)' : 'none',
                  opacity: active === i ? 1 : 0.55,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-accent)',
                    color: 'var(--accent)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  {s.num}
                </span>
                <span
                  className="font-bold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}
                >
                  {s.name}
                </span>
              </button>
            ))}
          </div>

          {/* Card do passo ativo — re-"colado" a cada troca */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.num}
              className="card min-h-[320px]"
              initial={{ opacity: 0, y: 18, rotate: -1.2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -10, rotate: 0.8 }}
              transition={springs.paper}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="wobbly-subtle flex h-12 w-12 items-center justify-center"
                      style={{
                        backgroundColor: 'var(--paper)',
                        boxShadow: 'var(--shadow-sketch-xs)',
                      }}
                    >
                      <Icon size={26} weight="duotone" style={{ color: 'var(--accent)' }} />
                    </span>
                    <h3 className="m-0">{step.title}</h3>
                  </div>
                  <p className="max-w-[52ch]" style={{ fontSize: 'var(--text-md)' }}>
                    {step.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {step.skills.map((skill) => (
                      <motion.span key={skill} className="tag" whileHover={{ rotate: -3 }}>
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Métrica carimbada */}
                <div
                  className="wobbly-subtle px-5 py-3 text-center"
                  style={{
                    borderColor: 'var(--accent)',
                    rotate: '-2deg',
                    boxShadow: '3px 3px 0 var(--accent)',
                  }}
                >
                  <div
                    className="font-bold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-2xl)',
                      color: 'var(--accent)',
                      lineHeight: 1,
                    }}
                  >
                    <CountUp
                      value={step.metric.value}
                      prefix={step.metric.prefix}
                      suffix={step.metric.suffix}
                    />
                  </div>
                  <div className="text-soft mt-1 max-w-[18ch]" style={{ fontSize: 'var(--text-sm)' }}>
                    {step.metric.label}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </PaperReveal>
    </section>
  );
}
