import { resolveBrowserLocale, resolveLocale } from '@viewmodel/core/i18n/locale';
import type { PageMeta } from '@viewmodel/core/page/page-request';
import type { VMContext } from '@viewmodel/core/page/vm-context';
import type { JSX } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

// Script anti-FOUC: lê o cookie `flow-theme` e aplica `data-theme`
// antes da primeira pintura. Tema padrão = escuro (sem atributo).
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )flow-theme=([^;]+)/);var t=m?decodeURIComponent(m[1]):'dark';if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

const DEFAULT_DESCRIPTION = 'Sistema de Alocação de Contêineres e Carga';

/**
 * `<head>` global e ÚNICO `+Head` — o Vike acumula `+Head` pela árvore de
 * diretórios, e manter um só é o que evita `<title>` duplicado.
 *
 * O texto vem de duas origens, nesta ordem:
 *  1. `config.routeMeta` — as rotas de /painel, que renderizam no navegador e
 *     por isso não têm `+data`;
 *  2. `data.title/description` — as rotas públicas, que seguem em SSR com
 *     dados (é onde o SEO importa).
 *
 * App autenticada → `noindex`.
 */
export default function Head(): JSX.Element {
  const pageContext = usePageContext();

  const meta = (): PageMeta | undefined => {
    const config = pageContext.config as { routeMeta?: (context: VMContext) => PageMeta };
    if (config.routeMeta) {
      const headers = (pageContext as { headers?: unknown }).headers;
      const locale =
        headers === undefined || headers === null
          ? resolveBrowserLocale()
          : resolveLocale(headers as Parameters<typeof resolveLocale>[0]);
      return config.routeMeta({ locale });
    }
    return pageContext.data as PageMeta | undefined;
  };

  const title = () => {
    const value = meta()?.title;
    return value ? `${value} — PortMaster` : 'Tachyon PortMaster';
  };

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="color-scheme" content="dark light" />
      <meta name="robots" content="noindex" />
      <title>{title()}</title>
      <meta name="description" content={meta()?.description ?? DEFAULT_DESCRIPTION} />
      <script innerHTML={themeScript} />
    </>
  );
}
