// https://vike.dev/onRenderClient
export { onRenderClient };

import { hydrate } from '@lit-labs/ssr-client';
import type { OnRenderClientAsync, PageContextClient } from 'vike/types';

import { markHydrated } from '../components/ClientOnly.js';
import { mountRoot } from '../lib/renderRoot.js';
import type { PageContextInternal } from '../types/PageContext.js';
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js';
import { getHeadSetting } from './getHeadSetting.js';
import { getPageView } from './getPageElement.js';
import { applyHeadSettings } from './applyHeadSettings.js';

// Mesmo desenho do vike-solid: estado de módulo guardando o descarte do render
// anterior, para a navegação client-side não deixar duas páginas montadas.
const state = getGlobalState();

const onRenderClient: OnRenderClientAsync = async (
  pageContext: PageContextClient & PageContextInternal,
): ReturnType<OnRenderClientAsync> => {
  pageContext._headAlreadySet = pageContext.isHydration;

  const container = document.getElementById('root');
  if (!container) throw new Error('[vike-lit] <div id="root"> não encontrado.');

  // A fábrica roda aqui, uma vez por página — é ela que constrói o ViewModel.
  const view = getPageView(pageContext);

  // Descarta o laço da página anterior ANTES de montar a próxima.
  state.dispose?.();

  if (!state.rendered && pageContext.isHydration && container.innerHTML !== '') {
    // Hidratação: reassocia as expressões do template ao DOM que veio do
    // servidor, usando os marcadores `<!--lit-part-->`. Precisa do MESMO
    // template e dos MESMOS dados do SSR — o que é garantido por `+data`
    // atravessar serializado e a fábrica ser determinística.
    hydrate(view(), container);
  }

  state.dispose = mountRoot(view, container);
  state.rendered = true;

  // Só depois do primeiro render: antes disso o `clientOnly` precisa continuar
  // devolvendo o fallback, senão a hidratação não casa com o HTML do servidor.
  markHydrated();

  if (!pageContext.isHydration) {
    pageContext._headAlreadySet = true;
    applyHead(pageContext);
  }

  // Use cases:
  // - Custom user settings: https://vike.dev/head-tags#custom-settings
  // - Testing tools
  await callCumulativeHooks(pageContext.config.onAfterRenderClient, pageContext);
};

function applyHead(pageContext: PageContextClient) {
  const title = getHeadSetting<string | null>('title', pageContext);
  const lang = getHeadSetting<string | null>('lang', pageContext);
  applyHeadSettings(title, lang);
}

interface RenderState {
  rendered: boolean;
  dispose?: () => void;
}
function getGlobalState(): RenderState {
  const key = '_vike_lit_onRenderClient';
  const holder = globalThis as unknown as Record<string, RenderState | undefined>;
  return (holder[key] ??= { rendered: false });
}
