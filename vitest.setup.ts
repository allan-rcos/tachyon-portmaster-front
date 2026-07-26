// ============================================================
//  Setup global da suíte.
//
//  Não há mais servidor de mock aqui. Antes, um `beforeAll` subia o MSW, que
//  interceptava `fetch` e servia uma réplica da API; hoje cada teste mocka as
//  funções do Model (ou do ViewModel) de que precisa. A consequência prática:
//  um teste falha por causa do código que ele exercita, e não por causa de um
//  clone de backend que saiu de sincronia com o real.
//
//  Nem harness de render. O `cleanup()` do `@solidjs/testing-library` saiu com
//  o Solid e não foi substituído por outro: montar um template do Lit é
//  `render(tmpl, el)` inline no teste, e desmontar é esvaziar o `<body>`.
// ============================================================
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
  // Cada teste declara os próprios retornos; zerar entre eles impede que a
  // configuração de um vaze para o seguinte.
  vi.clearAllMocks();
});
