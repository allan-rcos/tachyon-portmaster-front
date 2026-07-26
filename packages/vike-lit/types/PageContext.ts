import type { ConfigFromHookResolved, PageFactory, Stream } from './Config.js';

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      /**
       * A fábrica da página — o default export de `+Page.ts`.
       *
       * Diferente do `vike-solid` (onde `Page` é um componente), aqui ela é
       * chamada UMA vez por página e devolve o thunk do template. É o que
       * permite construir o ViewModel uma única vez, fora do laço de render.
       */
      Page?: PageFactory;
    }
  }
}

// Mantém o arquivo como módulo mesmo sendo só declaração global.
export const global = null;

// Internal usage
export type PageContextInternal = {
  _configFromHook?: ConfigFromHookResolved;
  _headAlreadySet?: boolean;
  _stream?: Stream;
};
