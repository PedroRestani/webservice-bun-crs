import { describe, test, expect } from 'bun:test';

import { server } from 'server';

const recurso = new URL('/api/pessoas', server.url);

describe('pessoas', () => {
  test('list', async () => {
    const dados = await fetch(recurso, { method: 'GET' }).then((res) => res.json());
    expect(dados).toBeArray();

    dados.forEach((dado: any) => {
      expect(dado).toBeObject();
      expect(dado).toContainKeys(['id', 'nome', 'idade', 'cidade']);
      expect(dado.id).toBeInteger();
      expect(dado.nome).toBeString();
      expect(dado.idade).toBeInteger();
      expect(dado.cidade).toBeString();
    });
  })
})