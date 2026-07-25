// ============================================================
//  Setup global da suíte.
//
//  Não há mais servidor de mock aqui. Antes, um `beforeAll` subia o MSW, que
//  interceptava `fetch` e servia uma réplica da API; hoje cada teste mocka as
//  funções do Model (ou do ViewModel) de que precisa. A consequência prática:
//  um teste falha por causa do código que ele exercita, e não por causa de um
//  clone de backend que saiu de sincronia com o real.
// ============================================================
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@solidjs/testing-library';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  // Cada teste declara os próprios retornos; zerar entre eles impede que a
  // configuração de um vaze para o seguinte.
  vi.clearAllMocks();
});
