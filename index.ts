import type { ServeOptions } from 'bun';
import { access } from 'node:fs/promises';

import figlet from 'figlet';

import { roteamento } from './api';

export const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/') {
      return new Response(Bun.file('app/index.html'));
    }

    try {
      const caminho = `app/${url.pathname}`;
      await access(caminho);
      return new Response(Bun.file(caminho))
    } catch {
      if (url.pathname.startsWith('/api')) {
        return roteamento(req)
      }

      return new Response('Página não encontrada!', { status: 404 });
    }
  }
} as ServeOptions)

if (import.meta.main) {
  const banner = figlet.textSync('Bun Server', 'Small Slant');

  console.info(banner);
  console.info(`O servidor está online em\n${server.url}`);
}
