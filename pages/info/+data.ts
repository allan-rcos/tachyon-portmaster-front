import { createSystemInfoPageInput } from '@viewmodel/system/system-info-page.vm';
import type { PageContext } from 'vike/types';

import { toPageInput } from '@/pages/pageInput';

export { data };

async function data(pageContext: PageContext) {
  // O `Promise.resolve` daqui saiu junto com a integração do `GET /info`: a rota
  // agora busca o painel do backend, então já devolve uma promessa de verdade.
  return toPageInput(pageContext, createSystemInfoPageInput);
}
