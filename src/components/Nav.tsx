import { PencilLine } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { profile } from '../data/profile';
import type { Theme } from '../hooks/useTheme';
import { ThemeSwitcher } from './ThemeSwitcher';

interface Props {
  theme: Theme;
  onThemeChange: (theme: Theme, origin: { x: number; y: number }) => void;
}

export function Nav({ theme, onThemeChange }: Props) {
  return (
    <header className="nav-header">
      <div className="nav-header__inner">
        <Link to="/" className="nav-logo no-underline">
          <PencilLine size={24} className="sketchy-icon" weight="bold" />
          {profile.name}
          <span className="accent">.</span>
        </Link>

        <nav className="nav-links max-md:hidden">
          <Link to="/#work" className="nav-link no-underline">Work</Link>
          <Link to="/#method" className="nav-link no-underline">Method</Link>
          <Link to="/#about" className="nav-link no-underline">About</Link>
          <Link to="/#contact" className="nav-link no-underline">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeSwitcher theme={theme} onChange={onThemeChange} />
          <motion.a
            href={`mailto:${profile.email}`}
            className="btn btn--primary btn--sm no-underline scribble-hover max-sm:hidden"
            whileTap={{ scale: 0.96 }}
          >
            Start a project
          </motion.a>
        </div>
      </div>
    </header>
  );
}
