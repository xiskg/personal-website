import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { Link, Navigate, useParams } from 'react-router';
import { PaperReveal } from '../components/PaperReveal';
import { projects, type Project } from '../data/projects';
import { sizedImage } from '../lib/img';
import { springs } from '../lib/motion';

const SECTIONS: { label: string; field: keyof Project }[] = [
  { label: 'The challenge', field: 'challenge' },
  { label: 'The strategy', field: 'strategy' },
  { label: 'The process', field: 'process' },
  { label: 'The solution', field: 'solution' },
];

/* Posições variadas das figuras (fotos espalhadas na mesa, não em régua):
   alternam entre o centro do vão e o canto, com alturas e tamanhos próprios */
const FIGURE_LAYOUT = [
  // Imagem 1 (A de cima na foto): Puxada para a esquerda para invadir o gap
  { className: 'lg:w-72 lg:justify-self-start lg:-ml-12 lg:mt-4', rotate: '-4deg', origin: 'center' },
  
  // Imagem 2 (A de baixo na foto): Puxada ainda MAIS para a esquerda para dar dinamismo
  { className: 'lg:w-80 lg:justify-self-start lg:-ml-28 lg:mt-12', rotate: '3deg', origin: 'bottom right' },
  
  // Imagem 3 (Assumindo que há uma terceira na rolagem): Mantendo a invasão do centro
  { className: 'lg:w-72 lg:justify-self-start lg:-ml-16 lg:mt-16', rotate: '-6deg', origin: 'center' },
  
  // Imagem 4: Um pouco mais recuada para parecer bagunçado
  { className: 'lg:w-80 lg:justify-self-start lg:-ml-20 lg:mt-10', rotate: '5deg', origin: 'top left' },
];

/** Polaroid de imagem do case — expande no hover para visualização. */
function CaseFigure({
  src,
  alt,
  caption,
  rotate,
  origin = 'center right',
  className = '',
}: {
  src: string;
  alt: string;
  caption: string;
  rotate: string;
  origin?: string;
  className?: string;
}) {
  return (
    <motion.figure
      className={`tape relative m-0 cursor-zoom-in p-3 pb-2 ${className}`}
      style={{
        backgroundColor: 'var(--paper)',
        border: 'var(--border-width) solid var(--ink)',
        borderRadius: 'var(--radius-wobbly-sm)',
        boxShadow: 'var(--shadow-sketch-md)',
        rotate,
        zIndex: 20,
        transformOrigin: origin,
        // layer GPU própria: o Safari compõe o scale em vez de re-rasterizar
        willChange: 'transform',
      }}
      whileHover={{ scale: 1.45, rotate: 0 }}
      transition={springs.sketch}
    >
      <img
        src={sizedImage(src, 1024)}
        alt={alt}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover"
        style={{ border: '2px solid var(--ink)', backfaceVisibility: 'hidden' }}
      />
      <figcaption
        className="pt-2 text-center"
        style={{ fontFamily: 'var(--font-accent)', fontSize: 'var(--text-sm)' }}
      >
        {caption}
      </figcaption>
    </motion.figure>
  );
}

