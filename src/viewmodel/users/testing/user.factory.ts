/**
 * Factory do DTO de usuário administrável.
 *
 * @packageDocumentation
 */
import { faker } from '@faker-js/faker';
import type { UserAdmin } from '@model/users/dto';
import { roleRefFactory } from '@viewmodel/account/testing/account.factory';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { usersListMessages } from '@viewmodel/users/i18n/user-list-page.messages';
import type { UserListPageInput } from '@viewmodel/users/user-list-page.vm';
import { Factory } from 'fishery';

export const userFactory = Factory.define<UserAdmin>(({ sequence }) => ({
  id: `usr_${sequence}`,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  roles: roleRefFactory.buildList(1),
}));

/**
 * `UserListPageInput` mínimo — o FUNDO do modal das rotas de formulário.
 *
 * As rotas de cadastro/edição carregam a listagem para desenhá-la atrás do
 * modal, mas o ViewModel do FORMULÁRIO não lê esse campo: quem o consome é o
 * `+Page`. Nos testes de VM ele é só o preenchimento que o tipo exige.
 *
 * @param overrides Campos a sobrescrever no input padrão.
 */
export function userListPageInput(overrides: Partial<UserListPageInput> = {}): UserListPageInput {
  const t = usersListMessages('pt-BR');
  return {
    meta: { title: t.title, description: t.subtitle },
    shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
    t,
    boundary: asyncBoundaryMessages('pt-BR'),
    items: [],
    canCreate: true,
    newHref: '/painel/usuarios/nova',
    locale: 'pt-BR',
    ...overrides,
  };
}
