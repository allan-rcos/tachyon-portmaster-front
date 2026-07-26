// ============================================================
//  Factory do DTO de usuário administrável.
// ============================================================
import { faker } from '@faker-js/faker';
import type { UserAdmin } from '@model/users/dto';
import { roleRefFactory } from '@viewmodel/account/testing/account.factory';
import { Factory } from 'fishery';

export const userFactory = Factory.define<UserAdmin>(({ sequence }) => ({
  id: `usr_${sequence}`,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  roles: roleRefFactory.buildList(1),
}));
