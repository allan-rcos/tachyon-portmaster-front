// ============================================================
//  Adia conteúdo para depois da hidratação.
//
//  No `vike-solid` isto é um componente com `<Show>` + um `staticReplace` no
//  `+config` para remover os children do bundle do servidor. Aqui é um sinal:
//  no servidor e na PRIMEIRA passada do cliente ele vale `false` — então os
//  dois emitem o mesmo `fallback` e a hidratação casa. O `onRenderClient` liga
//  o sinal logo depois, o effect raiz reavalia, e o conteúdo entra.
// ============================================================
import { signal } from 'alien-signals';

import type { Renderable } from '../types/Renderable.js';
import { getGlobalObject } from '../utils/getGlobalObject.js';

const state = getGlobalObject('ClientOnly.ts', { hydrated: signal(false) });

/** Chamado pelo `onRenderClient` depois da hidratação. Uso interno. */
export function markHydrated(): void {
  state.hydrated(true);
}

/** `true` depois que a página hidratou. Reativo. */
export function isHydrated(): boolean {
  return state.hydrated();
}

/**
 * Renderiza `fallback` no servidor e até a hidratação; `children()` depois.
 *
 * O `fallback` é obrigatório: sem ele o layout salta quando o conteúdo entra.
 * Use com parcimônia — o padrão do projeto é renderizar no servidor. Isto é
 * para o que genuinamente não existe lá (uma medida de viewport, um `<canvas>`,
 * uma API só de navegador).
 *
 * @param children Conteúdo que só pode existir no navegador. Thunk, para não
 *                 ser avaliado no servidor.
 * @param fallback O que ocupa o lugar dele até lá.
 */
export function clientOnly(children: () => Renderable, fallback: Renderable): Renderable {
  return state.hydrated() ? children() : fallback;
}
