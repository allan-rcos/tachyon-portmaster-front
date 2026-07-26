// ============================================================
//  Factory do DTO de perfil administrável. A referência enxuta que vem dentro
//  de um usuário é outra coisa — ver `roleRefFactory` em
//  `@viewmodel/account/testing/account.factory`.
// ============================================================
import { faker } from '@faker-js/faker';
import { Permission } from '@model/common/dto';
import type { Role } from '@model/roles/dto';
import { Factory } from 'fishery';

export const roleFactory = Factory.define<Role>(({ sequence }) => ({
  id: `rol_${sequence}`,
  name: faker.person.jobTitle(),
  user_count: faker.number.int({ min: 0, max: 20 }),
  permissions: faker.helpers.arrayElements(Object.values(Permission), 3),
}));
