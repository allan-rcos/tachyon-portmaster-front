/**
 * Rota /painel/conteineres/nova.
 *
 * A rota não busca nada de leitura: só autoriza e resolve texto. O estado do
 * formulário mora aqui — ver `@viewmodel/products/product-create-page.vm` para
 * o desenho, e `@viewmodel/products/product-list-page.vm` para os dois papéis.
 *
 * @packageDocumentation
 */
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { containerNewMessages, type ContainerNewText } from './i18n/container-create-page.messages';
import { createContainer } from './mutations/create-container.mutation';
import { createContainerSchema } from './schemas/container.schema';
import type { ContainerField, ContainerFormVM } from './vm-contracts';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const CONTAINER_CREATE_PERMISSIONS = ['container:create'] as const;

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ContainerCreatePageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: ContainerNewText;
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
}

/**
 * O trabalho de servidor da rota: autorização e i18n.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `ContainerCreate`.
 */
export async function createContainerCreatePageInput(
  request: PageRequest,
): Promise<ContainerCreatePageInput> {
  const account = await authorize(request, CONTAINER_CREATE_PERMISSIONS);
  const t = containerNewMessages(resolveLocale(request.headers));

  return {
    meta: { title: t.new, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    listHref: '/painel/conteineres',
  };
}

/**
 * Superfície do registro de contêiner.
 *
 * O grosso é o {@link ContainerFormVM} — o mesmo contrato que a edição
 * satisfaz. Aqui só o que o registro estreita.
 */
export interface ContainerCreateVM extends ContainerFormVM {
  /** Texto da tela — o do formulário, mais o cabeçalho da rota. */
  t: ContainerNewText;
  /** `create` decide o rótulo do botão e que o código é editável. */
  mode: 'create';
}

/** Valores enquanto se digita — tudo texto. Ver `@viewmodel/products/product-create-page.vm`. */
interface Draft {
  code: string;
  max_capacity: string;
}

const ALL_FIELDS: readonly ContainerField[] = ['code', 'max_capacity'];

/**
 * Cria o ViewModel da criação a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createContainerCreateVM(input: ContainerCreatePageInput): ContainerCreateVM {
  const schema = createContainerSchema('create', input.t);
  const values = signal<Draft>({ code: '', max_capacity: '' });
  const touched = signal<ReadonlySet<ContainerField>>(new Set());
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    listHref: input.listHref,
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
        touched(new Set(ALL_FIELDS));
        return false;
      }
      submitting(true);
      failed(false);
      try {
        await createContainer(result.data);
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
