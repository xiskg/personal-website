# Paper Sketch — Visual System

Sistema visual completo no estilo **"paper sketch / hand-drawn wireframe"**, extraído e expandido a partir do protótipo em `DESIGN/`. Tudo parece desenhado a lápis em papel de caderno: bordas tremidas, sombras duras, marca-texto, fontes manuscritas.

## Princípios

1. **Tudo é desenhado, nada é renderizado.** Bordas wobbly, sombras sem blur (offset duro = sombra de lápis), preenchimentos por hachura — nunca gradientes suaves ou glassmorphism.
2. **O papel é o fundo.** A página sempre tem textura (grade/pauta + ruído de fibra). Superfícies elevadas (`--surface`) são "papéis colados por cima".
3. **Tinta única + 1 destaque.** Quase tudo usa `--ink`. A cor `--accent` é caneta vermelha do professor: aparece pouco e por isso chama atenção.
4. **Interação física.** Hover levanta o papel (sombra cresce), clique pressiona (sombra encolhe), elementos vibram como rabisco (`scribble-vibe`).
5. **Imperfeição proposital.** Rotações leves (`tilt-*`), post-its tortos, fita adesiva. Nada perfeitamente alinhado demais.

## Arquivos

| Arquivo | Papel |
|---|---|
| `tokens.css` | Variáveis: cores por tema, tipografia, espaçamento, bordas, sombras, z-index |
| `base.css` | Reset, textura de papel, tipografia global, utilitários (`.wobbly`, `.highlight`, `.tape`…) |
| `components.css` | Componentes: botões, cards, tags, forms, nav, timeline, skill meter, footer… |
| `index.css` | Entry point — importa tudo + Google Fonts |
| `filters.svg` | Filtros SVG **obrigatórios** (efeito de traço à mão) |
| `styleguide.html` | Styleguide vivo — abra no navegador para ver tudo |

## Como usar

### HTML puro
```html
<link rel="stylesheet" href="design-system/index.css">
<!-- cole o conteúdo de filters.svg logo após <body> -->
```

### React (próxima etapa)
```jsx
// main.jsx
import './design-system/index.css';

// App.jsx — renderize os filtros uma vez, no topo do root:
// crie um componente <SketchFilters /> com o conteúdo de filters.svg
```

> ⚠️ **Os filtros SVG são obrigatórios.** Sem `#hand-drawn-subtle`, `#hand-drawn` e `#hand-drawn-heavy` no DOM, as bordas saem retas (o estilo morre). Filtros aplicados via `filter: url(#id)` exigem o SVG no mesmo documento.

## Temas

Aplicar via atributo no `<html>` (ou `<body>`):

```html
<html data-theme="graph">      <!-- creme quadriculado (default) -->
<html data-theme="notepad">    <!-- bloco amarelo pautado -->
<html data-theme="blueprint">  <!-- azul de prancheta -->
<html data-theme="dark">       <!-- sketchbook carvão -->
```

Todos os tokens semânticos se adaptam automaticamente:

| Token | Uso |
|---|---|
| `--paper` | fundo da página |
| `--ink` | texto, bordas, sombras |
| `--ink-soft` | texto secundário |
| `--accent` | destaque (links ativos, números, CTAs) |
| `--highlight` | marca-texto |
| `--surface` | fundo de cards |
| `--paper-line` / `--paper-margin` | linhas do papel |
| `--hover-wash` | lavagem de hover |
| `--pen-red/green/blue/yellow` | cores funcionais fixas |

## Tipografia

| Token | Fonte | Uso |
|---|---|---|
| `--font-display` | Architects Daughter | h1–h6, logo, números |
| `--font-body` | Patrick Hand | texto corrido |
| `--font-accent` | Gochi Hand | kickers, anotações, datas, tooltips |
| `--font-mono` | Fira Code | código (único elemento "digital") |

Escala: `--text-xs` (0.8rem) → `--text-hero` (clamp responsivo). Corpo base 1.125rem — fontes manuscritas pedem tamanho maior.

## Receita do estilo (DNA)

Qualquer elemento novo deve seguir esta anatomia:

```css
.novo-elemento {
  border: var(--border-width) solid var(--ink);
  border-radius: var(--radius-wobbly);      /* assimétrico = traço à mão */
  filter: url(#hand-drawn);                 /* tremor de turbulência */
  box-shadow: var(--shadow-sketch-md);      /* sombra dura de lápis */
  background-color: var(--surface);
}
.novo-elemento:hover {
  transform: translate(-2px, -2px);         /* levanta */
  box-shadow: var(--shadow-sketch-hover);
}
.novo-elemento:active {
  transform: translate(2px, 2px);           /* pressiona */
  box-shadow: var(--shadow-sketch-pressed);
}
```

Intensidade do filtro por tamanho do elemento:
- **`#hand-drawn-subtle`** — pequenos: tags, inputs, ícones, botões sm
- **`#hand-drawn`** — médios/grandes: cards, header, painéis
- **`#hand-drawn-heavy`** — decorativos: marca-texto, sublinhados, rabiscos

## Componentes disponíveis

**Núcleo:** `.btn` (`--primary`, `--secondary`, `--accent`, `--ghost`, `--icon`, `--sm`, `--lg`) · `.card` (`--hoverable`, `--flat`) · `.badge` · `.tag` (`--accent`, `--filled`) · `.input-wrapper` · `.switch` · `.nav-header` · `.footer`

**Portfolio:** `.project-card` (thumb com diagonais de wireframe, tags, footer de links) · `.stat-card` · `.timeline` (experiência) · `.skill-meter` (barra hachurada) · `.avatar` · `.sticky-note` · `.section-header` (kicker manuscrito + título sublinhado)

**Utilitários:** `.wobbly` / `.wobbly-subtle` · `.highlight` (marca-texto) · `.underline-sketch` · `.tape` (fita adesiva) · `.tilt-left/right` · `.scribble-hover` · `.tooltip[data-tip]` · `.sketch-line` · `.container`

## Acessibilidade

- `:focus-visible` com contorno tracejado na cor accent
- `::selection` vira marca-texto
- `prefers-reduced-motion` desliga todas as animações
- Contraste: `--ink` sobre `--paper` passa AA em todos os temas

## Próximas etapas (combinadas)

1. ✅ Visual system completo ← **você está aqui**
2. Scaffold do projeto React (Vite) importando o sistema
3. Componentes React (`<SketchFilters/>`, `<Button/>`, `<ProjectCard/>`…)
4. Páginas/seções do portfolio (hero, projetos, sobre, contato)
