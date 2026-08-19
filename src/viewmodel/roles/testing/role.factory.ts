/**
 * Factory do DTO de perfil administrável. A referência enxuta que vem dentro
 * de um usuário é outra coisa — ver `roleRefFactory` em
 * `@viewmodel/account/testing/account.factory`.
 *
 * @packageDocumentation
 */
import { faker } from '@faker-js/faker';
import type { Role } from '@model/roles/dto';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { rolesListMessages } from '@viewmodel/roles/i18n/role-list-page.messages';
import type { RoleListPageInput } from '@viewmodel/roles/role-list-page.vm';
import { Factory } from 'fishery';

import { SAMPLE_PERMISSIONS } from './permissions.sample';

export const roleFactory = Factory.define<Role>(({ sequence }) => ({
  id: `rol_${sequence}`,
  name: faker.person.jobTitle(),
  user_count: faker.number.int({ min: 0, max: 20 }),
  permissions: faker.helpers.arrayElements(SAMPLE_PERMISSIONS, 3),
}));

/**
 * `RoleListPageInput` mínimo — o FUNDO do modal das rotas de formulário.
 *
 * As rotas de cadastro/edição carregam a listagem para desenhá-la atrás do
 * modal, mas o ViewModel do FORMULÁRIO não lê esse campo: quem o consome é o
 * `+Page`. Nos testes de VM ele é só o preenchimento que o tipo exige.
 *
 * @param overrides Campos a sobrescrever no input padrão.
 */
export function roleListPageInput(overrides: Partial<RoleListPageInput> = {}): RoleListPageInput {
  const t = rolesListMessages('pt-BR');
  return {
    meta: { title: t.title, description: t.subtitle },
    shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
    t,
    boundary: asyncBoundaryMessages('pt-BR'),
    items: [],
    canCreate: true,
    newHref: '/painel/perfis/nova',
    locale: 'pt-BR',
    ...overrides,
  };
}
