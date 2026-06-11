// Tokens de movimento — ver design-system/MOTION.md
export const springs = {
  /** micro: taps, toggles */
  sketch: { type: 'spring', stiffness: 380, damping: 22 },
  /** entradas: cards, seções ("papel colado") */
  paper: { type: 'spring', stiffness: 160, damping: 18 },
  /** brincalhão: badge, post-it, tags */
  wobble: { type: 'spring', stiffness: 300, damping: 9 },
} as const;

export const durations = {
  draw: 0.6,
  drawSlow: 1.2,
  reveal: 0.45,
} as const;
