// ============================================================
//  Rota /painel/produtos/nova.
//
//  A rota não busca nada: só autoriza e resolve texto. Ainda assim tem o par
//  `createXPageInput` + `createXVM`, porque a permissão de criar é trabalho de
//  servidor — antes ela vivia em `+permissions.js` e era avaliada por um guard
//  genérico, longe do código da tela.
//
//  Ver `./product-list-page.vm` para a explicação dos dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { RISK_CLASS_OPTIONS } from '@viewmodel/core/i18n/labels';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { SelectOption } from '@viewmodel/core/page/options';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';

import { productNewMessages, type ProductNewText } from './i18n/product-create-page.messages';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const PRODUCT_CREATE_PERMISSIONS = [Permission.ProductCreate] as const;

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ProductCreatePageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: ProductNewText;
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
  /** Classes de risco do seletor, com rótulo resolvido. */
  riskOptions: readonly SelectOption[];
}

/**
 * O trabalho de servidor da rota: autorização e i18n.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `ProductCreate`.
 */
export async function createProductCreatePageInput(
  request: PageRequest,
): Promise<ProductCreatePageInput> {
  const account = await authorize(request, PRODUCT_CREATE_PERMISSIONS);
  const t = productNewMessages(resolveLocale(request.headers));

  return {
    meta: { title: t.new, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    listHref: '/painel/produtos',
    riskOptions: RISK_CLASS_OPTIONS,
  };
}

/** Superfície do formulário de criação. */
export interface ProductCreateVM {
  /** Texto da tela. */
  t: ProductNewText;
  /** Volta para a listagem. */
  listHref: string;
  /** Classes de risco do seletor. */
  riskOptions: readonly SelectOption[];
}

/**
 * Cria o ViewModel do formulário de criação.
 *
 * Sem signals: nada nesta tela muda fora do próprio formulário, que tem estado
 * próprio. Inventar reatividade aqui só acrescentaria indireção.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createProductCreateVM(input: ProductCreatePageInput): ProductCreateVM {
  return { t: input.t, listHref: input.listHref, riskOptions: input.riskOptions };
}
