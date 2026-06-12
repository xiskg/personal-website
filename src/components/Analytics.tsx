import { useEffect } from 'react';

const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;
const CF_TOKEN = import.meta.env.VITE_CF_BEACON_TOKEN;

/** Injeta os analytics SOMENTE em produção e SOMENTE se os IDs existirem
 *  (configurados como env vars no Cloudflare Pages). Em dev/local não roda,
 *  então seus próprios acessos de desenvolvimento não poluem as métricas. */
export function Analytics() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;

    // Microsoft Clarity — heatmaps + gravações de sessão
    if (CLARITY_ID && !document.getElementById('ms-clarity')) {
      const s = document.createElement('script');
      s.id = 'ms-clarity';
      s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`;
      document.head.appendChild(s);
    }

    // Cloudflare Web Analytics — métricas sem cookie (spa: rastreia troca de rota)
    if (CF_TOKEN && !document.getElementById('cf-beacon')) {
      const s = document.createElement('script');
      s.id = 'cf-beacon';
      s.defer = true;
      s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_TOKEN, spa: true }));
      document.head.appendChild(s);
    }
  }, []);

  return null;
}
