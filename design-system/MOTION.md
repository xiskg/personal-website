# Paper Sketch — Motion Spec

Complemento do [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Define como as coisas se movem.
Stack de animação: **Motion** (`motion/react`, ex-Framer Motion) + CSS para microinterações simples.

## Princípio central

> **"A página está sendo desenhada agora."**

Todo movimento imita um gesto físico de papel e caneta: **desenhar** (traço que se traça), **carimbar** (badge que bate no papel), **colar** (card que assenta), **descolar** (post-it que levanta), **virar página** (transição de rota/tema). Fades e slides genéricos são proibidos — se o movimento não tem metáfora física, não entra.

## Regras (o que mantém "stunning" sem virar circo)

1. **Hierarquia de intensidade.** Três camadas:
   - *Ambient* — sutil, barata, em tudo (hover de botões/tags, links).
   - *Micro* — feedback de interação (tap, toggle, focus).
   - *Wow* — no máximo **3 momentos** por página: hero, troca de tema e draw-on das seções. Wow em tudo = wow em nada.
2. **Entradas acontecem uma vez** (`whileInView` + `once: true`), 300–600ms, springs levemente saltitantes. Scroll pra cima não re-anima.
3. **Só `transform`, `opacity` e `pathLength`** em animações. Nunca animar width/height/box-shadow em loop.
4. **Cuidado com os filtros SVG**: `feTurbulence` é caro. Não animar dimensões de elementos filtrados; `transform` neles é ok. O `scribble-vibe` infinito é **hover-only**, nunca idle.
5. **`prefers-reduced-motion`**: base.css já mata animações CSS; nos componentes Motion, usar `useReducedMotion()` e degradar para fade simples.

## Tokens de movimento (JS)

```ts
// design-system/motion.ts (criar no scaffold)
export const springs = {
  sketch: { type: 'spring', stiffness: 380, damping: 22 },  // micro: taps, toggles
  paper:  { type: 'spring', stiffness: 160, damping: 18 },  // entradas: cards, seções
  wobble: { type: 'spring', stiffness: 300, damping: 9 },   // brincalhão: badge, post-it
} as const;

export const durations = {
  draw: 0.6,      // sublinhados, traços curtos
  drawSlow: 1.2,  // doodles grandes, setas
  reveal: 0.45,   // entradas de seção
} as const;
```

## Catálogo por componente

| Elemento | Animação (metáfora) | Gatilho | Camada |
|---|---|---|---|
| Sublinhado do h2 | se **desenha** da esquerda pra direita (`pathLength` / `scaleX`) | `whileInView` | wow |
| Hero: título | palavras surgem em sequência + marca-texto **passa** por cima (scaleX, origin left) | load | wow |
| Hero: badge | **carimbo**: scale 1.4→1 + rotate -6°→-2° (spring wobble) | load | wow |
| Troca de tema | **circular reveal** a partir do botão (View Transitions API, fallback: crossfade) | click | wow |
| Seções | **papel colado**: y 24→0, rotate -1°→0, opacity (spring paper) | `whileInView` | micro |
| Botões | CSS já levanta/pressiona; adicionar `whileTap` squish scale 0.96 | tap | micro |
| Tags de skill | **wiggle**: rotate ±3° (spring wobble) | hover | ambient |
| Sticky note | **descola**: rotate origin-top + sombra cresce | hover | ambient |
| Card com fita | **balanço pendular** leve (rotate oscila e assenta) | hover | ambient |
| Skill meter | fill 0→N% (já tem transition; disparar via `whileInView`) | `whileInView` | micro |
| Stat card | **count-up** do número | `whileInView` | micro |
| Rotas/páginas | **folha que desliza** sobre a anterior (`AnimatePresence`) | navegação | micro |
| Doodles de fundo | setas/rabiscos SVG **se traçam** conforme o scroll (`useScroll` + `pathLength`) | scroll-linked | wow (usar pouco) |
| Ícones Phosphor | leve rotate/scale no hover do pai | hover | ambient |

## Easter egg (diferencial)

O protótipo em `DESIGN/app.js` já tem um **canvas de desenho funcional** (lápis, marca-texto, borracha, cores). Vira easter egg do portfolio: um botãozinho "✏️ rabisque aqui" no footer ativa o modo desenho sobre a página. Recrutador desenha bigode no seu avatar e nunca mais esquece o site. Custo: ~zero (código pronto, só portar).

## Backlog (avaliar depois, não no MVP)

- Cursor custom de lápis com "rastro de grafite" (canvas leve) — testar performance antes.
- Som de papel/lápis em interações (off por padrão, sempre).
