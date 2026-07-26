import type { PageMeta } from '@viewmodel/core/page/page-request';
import type { JSX } from 'solid-js';
import { usePageContext } from 'vike-solid/usePageContext';

const DEFAULT_DESCRIPTION = 'Sistema de Alocação de Contêineres e Carga';

/**
 * `<head>` global e ÚNICO `+Head` — o Vike acumula `+Head` pela árvore de
 * diretórios, e manter um só é o que evita `<title>` duplicado.
 *
 * O texto vem de UMA origem: `data.meta`, que o `createXPageInput` da rota
 * resolveu no locale do request. Antes havia duas — um `config.routeMeta` para
 * as rotas de /painel (que renderizavam no navegador e não tinham `+data`) e o
 * `data` para as públicas. Com todas as rotas em `+data`, a bifurcação e os 15
 * `+routeMeta.ts` deixaram de existir.
 *
 * App autenticada → `noindex`.
 */
export default function Head(): JSX.Element {
  const pageContext = usePageContext();

  const meta = (): PageMeta | undefined =>
    (pageContext.data as { meta?: PageMeta } | undefined)?.meta;

  const title = () => {
    const value = meta()?.title;
    return value ? `${value} — PortMaster` : 'Tachyon PortMaster';
  };

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="color-scheme" content="dark" />
      <meta name="robots" content="noindex" />
      <title>{title()}</title>
      <meta name="description" content={meta()?.description ?? DEFAULT_DESCRIPTION} />
    </>
  );
}
