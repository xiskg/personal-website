import { useEffect } from 'react';

// Microsoft Clarity — heatmaps + gravações de sessão. O id é público (vai no
// HTML), então fica no código. Pode ser sobrescrito por env var se um dia
// trocar o projeto do Clarity.
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID ?? 'x60q0k28w0';

/** Carrega o Clarity SOMENTE em produção, então seus acessos de desenvolvimento
 *  não poluem as métricas.
 *
 *  O Cloudflare Web Analytics NÃO entra aqui de propósito: quando habilitado no
 *  painel do Cloudflare Pages, o beacon é injetado automaticamente. Adicioná-lo
 *  também no código duplicaria a contagem. */
export function Analytics() {
  useEffect(() => {
    if (!import.meta.env.PROD || !CLARITY_ID) return;
    if (document.getElementById('ms-clarity')) return;

    const s = document.createElement('script');
    s.id = 'ms-clarity';
    s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`;
    document.head.appendChild(s);
  }, []);

  return null;
}
