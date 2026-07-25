// ============================================================
//  ViewModel da rota. Observável: a tela assina os sinais e reage.
//  Roda no navegador (VMContext sem `headers`); passar os headers do request
//  dentro de um `+data.ts` devolve a rota ao SSR sem tocar nada aqui.
// ============================================================
//  Esta rota não busca nada: só resolve texto. O formulário em si é uma island
//  que fala com o ViewModel de mutação.
import { roleNewMessages } from './i18n/role-create-page.messages';
import type { RoleNewText } from './i18n/role-create-page.messages';
import type { PageMeta } from '../core/page/page-request';
import { contextLocale, type VMContext } from '../core/page/vm-context';

/** Superfície do formulário de criação. */
export interface RoleCreateVM {
  t: RoleNewText;
}

/**
 * Cria o ViewModel do formulário de criação.
 *
 * @param context Contexto de execução — navegador quando omitido.
 */
export function createRoleCreateVM(context: VMContext = {}): RoleCreateVM {
  return { t: roleNewMessages(contextLocale(context)) };
}

/**
 * Título e descrição da rota, para o `<head>`.
 * @param context Contexto de execução — só o locale importa aqui.
 */
export function roleCreateMeta(context: VMContext = {}): PageMeta {
  const t = roleNewMessages(contextLocale(context));
  return { title: t.new, description: t.subtitle };
}
