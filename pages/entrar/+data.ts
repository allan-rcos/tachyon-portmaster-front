/**
 * Trabalho de servidor de `/entrar`, resolvido ANTES do render.
 *
 * Roda nos dois lados: no servidor o HTML da primeira requisição já sai completo,
 * no cliente a mesma função vai no bundle e a navegação resolve sem requisição de
 * página. Adapta o `PageContext` do Vike ao
 * {@link "pages/pageInput" | contrato neutro} e delega ao `createXPageInput`.
 *
 * @packageDocumentation
 */
import { loadLoginPage, type LoginPageData } from '@viewmodel/auth/login-page.vm';
import { toPageRequest } from '@viewmodel/core/page/page-request';
import type { PageContextServer } from 'vike/types';

export type Data = LoginPageData;

/** Casca do Vike: adapta o PageContext e delega ao ViewModel. */
export const data = (pageContext: PageContextServer): Promise<Data> =>
  loadLoginPage(toPageRequest(pageContext));
