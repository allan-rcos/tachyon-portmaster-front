// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
import type { AccountProfile } from './domain';
import { accountMessages } from './i18n/account-page.messages';
import type { AccountPageText } from './i18n/account-page.messages';
import { getAccount } from './queries/get-account.query';
import {
  asyncBoundaryMessages,
  type AsyncBoundaryText,
} from '../core/i18n/async-boundary.messages';
import { createAsyncSignal, type AsyncSignal } from '../core/observable/async-signal';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, type VMContext } from '../core/page/vm-context';

/** Superfície observável da tela de conta. */
export interface AccountPageVM {
  t: AccountPageText;
  /** Texto da fronteira de carregamento (erro e nova tentativa). */
  boundary: AsyncBoundaryText;
  profile: AsyncSignal<AccountProfile, []>;
  load: () => Promise<void>;
}

/**
 * Cria o ViewModel do perfil próprio.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createAccountPageVM(context: VMContext = {}): AccountPageVM {
  const t = accountMessages(contextLocale(context));
  const boundary = asyncBoundaryMessages(contextLocale(context));
  const profile = createAsyncSignal<AccountProfile, []>(() => getAccount(context.headers));
  return { t, boundary, profile, load: () => profile.run() };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function accountPageMeta(context: VMContext = {}): PageMeta {
  const t = accountMessages(contextLocale(context));
  return { title: t.title, description: t.subtitle };
}
