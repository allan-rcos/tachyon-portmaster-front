/**
 * Rota /painel/produtos/nova.
 *
 * A rota não busca nada de leitura: só autoriza e resolve texto. Ainda assim
 * tem o par `createXPageInput` + `createXVM`, porque a permissão de criar é
 * trabalho de servidor — antes ela vivia em `+permissions.js` e era avaliada
 * por um guard genérico, longe do código da tela.
 *
 * O ESTADO DO FORMULÁRIO mora aqui, e não na island. Antes vivia na View, no
 * `@tanstack/solid-form` + `createMutationSignal` — mas valores, campos
 * tocados, "está enviando" e "falhou" são estado de aplicação. A consequência
 * prática: validação e submissão são testáveis sem DOM, e a island vira
 * desenho puro. Escrito à mão, com `signal`/`computed` e o schema Zod que já
 * existia; sem helper compartilhado entre as telas de formulário.
 *
 * Ver `./product-list-page.vm` para a explicação dos dois papéis, e
 * `@viewmodel/auth/login-page.vm` para o mesmo desenho na primeira tela.
 *
 * @packageDocumentation
 */
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
import type { ProductField, ProductFormVM } from './vm-contracts';

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

/**
 * Superfície da criação de produto.
 *
 * O grosso é o {@link ProductFormVM} — o mesmo contrato que a edição satisfaz,
 * e é por isso que o formulário é um componente só. Aqui só o que a criação
 * estreita.
 */
export interface ProductCreateVM extends ProductFormVM {
  /** Texto da tela — o do formulário, mais o cabeçalho da rota. */
  t: ProductNewText;
  /** `create` decide o rótulo do botão e a ausência do "excluir". */
  mode: 'create';
  /** A criação não exclui. */
  remove?: undefined;
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
