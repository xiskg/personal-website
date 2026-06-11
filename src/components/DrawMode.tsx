import {
  Eraser,
  HighlighterCircle,
  PencilSimple,
  Trash,
  X,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Theme } from '../hooks/useTheme';
import { springs } from '../lib/motion';

type Tool = 'pencil' | 'highlighter' | 'eraser';

interface Stroke {
  tool: Tool;
  /** 'ink' resolve a cor do tema na hora de desenhar — traços acompanham o tema */
  pen: 'ink' | string;
  points: { x: number; y: number }[];
}

interface Props {
  active: boolean;
  onOpen: () => void;
  onClose: () => void;
  theme: Theme;
}

const PENS: { id: 'ink' | string; swatch: string }[] = [
  { id: 'ink', swatch: 'var(--ink)' },
  { id: '#ff4757', swatch: '#ff4757' },
  { id: '#2ed573', swatch: '#2ed573' },
  { id: '#1e90ff', swatch: '#1e90ff' },
];

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function pencilCursor(light: boolean) {
  const color = light ? '%23fff' : '%23000';
  // hotspot em (2,22): a ponta desenhada do lápis no viewBox — não o canto
  // da imagem — para o traço nascer exatamente onde a ponta encosta
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'%3E%3C/path%3E%3C/svg%3E") 2 22, crosshair`;
}

/** Modo desenho: a página inteira vira papel desenhável (easter egg do protótipo). */
export function DrawMode({ active, onOpen, onClose, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [pen, setPen] = useState<'ink' | string>('ink');

  const inkNow = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#000';

  const applyStyle = useCallback((ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = 26;
      ctx.globalAlpha = 1;
    } else if (stroke.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle =
        stroke.pen === 'ink' ? 'rgba(255, 235, 59, 0.4)' : hexToRgba(stroke.pen, 0.35);
      ctx.lineWidth = 18;
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.pen === 'ink' ? inkNow() : stroke.pen;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.85;
    }
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // traços guardados em coordenadas do documento; a "câmera" segue o scroll
    ctx.setTransform(1, 0, 0, 1, -window.scrollX, -window.scrollY);
    for (const stroke of strokes.current) {
      if (stroke.points.length < 2) continue;
      applyStyle(ctx, stroke);
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }, [applyStyle]);

  // re-renderiza no scroll para os traços ficarem ancorados na página
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        redraw();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [redraw]);

  // Dimensiona o canvas e redesenha em resize / troca de tema
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [redraw]);

  useEffect(() => {
    redraw();
  }, [theme, redraw]);

  // ESC sai do modo desenho
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onClose]);

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = e.currentTarget.getContext('2d');
    if (!ctx) return;
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    current.current = { tool, pen, points: [{ x, y }] };
    applyStyle(ctx, current.current);
    ctx.setTransform(1, 0, 0, 1, -window.scrollX, -window.scrollY);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!current.current) return;
    const ctx = e.currentTarget.getContext('2d');
    if (!ctx) return;
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    current.current.points.push({ x, y });
    // estilo e transform reaplicados a cada move: um redraw disparado por
    // scroll no meio do traço reseta o estado do contexto
    applyStyle(ctx, current.current);
    ctx.setTransform(1, 0, 0, 1, -window.scrollX, -window.scrollY);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleUp = () => {
    if (current.current && current.current.points.length > 1) {
      strokes.current.push(current.current);
    }
    current.current = null;
  };

  const clear = () => {
    strokes.current = [];
    redraw();
  };

  const lightCursor = theme === 'blueprint';

  const toolBtn = (t: Tool, icon: React.ReactNode, label: string) => (
    <button
      key={t}
      title={label}
      aria-label={label}
      aria-pressed={tool === t}
      onClick={() => setTool(t)}
      className="wobbly-subtle flex h-9 w-9 cursor-pointer items-center justify-center transition-transform hover:scale-110"
      style={{
        backgroundColor: tool === t ? 'var(--ink)' : 'transparent',
        color: tool === t ? 'var(--paper)' : 'var(--ink)',
      }}
    >
      {icon}
    </button>
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-(--z-overlay)"
        style={{
          pointerEvents: active ? 'auto' : 'none',
          touchAction: active ? 'none' : 'auto',
          cursor: active ? pencilCursor(lightCursor) : 'default',
        }}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />

      {/* Botão flutuante "pegar o lápis" */}
      <AnimatePresence>
        {!active && (
          <motion.button
            key="pencil-fab"
            title="Doodle on this page"
            aria-label="Doodle on this page"
            onClick={onOpen}
            className="btn btn--icon scribble-hover fixed right-5 bottom-5 z-(--z-nav) h-12 w-12"
            style={{ backgroundColor: 'var(--surface)', backdropFilter: 'blur(2px)' }}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={springs.wobble}
          >
            <PencilSimple size={22} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Paleta de ferramentas */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="toolbar"
            className="fixed bottom-6 left-1/2 z-(--z-modal) flex flex-col items-center gap-2"
            initial={{ y: 90, x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: 120, x: '-50%' }}
            transition={springs.paper}
          >
            <span
              className="px-3 py-1"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: 'var(--text-sm)',
                color: 'var(--paper)',
                backgroundColor: 'var(--ink)',
                borderRadius: 'var(--radius-wobbly-sm)',
                rotate: '-1.5deg',
              }}
            >
              doodle anywhere · esc to put the pencil down
            </span>
            <div
              className="wobbly flex items-center gap-2 px-4 py-3"
              style={{
                backgroundColor: 'var(--surface)',
                backdropFilter: 'blur(3px)',
                boxShadow: 'var(--shadow-sketch-md)',
              }}
            >
              {toolBtn('pencil', <PencilSimple size={18} weight="bold" />, 'Pencil')}
              {toolBtn('highlighter', <HighlighterCircle size={18} weight="bold" />, 'Highlighter')}
              {toolBtn('eraser', <Eraser size={18} weight="bold" />, 'Eraser')}

              <span className="mx-1 h-7 border-l-2 border-dashed" style={{ borderColor: 'var(--paper-line)' }} />

              {PENS.map((p) => (
                <button
                  key={p.id}
                  title={p.id === 'ink' ? 'Ink' : p.id}
                  aria-label={`Pen color ${p.id}`}
                  onClick={() => setPen(p.id)}
                  className="h-5 w-5 cursor-pointer rounded-full border-2 transition-transform hover:scale-125"
                  style={{
                    backgroundColor: p.swatch,
                    borderColor: 'var(--ink)',
                    boxShadow:
                      pen === p.id ? '0 0 0 2px var(--paper), 0 0 0 4px var(--accent)' : 'none',
                  }}
                />
              ))}

              <span className="mx-1 h-7 border-l-2 border-dashed" style={{ borderColor: 'var(--paper-line)' }} />

              <button
                title="Clear sketches"
                aria-label="Clear sketches"
                onClick={clear}
                className="wobbly-subtle flex h-9 w-9 cursor-pointer items-center justify-center transition-transform hover:scale-110"
                style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
              >
                <Trash size={18} weight="bold" />
              </button>
              <button
                title="Done drawing"
                aria-label="Done drawing"
                onClick={onClose}
                className="wobbly-subtle flex h-9 w-9 cursor-pointer items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)' }}
              >
                <X size={18} weight="bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
