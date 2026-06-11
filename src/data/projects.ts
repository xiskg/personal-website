// "CMS" de projetos: a fonte de conteúdo é content/projects.json
// (export do Framer CMS). Para atualizar o site, substitua o JSON.
import raw from '../../content/projects.json';

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  service: string;
  tagline: string;
  thumbnail: string;
  thumbnailAlt: string;
  hero: string;
  heroAlt: string;
  link: string;
  /** HTML vindos do CMS */
  challenge: string;
  strategy: string;
  process: string;
  solution: string;
  testimonial: string;
  testimonialAuthor: string;
  /** "Main Gallery" do CMS, em ordem */
  gallery: string[];
  /** cor de caneta do projeto (atribuída ciclicamente, não vem do CMS) */
  pen: string;
}

const PEN_COLORS = ['var(--pen-green)', 'var(--pen-blue)', 'var(--pen-red)', 'var(--pen-yellow)'];

export const projects: Project[] = raw.map((r, i) => ({
  slug: r.Slug,
  title: r.Title,
  client: r.Client,
  year: r.Year,
  service: r.Service,
  tagline: r.Tagline,
  thumbnail: r.Thumbnail?.url ?? '',
  thumbnailAlt: r.Title,
  hero: r.Hero?.url ?? '',
  heroAlt: r.Title,
  link: r.Link,
  challenge: r['The Challenge'],
  strategy: r['The Strategy'],
  process: r['The Process'],
  solution: r['The Solution'],
  testimonial: r.Testimonial,
  testimonialAuthor: r['Testimonial Author'],
  gallery: (r['Main Gallery'] ?? [])
    .map((g) => g.Image?.url)
    .filter((url): url is string => Boolean(url)),
  pen: PEN_COLORS[i % PEN_COLORS.length],
}));
