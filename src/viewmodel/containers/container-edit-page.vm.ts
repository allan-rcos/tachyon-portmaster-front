// ============================================================
//  Rota /painel/conteineres/@id/editar.
//
//  O contêiner é buscado no `+data`, então o formulário chega preenchido no
//  HTML da primeira requisição. Ver `@viewmodel/products/product-list-page.vm`
//  para os dois papéis.
// ============================================================
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

import { containerEditMessages, type ContainerEditText } from './i18n/container-edit-page.messages';
import { getContainer } from './queries/get-container.query';

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

/** Superfície da edição de contêiner. */
export interface ContainerEditVM {
  /** Texto da tela. */
  t: ContainerEditText;
  /** Identificador opaco do contêiner em edição. */
  id: string;
  /** Código do contêiner. */
  code: string;
  /** Valores que preenchem o formulário. */
  values: ContainerFormValues;
  /** Volta para a listagem. */
  listHref: string;
}

/**
 * Cria o ViewModel da edição a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createContainerEditVM(input: ContainerEditPageInput): ContainerEditVM {
  return {
    t: input.t,
    id: input.id,
    code: input.code,
    values: input.values,
    listHref: input.listHref,
  };
}
