import { ArrowLeft, ArrowRight, Trash, UploadSimple } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { uploadImage } from './api';

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="input-wrapper">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={mono ? { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' } : undefined}
        />
      </div>
    </label>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {hint && (
        <span className="text-soft mb-1 block" style={{ fontSize: 'var(--text-xs)' }}>
          {hint}
        </span>
      )}
      <div className="input-wrapper">
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </label>
  );
}

/** Miniatura de imagem (aceita URL externa ou caminho local /cases/...). */
function Thumb({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        border: '2px solid var(--ink)',
        borderRadius: 'var(--radius-wobbly-xs)',
      }}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-soft" style={{ fontSize: 'var(--text-xs)' }}>
          empty
        </span>
      )}
    </span>
  );
}

/** Campo de imagem única: preview + upload local + URL editável. */
export function ImageField({
  label,
  value,
  slug,
  onChange,
}: {
  label: string;
  value: string;
  slug: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await uploadImage(file, slug));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-start gap-3">
        <Thumb src={value} className="h-20 w-24 shrink-0" />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="btn btn--sm btn--secondary scribble-hover"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <UploadSimple size={16} weight="bold" /> {busy ? 'uploading…' : 'upload'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <div className="input-wrapper mt-2">
            <input
              value={value}
              placeholder="/cases/… or https://…"
              onChange={(e) => onChange(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>
          {err && (
            <span style={{ color: 'var(--accent)', fontSize: 'var(--text-xs)' }}>{err}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Galeria: lista de imagens com upload múltiplo, reordenar e remover. */
export function GalleryField({
  value,
  slug,
  onChange,
}: {
  value: string[];
  slug: string;
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadImage(file, slug));
      onChange([...value, ...urls]);
    } finally {
      setBusy(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="field-label mb-0">Gallery ({value.length})</span>
        <button
          type="button"
          className="btn btn--sm btn--secondary scribble-hover"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <UploadSimple size={16} weight="bold" /> {busy ? 'uploading…' : 'add images'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => add(e.target.files)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="flex flex-col gap-1">
            <Thumb src={url} className="aspect-[4/3] w-full" />
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                className="btn btn--icon btn--sm"
                onClick={() => move(i, -1)}
                title="move left"
              >
                <ArrowLeft size={14} weight="bold" />
              </button>
              <button
                type="button"
                className="btn btn--icon btn--sm"
                onClick={() => move(i, 1)}
                title="move right"
              >
                <ArrowRight size={14} weight="bold" />
              </button>
              <button
                type="button"
                className="btn btn--icon btn--sm"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                onClick={() => onChange(value.filter((_, n) => n !== i))}
                title="remove"
              >
                <Trash size={14} weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
