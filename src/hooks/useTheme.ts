import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'graph' | 'blueprint';

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'graph' || stored === 'blueprint') return stored;
  // primeira visita: respeita o dark mode do sistema
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'blueprint' : 'graph';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  /** Troca o tema com reveal circular a partir do ponto clicado (MOTION.md). */
  function setTheme(next: Theme, origin?: { x: number; y: number }) {
    const doc = document as DocWithVT;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduceMotion || !origin || next === theme) {
      setThemeState(next);
      return;
    }

    const transition = doc.startViewTransition(() => {
      flushSync(() => setThemeState(next));
    });

    transition.ready.then(() => {
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        { duration: 550, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }

  return { theme, setTheme };
}
