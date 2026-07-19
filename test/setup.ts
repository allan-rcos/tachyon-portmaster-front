import '@testing-library/jest-dom/vitest';
import { cleanup } from '@solidjs/testing-library';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { resetDb } from './msw/db';
import { server } from './msw/server';

// MSW intercepta as chamadas fetch reais dos clients (o app não tem mais mocks
// embutidos). `onUnhandledRequest: 'error'` denuncia rotas /v1 não mapeadas.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Limpa o DOM, reseta os handlers e re-semeia o db in-memory entre cada teste,
// para que mutações (create/seal/load…) de um teste não vazem para o próximo.
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetDb();
});

afterAll(() => server.close());
