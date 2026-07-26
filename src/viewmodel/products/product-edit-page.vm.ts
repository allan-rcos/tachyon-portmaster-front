// ============================================================
//  Rota /painel/produtos/@id/editar.
//
//  O produto é buscado no `+data`, então a tela de edição chega com o
//  formulário já preenchido no HTML da primeira requisição — antes ela abria
//  vazia e só preenchia depois que o navegador buscava. Não há mais
//  `AsyncBoundary` de carga inicial porque não há mais carga inicial.
//
//  Ver `./product-list-page.vm` para a explicação dos dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { RISK_CLASS_OPTIONS } from '@viewmodel/core/i18n/labels';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { SelectOption } from '@viewmodel/core/page/options';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { PageNotFoundError } from '@viewmodel/core/page/page-request';
import { routeParam } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';

import { productEditMessages, type ProductEditText } from './i18n/product-edit-page.messages';
import { getProduct } from './queries/get-product.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const PRODUCT_EDIT_PERMISSIONS = [Permission.ProductRead, Permission.ProductUpdate] as const;

/** Valores iniciais do formulário — dado plano, atravessa a serialização. */
export interface ProductFormValues {
  /** Nome do produto. */
  name: string;
  /** Densidade em t/m³, crua: o formulário a formata para exibição. */
  density: number;
  /** Classe de risco selecionada — valor opaco, casado com `riskOptions`. */
  risk_class: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ProductEditPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: ProductEditText;
  /** Identificador opaco do produto em edição. */
  id: string;
  /** Nome do produto, para o cabeçalho e a trilha. */
  productName: string;
  /** Valores que preenchem o formulário. */
  values: ProductFormValues;
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
  /** Classes de risco do seletor, com rótulo resolvido. */
  riskOptions: readonly SelectOption[];
}

/**
 * O trabalho de servidor da rota: autorização, i18n e o produto em edição.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem `ProductRead` + `ProductUpdate`.
 * @throws {PageNotFoundError} Quando o id não corresponde a um produto.
 */
export async function createProductEditPageInput(
  request: PageRequest,
): Promise<ProductEditPageInput> {
  const account = await authorize(request, PRODUCT_EDIT_PERMISSIONS);
  const t = productEditMessages(resolveLocale(request.headers));
  const id = routeParam(request, 'id');

  // A falha vira "não existe" em vez de vazar o erro de rede: para esta tela,
  // um id que não resolve é 404, e quem traduz isso para HTTP é o `pages/`.
  const product = await getProduct(id, request.headers).catch(() => {
    throw new PageNotFoundError(`Produto não encontrado: ${id}`);
  });

  return {
    meta: { title: `${t.edit} — ${product.name}`, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    id,
    productName: product.name,
    values: {
      name: product.name,
      density: product.density,
      risk_class: product.risk_class,
    },
    listHref: '/painel/produtos',
    riskOptions: RISK_CLASS_OPTIONS,
  };
}

/** Superfície da edição de produto. */
export interface ProductEditVM {
  /** Texto da tela. */
  t: ProductEditText;
  /** Identificador opaco do produto em edição. */
  id: string;
  /** Nome do produto, para o cabeçalho e a trilha. */
  productName: string;
  /** Valores que preenchem o formulário. */
  values: ProductFormValues;
  /** Volta para a listagem. */
  listHref: string;
  /** Classes de risco do seletor. */
  riskOptions: readonly SelectOption[];
}

/**
 * Cria o ViewModel da edição a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createProductEditVM(input: ProductEditPageInput): ProductEditVM {
  return {
    t: input.t,
    id: input.id,
    productName: input.productName,
    values: input.values,
    listHref: input.listHref,
    riskOptions: input.riskOptions,
  };
}
