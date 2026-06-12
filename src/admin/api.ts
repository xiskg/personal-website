import type { ProjectData } from '../data/projects';

/** Salva todo o array de projetos em content/projects.json (dev only). */
export async function saveProjects(projects: ProjectData[]): Promise<number> {
  const res = await fetch('/__cms/save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(projects),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? 'falha ao salvar');
  return json.count as number;
}

/** Sobe uma imagem para public/cases/<slug>/ e devolve o caminho público. */
export async function uploadImage(file: File, slug: string): Promise<string> {
  const res = await fetch('/__cms/upload', {
    method: 'POST',
    headers: { 'x-slug': slug || 'misc', 'x-filename': file.name },
    body: file,
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? 'falha no upload');
  return json.url as string;
}
