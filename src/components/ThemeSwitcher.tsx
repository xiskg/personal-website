import { Moon, Sun } from '@phosphor-icons/react';
import type { Theme } from '../hooks/useTheme';

interface Props {
  theme: Theme;
  onChange: (theme: Theme, origin: { x: number; y: number }) => void;
}

/** Toggle papel quadriculado ↔ blueprint (dark mode), com reveal circular. */
export function ThemeSwitcher({ theme, onChange }: Props) {
  const isBlueprint = theme === 'blueprint';

  return (
    <button
      title={isBlueprint ? 'Back to paper' : 'To the drafting table'}
      aria-label={isBlueprint ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={(e) => onChange(isBlueprint ? 'graph' : 'blueprint', { x: e.clientX, y: e.clientY })}
      className="wobbly-subtle flex h-9 w-9 cursor-pointer items-center justify-center transition-transform hover:scale-110"
      style={{ color: 'var(--ink)', backgroundColor: 'transparent' }}
    >
      {isBlueprint ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
    </button>
  );
}
