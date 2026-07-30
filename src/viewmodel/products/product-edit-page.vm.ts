// ============================================================
//  Rota /painel/produtos/@id/editar.
//
//  O produto é buscado no `+data`, então a tela de edição chega com o
//  formulário já preenchido no HTML da primeira requisição — antes ela abria
//  vazia e só preenchia depois que o navegador buscava. Não há mais
//  `AsyncBoundary` de carga inicial porque não há mais carga inicial.
//
//  O ESTADO DO FORMULÁRIO mora aqui, como na criação — a diferença é que os
//  valores iniciais vêm do produto buscado, e que existe `remove()`.
//
//  Ver `./product-list-page.vm` para a explicação dos dois papéis, e
//  `./product-create-page.vm` para o desenho do formulário.
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
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { productEditMessages, type ProductEditText } from './i18n/product-edit-page.messages';
import { deleteProduct } from './mutations/delete-product.mutation';
import { updateProduct } from './mutations/update-product.mutation';
import type { ProductField } from './product-create-page.vm';
import { getProduct } from './queries/get-product.query';
import { createProductSchema } from './schemas/product.schema';

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

/** Valores enquanto se digita — tudo texto. Ver `./product-create-page.vm`. */
interface Draft {
  name: string;
  density: string;
  risk_class: string;
}

const ALL_FIELDS: readonly ProductField[] = ['name', 'density', 'risk_class'];

/** Superfície da edição de produto. */
export interface ProductEditVM {
  /** Texto da tela. */
  t: ProductEditText;
  /** Identificador opaco do produto em edição. */
  id: string;
  /** Nome do produto, para o cabeçalho e a trilha. */
  productName: string;
  /** Volta para a listagem. Quem navega é a View. */
  listHref: string;
  /** Classes de risco do seletor. */
  riskOptions: readonly SelectOption[];
  /** `edit` decide o rótulo do botão e a presença do "excluir". */
  mode: 'edit';
  /** Valor atual de um campo — começa preenchido com o produto buscado. */
  value: (field: ProductField) => string;
  /** Erro de um campo, só depois de tocado (ou de uma tentativa de envio). */
  error: (field: ProductField) => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API. */
  failed: () => boolean;
  /** Escreve um campo. */
  set: (field: ProductField, value: string) => void;
  /** Marca um campo como tocado, liberando o erro dele. */
  blur: (field: ProductField) => void;
  /**
   * Valida e salva. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se salvou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;
  /**
   * Exclui o produto.
   *
   * REJEITA em caso de falha, ao contrário de `submit`: quem chama é o
   * `ConfirmDialog`, que tem estado de erro próprio e espera uma promise crua.
   */
  remove: () => Promise<void>;
}

/**
 * Cria o ViewModel da edição a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createProductEditVM(input: ProductEditPageInput): ProductEditVM {
  const schema = createProductSchema(input.t);
  // A densidade volta a ser texto para caber no `<input>`; o schema a converte
  // de novo na submissão. `String(0.58)` dá `'0.58'` — ponto, não vírgula, e o
  // `positiveNumberField` aceita os dois.
  const values = signal<Draft>({
    name: input.values.name,
    density: String(input.values.density),
    risk_class: input.values.risk_class,
  });
  const touched = signal<ReadonlySet<ProductField>>(new Set());
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    id: input.id,
    productName: input.productName,
    listHref: input.listHref,
    riskOptions: input.riskOptions,
    mode: 'edit',
    value: (field) => values()[field],
    error: (field) => (touched().has(field) ? problems()[field]?.[0] : undefined),
    submitting,
    failed,
    set: (field, value) => {
      values({ ...values(), [field]: value });
      failed(false);
    },
    blur: (field) => touched(new Set(touched()).add(field)),
    submit: async () => {
      const result = schema.safeParse(values());
      if (!result.success) {
        touched(new Set(ALL_FIELDS));
        return false;
      }
      submitting(true);
      failed(false);
      try {
        await updateProduct(input.id, result.data);
        return true;
      } catch {
        failed(true);
        return false;
      } finally {
        submitting(false);
      }
    },
    remove: () => deleteProduct(input.id),
  };
}
