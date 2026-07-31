/**
 * Trabalho de servidor de `/info`, resolvido ANTES do render.
 *
 * Roda nos dois lados: no servidor o HTML da primeira requisição já sai completo,
 * no cliente a mesma função vai no bundle e a navegação resolve sem requisição de
 * página. Adapta o `PageContext` do Vike ao
 * {@link "pages/pageInput" | contrato neutro} e delega ao `createXPageInput`.
 *
 * @packageDocumentation
 */
import { createSystemInfoPageInput } from '@viewmodel/system/system-info-page.vm';
import type { PageContext } from 'vike/types';

import { toPageInput } from '@/pages/pageInput';

export { data };

async function data(pageContext: PageContext) {
  // O `Promise.resolve` daqui saiu junto com a integração do `GET /info`: a rota
  // agora busca o painel do backend, então já devolve uma promessa de verdade.
  return toPageInput(pageContext, createSystemInfoPageInput);
}
