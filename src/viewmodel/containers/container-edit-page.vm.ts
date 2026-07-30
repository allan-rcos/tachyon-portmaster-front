/**
 * Rota /painel/conteineres/@id/editar.
 *
 * O contêiner é buscado no `+data`, então o formulário chega preenchido no
 * HTML da primeira requisição. O estado do formulário mora aqui — ver
 * `@viewmodel/products/product-create-page.vm` para o desenho, e
 * `@viewmodel/products/product-list-page.vm` para os dois papéis.
 *
 * @packageDocumentation
 */
import { Permission } from '@model/common';
import { resolveLocale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import {
  PageNotFoundError,
  routeParam,
  type PageMeta,
  type PageRequest,
} from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { containerEditMessages, type ContainerEditText } from './i18n/container-edit-page.messages';
import { updateContainer } from './mutations/update-container.mutation';
import { getContainer } from './queries/get-container.query';
import { createContainerSchema } from './schemas/container.schema';
import type { ContainerField, ContainerFormVM } from './vm-contracts';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const CONTAINER_EDIT_PERMISSIONS = [
  Permission.ContainerRead,
  Permission.ContainerUpdate,
] as const;

/** Valores iniciais do formulário — dado plano, atravessa a serialização. */
export interface ContainerFormValues {
  /** Código ISO do contêiner. */
  code: string;
  /** Capacidade máxima em quilos, crua. */
  max_capacity: number;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ContainerEditPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: ContainerEditText;
  /** Identificador opaco do contêiner em edição. */
  id: string;
  /** Código do contêiner, para o cabeçalho e a trilha. */
  code: string;
  /** Valores que preenchem o formulário. */
  values: ContainerFormValues;
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
}

/**
 * O trabalho de servidor da rota: autorização, i18n e o contêiner em edição.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem `ContainerRead` + `ContainerUpdate`.
 * @throws {PageNotFoundError} Quando o id não corresponde a um contêiner.
 */
export async function createContainerEditPageInput(
  request: PageRequest,
): Promise<ContainerEditPageInput> {
  const account = await authorize(request, CONTAINER_EDIT_PERMISSIONS);
  const t = containerEditMessages(resolveLocale(request.headers));
  const id = routeParam(request, 'id');

  const container = await getContainer(id, request.headers).catch(() => {
    throw new PageNotFoundError(`Contêiner não encontrado: ${id}`);
  });

  return {
    meta: { title: `${t.edit} — ${container.code}`, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    id,
    code: container.code,
    values: { code: container.code, max_capacity: container.max_capacity },
    listHref: '/painel/conteineres',
  };
}

/**
 * Superfície da edição de contêiner.
 *
 * O grosso é o {@link ContainerFormVM}, o mesmo que o registro satisfaz.
 */
export interface ContainerEditVM extends ContainerFormVM {
  /** Texto da tela — o do formulário, mais o cabeçalho da rota. */
  t: ContainerEditText;
  /** Identificador opaco do contêiner em edição. */
  id: string;
  /** Código do contêiner — só leitura: o PATCH não o aceita. */
  code: string;
  /** `edit` decide o rótulo do botão e que o código vira `<output>`. */
  mode: 'edit';
}

/** Valores enquanto se digita — tudo texto. Ver `./container-create-page.vm`. */
interface Draft {
  code: string;
  max_capacity: string;
}

/**
 * Cria o ViewModel da edição a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createContainerEditVM(input: ContainerEditPageInput): ContainerEditVM {
  const schema = createContainerSchema('edit', input.t);
  const values = signal<Draft>({
    code: input.values.code,
    max_capacity: String(input.values.max_capacity),
  });
  const touched = signal<ReadonlySet<ContainerField>>(new Set());
  const submitting = signal(false);
  const failed = signal(false);

  const problems = computed(() => {
    const result = schema.safeParse(values());
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  return {
    t: input.t,
    id: input.id,
    code: input.code,
    listHref: input.listHref,
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
        // Só a capacidade é editável aqui, então é o único erro a revelar.
        touched(new Set<ContainerField>(['max_capacity']));
        return false;
      }
      submitting(true);
      failed(false);
      try {
        // O código não é editável: só a capacidade vai no PATCH.
        await updateContainer(input.id, { max_capacity: result.data.max_capacity });
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
