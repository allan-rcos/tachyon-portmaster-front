// ============================================================
//  Factory do DTO de produto. Ver `@viewmodel/core/testing/factory-support`
//  para `paged` e `seedFaker`.
// ============================================================
import { faker } from '@faker-js/faker';
import { RiskClass } from '@model/common/dto';
import type { Product } from '@model/products/dto';
import { Factory } from 'fishery';

export const productFactory = Factory.define<Product>(({ sequence }) => ({
  id: `prd_${sequence}`,
  name: faker.commerce.productName(),
  density: faker.number.float({ min: 0.1, max: 3, fractionDigits: 2 }),
  risk_class: faker.helpers.arrayElement(Object.values(RiskClass)),
}));
