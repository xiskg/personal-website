// "CMS" de projetos: a fonte de conteúdo é content/projects.json,
// editado pelo painel /admin (somente em desenvolvimento).
import data from '../../content/projects.json';

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  service: string;
  tagline: string;
  thumbnail: string;
  hero: string;
  /** HTML (parágrafos) editados no painel */
  challenge: string;
  strategy: string;
  process: string;
  solution: string;
  testimonial: string;
  testimonialAuthor: string;
  /** URLs/caminhos das imagens da galeria, em ordem */
  gallery: string[];
  /** derivados/atribuídos em runtime (não ficam no JSON) */
  thumbnailAlt: string;
  heroAlt: string;
  pen: string;
}

export type ProjectData = Omit<Project, 'thumbnailAlt' | 'heroAlt' | 'pen'>;

const PEN_COLORS = ['var(--pen-green)', 'var(--pen-blue)', 'var(--pen-red)', 'var(--pen-yellow)'];

export const projects: Project[] = (data as ProjectData[]).map((p, i) => ({
  ...p,
  thumbnailAlt: p.title,
  heroAlt: p.title,
  pen: PEN_COLORS[i % PEN_COLORS.length],
}));
