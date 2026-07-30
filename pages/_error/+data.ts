/**
 * Trabalho de servidor de `catch-all de erro`, resolvido ANTES do render.
 *
 * Roda nos dois lados: no servidor o HTML da primeira requisição já sai completo,
 * no cliente a mesma função vai no bundle e a navegação resolve sem requisição de
 * página. Adapta o `PageContext` do Vike ao
 * {@link "pages/pageInput" | contrato neutro} e delega ao `createXPageInput`.
 *
 * @packageDocumentation
 */
import { loadErrorPage, type ErrorPageData } from '@viewmodel/core/error-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';

export type Data = ErrorPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Data =>
  loadErrorPage(toPageRequest(pageContext));
