// Backend do CMS local — SOMENTE em desenvolvimento (`apply: 'serve'`).
// Em produção (vite build) este plugin nem é carregado, então o site
// publicado não tem nenhum endpoint de edição: zero superfície de ataque.
import { mkdirSync, writeFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, join } from 'node:path';
import type { Plugin } from 'vite';

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** sanitiza para evitar path traversal e nomes inválidos */
function safeSlug(s: unknown): string {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 60) || 'misc';
}

function safeName(s: unknown): string {
  const raw = String(s ?? 'image');
  const ext = (extname(raw).toLowerCase().match(/^\.[a-z0-9]{1,8}$/)?.[0]) ?? '';
  const base =
    raw
      .slice(0, raw.length - ext.length)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'img';
  return `${Date.now().toString(36)}-${base}${ext}`;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

export function cmsPlugin(): Plugin {
  let root = process.cwd();

  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url ?? '';
    if (!url.startsWith('/__cms/')) return next();

    try {
      if (url === '/__cms/save' && req.method === 'POST') {
        const json = JSON.parse((await readBody(req)).toString('utf8'));
        if (!Array.isArray(json)) throw new Error('payload deve ser um array de projetos');
        writeFileSync(join(root, 'content/projects.json'), JSON.stringify(json, null, 2) + '\n');
        return send(res, 200, { ok: true, count: json.length });
      }

      if (url === '/__cms/upload' && req.method === 'POST') {
        const slug = safeSlug(req.headers['x-slug']);
        const name = safeName(req.headers['x-filename']);
        const body = await readBody(req);
        if (body.length === 0) throw new Error('arquivo vazio');
        const dir = join(root, 'public/cases', slug);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, name), body);
        return send(res, 200, { ok: true, url: `/cases/${slug}/${name}` });
      }

      send(res, 404, { ok: false, error: 'rota não encontrada' });
    } catch (err) {
      send(res, 500, { ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  };

  return {
    name: 'cms-dev-api',
    apply: 'serve', // dev/preview apenas — fora do build de produção
    configResolved(c) {
      root = c.root;
    },
    configureServer(server) {
      server.middlewares.use(handler);
    },
  };
}
