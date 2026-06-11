# Personal Website & Portfolio

A highly interactive, sketch-styled personal portfolio built with **React 19**, **Framer Motion**, and **Tailwind CSS**. This project focuses on a unique "hand-drawn" aesthetic, combining technical performance with creative design.

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fgithub.com%2Fxiskg%2Fpersonal-website)](https://github.com/xiskg/personal-website)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Design Philosophy

The site employs a **Sketch-Core** aesthetic, simulating a designer's sketchbook. 
- **Pencil Textures**: Custom SVG filters to create organic, hand-drawn edges.
- **Dynamic Motion**: Fluid transitions using Framer Motion that mimic paper reveals and pencil strokes.
- **Interactive "Draw Mode"**: Specialized components that respond to user interaction with drawing metaphors.

## 🛠️ Technical Stack

- **Framework**: [React 19](https://react.dev/) (Functional components, Hooks)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Motion (formerly Framer Motion)](https://motion.dev/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Type Safety**: TypeScript

## 📂 Project Architecture

```text
src/
├── components/      # Atomic UI units (Hero, Nav, DrawMode, etc.)
├── hooks/           # Custom React hooks (e.g., useTheme)
├── pages/           # High-level page layouts (Home, Case Studies)
├── lib/             # Shared utility configurations (Motion variants)
├── styles/          # Global CSS and Tailwind directives
└── data/            # Static content and profile definitions
```

## 🚀 Key Features

- **Paper Reveal Transitions**: Unique page transitions that look like unfolding paper.
- **Pencil Progress Indicator**: A creative scroll progress bar styled as a pencil.
- **Sketch Filters**: Global SVG filters applied to UI elements to maintain the hand-drawn look.
- **Responsive & Accessible**: Optimized for all devices with a focus on semantic HTML.

## ⌨️ Development

### Setup
```bash
# Clone the repository
git clone https://github.com/xiskg/personal-website.git

# Install dependencies
npm install
```

### Commands
- `npm run dev`: Starts the development server.
- `npm run build`: Generates a production-ready build.
- `npm run preview`: Previews the production build locally.

---

Designed and Developed by **xiskg**.
