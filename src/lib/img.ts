/** Dimensiona imagens do CDN do Framer pelo contexto de uso.
 *  As originais vêm em 2000px+/2.5MB — servir no tamanho certo corta
 *  decode e custo de composição de layer (jank de scale no Safari). */
export function sizedImage(url: string, width: number): string {
  if (!url || !url.includes('framerusercontent.com')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}scale-down-to=${width}`;
}
