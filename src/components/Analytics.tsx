import { useEffect } from 'react';

// Microsoft Clarity — heatmaps + gravações de sessão. O id é público (vai no
// HTML), então fica no código. Pode ser sobrescrito por env var se um dia
// trocar o projeto do Clarity.
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID ?? 'x60q0k28w0';

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/** Carrega o Clarity SOMENTE em produção, então seus acessos de desenvolvimento
 *  não poluem as métricas.
 *
 *  Também marca a ORIGEM da visita: um link com `?ref=cv` (no currículo),
 *  `?ref=linkedin`, etc. vira uma etiqueta no Clarity, persistida na sessão
 *  inteira — assim dá pra filtrar "quem chegou pelo CV" mesmo depois de a
 *  pessoa navegar para outras páginas.
 *
 *  O Cloudflare Web Analytics NÃO entra aqui de propósito: quando habilitado no
 *  painel do Cloudflare Pages, o beacon é injetado automaticamente. Adicioná-lo
 *  também no código duplicaria a contagem. */
export function Analytics() {
  useEffect(() => {
    if (!import.meta.env.PROD || !CLARITY_ID) return;

    if (!document.getElementById('ms-clarity')) {
      const s = document.createElement('script');
      s.id = 'ms-clarity';
      s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`;
      document.head.appendChild(s);
    }

    // Origem da visita: lê ?ref= (ou ?utm_source=), guarda na sessão e etiqueta
    // o Clarity. sessionStorage faz a etiqueta sobreviver à navegação SPA.
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get('ref') ?? params.get('utm_source');
    if (incoming) sessionStorage.setItem('visit-ref', incoming.slice(0, 40));

    const ref = sessionStorage.getItem('visit-ref');
    if (ref) window.clarity?.('set', 'ref', ref);
  }, []);

  return null;
}
