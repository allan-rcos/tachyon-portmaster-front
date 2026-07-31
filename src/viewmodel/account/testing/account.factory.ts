/**
 * Factories dos DTOs de conta.
 *
 * `roleRefFactory` mora aqui porque `RoleRef` é do módulo de conta
 * (`@model/account/dto`) — é a referência enxuta de perfil que vem embutida
 * num usuário, não o perfil administrável de `@model/roles/dto`. As factories
 * de usuário a reaproveitam.
 *
 * @packageDocumentation
 */
import { faker } from '@faker-js/faker';
import type { AccountProfile, RoleRef } from '@model/account/dto';
import { SAMPLE_PERMISSIONS } from '@viewmodel/roles/testing/permissions.sample';
import { Factory } from 'fishery';

export const roleRefFactory = Factory.define<RoleRef>(({ sequence }) => ({
  id: `rol_${sequence}`,
  name: faker.person.jobTitle(),
  user_count: faker.number.int({ min: 0, max: 20 }),
  permissions: faker.helpers.arrayElements(SAMPLE_PERMISSIONS, 3),
}));

export const accountProfileFactory = Factory.define<AccountProfile>(({ sequence }) => ({
  id: `usr_${sequence}`,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  roles: roleRefFactory.buildList(1),
}));
