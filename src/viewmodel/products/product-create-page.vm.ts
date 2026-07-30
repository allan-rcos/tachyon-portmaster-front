// ============================================================
//  Rota /painel/produtos/nova.
//
//  A rota não busca nada de leitura: só autoriza e resolve texto. Ainda assim
//  tem o par `createXPageInput` + `createXVM`, porque a permissão de criar é
//  trabalho de servidor — antes ela vivia em `+permissions.js` e era avaliada
//  por um guard genérico, longe do código da tela.
//
//  O ESTADO DO FORMULÁRIO mora aqui, e não na island. Antes vivia na View, no
//  `@tanstack/solid-form` + `createMutationSignal` — mas valores, campos
//  tocados, "está enviando" e "falhou" são estado de aplicação. A consequência
//  prática: validação e submissão são testáveis sem DOM, e a island vira
//  desenho puro. Escrito à mão, com `signal`/`computed` e o schema Zod que já
//  existia; sem helper compartilhado entre as telas de formulário.
//
//  Ver `./product-list-page.vm` para a explicação dos dois papéis, e
//  `@viewmodel/auth/login-page.vm` para o mesmo desenho na primeira tela.
// ============================================================
import { Permission } from '@model/common';
import { RISK_CLASS_OPTIONS } from '@viewmodel/core/i18n/labels';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { SelectOption } from '@viewmodel/core/page/options';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { productNewMessages, type ProductNewText } from './i18n/product-create-page.messages';
import { createProduct } from './mutations/create-product.mutation';
import { createProductSchema } from './schemas/product.schema';

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

/** Campos do formulário de produto. */
export type ProductField = 'name' | 'density' | 'risk_class';

/**
 * Valores enquanto se digita — TUDO texto, que é o que um `<input>` produz.
 *
 * Diferente do `ProductFormValues` da edição (que tem `density: number`, como o
 * produto sai da API): a conversão é trabalho do schema, na submissão.
 */
interface Draft {
  name: string;
  density: string;
  risk_class: string;
}

const ALL_FIELDS: readonly ProductField[] = ['name', 'density', 'risk_class'];

/** Superfície do formulário de criação. */
export interface ProductCreateVM {
  /** Texto da tela. */
  t: ProductNewText;
  /** Volta para a listagem. Quem navega é a View. */
  listHref: string;
  /** Classes de risco do seletor. */
  riskOptions: readonly SelectOption[];
  /** `create` decide o rótulo do botão e a ausência do "excluir". */
  mode: 'create';
  /** Valor atual de um campo. */
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
   * Valida e cadastra. Nunca rejeita — o erro vira estado.
   *
   * @returns `true` se cadastrou; a View então navega para `listHref`.
   */
  submit: () => Promise<boolean>;
}

/**
 * Cria o ViewModel do formulário de criação.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createProductCreateVM(input: ProductCreatePageInput): ProductCreateVM {
  const schema = createProductSchema(input.t);
  const values = signal<Draft>({ name: '', density: '', risk_class: 'None' });
  const touched = signal<ReadonlySet<ProductField>>(new Set());
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    listHref: input.listHref,
    riskOptions: input.riskOptions,
    mode: 'create',
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
        // Enviar com campo inválido revela todos os erros de uma vez.
        touched(new Set(ALL_FIELDS));
        return false;
      }
      submitting(true);
      failed(false);
      try {
        await createProduct(result.data);
        return true;
      } catch {
        failed(true);
        return false;
      } finally {
        submitting(false);
      }
    },
  };
}
