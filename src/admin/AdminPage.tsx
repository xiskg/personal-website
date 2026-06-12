import { FloppyDisk, Plus, Trash } from '@phosphor-icons/react';
import { useState } from 'react';
import rawData from '../../content/projects.json';
import type { ProjectData } from '../data/projects';
import './admin.css';
import { saveProjects } from './api';
import { AreaField, GalleryField, ImageField, TextField } from './fields';
import { RichText } from './RichText';

const data = rawData as ProjectData[];

const BLANK: ProjectData = {
  slug: 'new-case',
  title: 'New case',
  client: '',
  year: new Date().getFullYear().toString(),
  service: 'Brand Strategy',
  tagline: '',
  thumbnail: '',
  hero: '',
  challenge: '',
  strategy: '',
  process: '',
  solution: '',
  testimonial: '',
  testimonialAuthor: '',
  gallery: [],
};

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function AdminPage() {
  const [items, setItems] = useState<ProjectData[]>(() => structuredClone(data));
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const current = items[selected];

  function update(patch: Partial<ProjectData>) {
    setItems((prev) => prev.map((it, i) => (i === selected ? { ...it, ...patch } : it)));
    setStatus('idle');
  }

  function addCase() {
    setItems((prev) => [...prev, structuredClone(BLANK)]);
    setSelected(items.length);
    setStatus('idle');
  }

  function deleteCase() {
    if (!confirm(`Delete "${current.title}"? This can't be undone after you save.`)) return;
    setItems((prev) => prev.filter((_, i) => i !== selected));
    setSelected((s) => Math.max(0, s - 1));
    setStatus('idle');
  }

  async function save() {
    setStatus('saving');
    setError('');
    try {
      await saveProjects(items);
      setStatus('saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }

  return (
    <div className="container py-10">
      {/* topo */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0" style={{ fontSize: 'var(--text-2xl)' }}>
            Case editor
          </h1>
          <span className="text-soft" style={{ fontSize: 'var(--text-sm)' }}>
            edits content/projects.json · images saved under public/cases/ · dev only
          </span>
        </div>
        <div className="flex items-center gap-3">
          {status === 'saved' && (
            <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-accent)' }}>
              saved! ✓ commit to publish
            </span>
          )}
          {status === 'error' && (
            <span style={{ color: 'var(--accent)', fontSize: 'var(--text-sm)' }}>{error}</span>
          )}
          <button
            className="btn btn--primary scribble-hover"
            onClick={save}
            disabled={status === 'saving'}
          >
            <FloppyDisk size={20} weight="bold" />
            {status === 'saving' ? 'saving…' : 'save all'}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* lista de cases */}
        <aside className="flex flex-col gap-2">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="wobbly-subtle px-3 py-2 text-left transition-all"
              style={{
                backgroundColor: i === selected ? 'var(--ink)' : 'transparent',
                color: i === selected ? 'var(--paper)' : 'var(--ink)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {it.title || it.slug || '(untitled)'}
            </button>
          ))}
          <button className="btn btn--sm btn--secondary mt-2 scribble-hover" onClick={addCase}>
            <Plus size={16} weight="bold" /> new case
          </button>
        </aside>

        {/* formulário */}
        {current && (
          <form key={selected} className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Title" value={current.title} onChange={(v) => update({ title: v })} />
              <TextField
                label="Slug (URL)"
                value={current.slug}
                onChange={(v) => update({ slug: v })}
                mono
              />
              <TextField label="Client" value={current.client} onChange={(v) => update({ client: v })} />
              <TextField label="Year" value={current.year} onChange={(v) => update({ year: v })} />
              <TextField
                label="Service"
                value={current.service}
                onChange={(v) => update({ service: v })}
              />
            </div>

            <AreaField
              label="Tagline"
              value={current.tagline}
              onChange={(v) => update({ tagline: v })}
              rows={2}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <ImageField
                label="Thumbnail"
                value={current.thumbnail}
                slug={current.slug}
                onChange={(v) => update({ thumbnail: v })}
              />
              <ImageField
                label="Hero"
                value={current.hero}
                slug={current.slug}
                onChange={(v) => update({ hero: v })}
              />
            </div>

            <hr />

            <RichText
              label="The challenge"
              value={current.challenge}
              onChange={(v) => update({ challenge: v })}
            />
            <RichText
              label="The strategy"
              value={current.strategy}
              onChange={(v) => update({ strategy: v })}
            />
            <RichText
              label="The process"
              value={current.process}
              onChange={(v) => update({ process: v })}
            />
            <RichText
              label="The solution"
              value={current.solution}
              onChange={(v) => update({ solution: v })}
            />

            <hr />

            <GalleryField
              value={current.gallery}
              slug={current.slug}
              onChange={(v) => update({ gallery: v })}
            />

            <hr />

            <AreaField
              label="Testimonial"
              value={current.testimonial}
              onChange={(v) => update({ testimonial: v })}
              rows={3}
            />
            <TextField
              label="Testimonial author"
              value={current.testimonialAuthor}
              onChange={(v) => update({ testimonialAuthor: v })}
            />

            <div className="mt-4 flex items-center justify-between">
              <a
                href={`/work/${current.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn--sm btn--secondary no-underline scribble-hover"
              >
                preview ↗ (save first)
              </a>
              <button
                type="button"
                className="btn btn--sm scribble-hover"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                onClick={deleteCase}
              >
                <Trash size={16} weight="bold" /> delete case
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
