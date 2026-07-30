import type { PageMeta } from '@viewmodel/core/page/page-request';
import type { PageContext } from 'vike/types';

const DEFAULT_DESCRIPTION = 'Sistema de Alocação de Contêineres e Carga';

/**
 * `<meta name="description">` de toda rota. Mesma origem do `+title.ts`.
 *
 * @param pageContext Contexto da requisição, dado pelo Vike.
 */
export default function description(pageContext: PageContext): string {
  const meta = (pageContext.data as { meta?: PageMeta } | undefined)?.meta;
  return meta?.description ?? DEFAULT_DESCRIPTION;
}
