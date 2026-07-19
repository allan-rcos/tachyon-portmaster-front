import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/** Servidor MSW usado nos testes (Node). Ligado em test/setup.ts. */
export const server = setupServer(...handlers);