/** Card de navegação para o case anterior/seguinte. */
function CaseNavCard({ project, dir }: { project: Project; dir: 'prev' | 'next' }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className={`card card--hoverable no-underline flex items-center gap-4 p-5 ${
        dir === 'next' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {dir === 'prev' ? (
        <ArrowLeft size={26} weight="bold" style={{ color: 'var(--accent)' }} className="shrink-0" />
      ) : (
        <ArrowRight size={26} weight="bold" style={{ color: 'var(--accent)' }} className="shrink-0" />
      )}
      <span
        className={`hidden w-20 shrink-0 p-1 sm:block ${dir === 'next' ? '-rotate-2' : 'rotate-2'}`}
        style={{
          backgroundColor: 'var(--paper)',
          border: '2px solid var(--ink)',
          borderRadius: 'var(--radius-wobbly-xs)',
          boxShadow: 'var(--shadow-sketch-xs)',
        }}
      >
        <img
          src={sizedImage(project.thumbnail, 320)}
          alt=""
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
          style={{ border: '1.5px solid var(--ink)' }}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="text-soft block"
          style={{ fontFamily: 'var(--font-accent)', fontSize: 'var(--text-sm)' }}
        >
          {dir === 'prev' ? 'previous case' : 'next case'}
        </span>
        <span
          className="block truncate font-bold"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}
        >
          {project.title}
        </span>
      </span>
    </Link>
  );
}

export function CasePage() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);

  if (index === -1) return <Navigate to="/" replace />;

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  // galeria sem a hero (que já abre a página): 4 primeiras ao lado das
  // seções, o resto vai para a grade "more from the case files"
  const figures = project.gallery.filter((url) => url !== project.hero);
  const sectionImages = SECTIONS.map((_, s) => figures[s]);
  const extraImages = figures.slice(SECTIONS.length);

  return (
    <article className="py-10" key={project.slug}>
      {/* topo: voltar + posição no caderno */}
      <div className="flex items-center justify-between gap-4">
        <Link to="/#work" className="btn btn--sm btn--secondary no-underline scribble-hover">
          <ArrowLeft size={16} weight="bold" /> back to the desk
        </Link>
        <span className="text-soft" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
          case {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      {/* cabeçalho do case */}
      <PaperReveal>
        <header className="mt-12 max-w-(--container-narrow)">
          <span
            className="block"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--accent)',
              fontSize: 'var(--text-md)',
              rotate: '-1deg',
              width: 'max-content',
              maxWidth: '100%',
            }}
          >
            {project.service} · {project.client} · {project.year}
          </span>
          <h1 className="mt-2 mb-4">{project.title}</h1>
          <p className="text-soft m-0 max-w-[58ch]" style={{ fontSize: 'var(--text-md)' }}>
            {project.tagline}
          </p>
        </header>
      </PaperReveal>

      {/* hero: foto grande colada com fita */}
      <PaperReveal delay={0.1}>
        <div
          className="tape relative mt-12 p-2 md:p-3"
          style={{
            backgroundColor: 'var(--paper)',
            border: 'var(--border-width) solid var(--ink)',
            borderRadius: 'var(--radius-wobbly-sm)',
            filter: 'url(#hand-drawn)',
            boxShadow: 'var(--shadow-sketch-lg)',
            rotate: '0.4deg',
          }}
        >
          <img
            src={sizedImage(project.hero, 1600)}
            alt={project.heroAlt}
            className="aspect-[16/9] w-full object-cover"
            style={{ border: '2px solid var(--ink)' }}
          />
        </div>
      </PaperReveal>

      {/* corpo do case: prosa à esquerda, polaroid da galeria à direita */}
      {SECTIONS.map(({ label, field }, i) => {
        const img = sectionImages[i];
        const layout = FIGURE_LAYOUT[i % FIGURE_LAYOUT.length];
        return (
          <PaperReveal key={field}>
            <section className="mt-16 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
              <div className="max-w-(--container-narrow)">
                <h2>{label}</h2>
                <div
                  className="case-prose"
                  // HTML vindo do nosso próprio CMS (content/projects.json)
                  dangerouslySetInnerHTML={{ __html: project[field] }}
                />
              </div>

              {img && (
                <CaseFigure
                  src={img}
                  alt={`${project.title} — ${label}`}
                  caption={`fig. ${String(i + 1).padStart(2, '0')} — from the case files`}
                  rotate={layout.rotate}
                  origin={layout.origin}
                  className={`w-full max-w-xs lg:max-w-none ${layout.className}`}
                />
              )}
            </section>
          </PaperReveal>
        );
      })}

      {/* imagens restantes da galeria */}
      {extraImages.length > 0 && (
        <PaperReveal>
          <section className="mt-20">
            <h2>More from the case files</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {extraImages.map((img, n) => (
                <CaseFigure
                  key={img}
                  src={img}
                  alt={`${project.title} — gallery`}
                  caption={`fig. ${String(SECTIONS.length + n + 1).padStart(2, '0')}`}
                  rotate={n % 2 === 0 ? '-1.5deg' : '1.5deg'}
                  origin="center"
                />
              ))}
            </div>
          </section>
        </PaperReveal>
      )}

      {/* depoimento: bilhete do cliente */}
      {project.testimonial && (
        <PaperReveal>
          <aside
            className="tape relative mt-20 max-w-2xl p-8 md:p-10"
            style={{
              backgroundColor: 'var(--paper)',
              border: 'var(--border-width) solid var(--ink)',
              borderRadius: 'var(--radius-wobbly)',
              filter: 'url(#hand-drawn)',
              boxShadow: 'var(--shadow-sketch-md)',
              rotate: '-0.6deg',
              backgroundImage: 'linear-gradient(var(--paper-line) 1px, transparent 1px)',
              backgroundSize: '100% 34px',
            }}
          >
            <p
              className="m-0"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--leading-snug)',
              }}
            >
              {project.testimonial}
            </p>
            <p
              className="mt-5 mb-0"
              style={{ fontFamily: 'var(--font-accent)', color: 'var(--accent)', rotate: '-1deg', width: 'max-content', maxWidth: '100%' }}
            >
              — {project.testimonialAuthor}
            </p>
          </aside>
        </PaperReveal>
      )}

      {/* navegação entre cases */}
      <nav aria-label="Other cases" className="mt-20 grid gap-6 sm:grid-cols-2">
        <CaseNavCard project={prev} dir="prev" />
        <CaseNavCard project={next} dir="next" />
      </nav>
    </article>
  );
}
