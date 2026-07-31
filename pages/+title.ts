/**
 * O `<title>` de cada rota. Lê `data.meta`, que o `createXPageInput` já
 * resolveu no locale da requisição — o Vike exige valor de config serializável,
 * por isso o código mora em arquivo próprio em vez de `+config.js`.
 *
 * @packageDocumentation
 */
import type { PageMeta } from '@viewmodel/core/page/page-request';
import type { PageContext } from 'vike/types';

const DEFAULT_TITLE = 'Tachyon PortMaster';

/**
 * `<title>` de toda rota, a partir de UMA origem: o `data.meta` que o
 * `createXPageInput` resolveu no locale da requisição.
 *
 * Mora em arquivo próprio, e não no `+config.js`, porque o Vike exige que
 * valores de config sejam serializáveis — código roda em `+title.ts`.
 * O `vike-solid` usa isto para emitir `<title>` e `og:title`.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function title(pageContext: PageContext): string {
  const meta = (pageContext.data as { meta?: PageMeta } | undefined)?.meta;
  return meta?.title ? `${meta.title} — PortMaster` : DEFAULT_TITLE;
}
