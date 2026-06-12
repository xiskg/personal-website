import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { DrawMode } from './components/DrawMode';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { ParallaxDoodles } from './components/ParallaxDoodles';
import { PencilProgress } from './components/PencilProgress';
import { SketchFilters } from './components/SketchFilters';
import { useTheme } from './hooks/useTheme';
import { CasePage } from './pages/CasePage';
import { HomePage } from './pages/HomePage';

// Painel do CMS carregado sob demanda (dev only): mantém o TipTap e todo o
// editor fora do bundle principal de produção (vira um chunk separado).
const AdminPage = lazy(() => import('./admin/AdminPage').then((m) => ({ default: m.AdminPage })));

/** Rola para a âncora do hash (ex.: /#work) ou para o topo a cada rota. */
function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export default function App() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [drawing, setDrawing] = useState(false);

  // Painel do CMS: só existe em desenvolvimento. Em produção este ramo é
  // eliminado no build (import.meta.env.DEV → false), saindo do bundle.
  if (import.meta.env.DEV && location.pathname === '/admin') {
    return (
      <div className="relative">
        <SketchFilters />
        <Suspense fallback={<div className="container py-10 text-soft">loading editor…</div>}>
          <AdminPage />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="relative">
      <SketchFilters />
      <ParallaxDoodles />
      <PencilProgress />
      <ScrollManager />
      <Nav theme={theme} onThemeChange={setTheme} />
      <main className="container relative z-(--z-base)">
        <Routes>
          <Route path="/" element={<HomePage onPickPencil={() => setDrawing(true)} />} />
          <Route path="/work/:slug" element={<CasePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </main>
      <DrawMode
        active={drawing}
        onOpen={() => setDrawing(true)}
        onClose={() => setDrawing(false)}
        theme={theme}
      />
    </div>
  );
}
