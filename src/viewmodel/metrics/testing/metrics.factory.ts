// ============================================================
//  Factory do DTO de métricas do painel.
// ============================================================
import { faker } from '@faker-js/faker';
import type { Metrics } from '@model/metrics/dto';
import { Factory } from 'fishery';

export const metricsFactory = Factory.define<Metrics>(() => ({
  active_containers: faker.number.int({ min: 1, max: 50 }),
  total_containers: faker.number.int({ min: 50, max: 100 }),
  yard_load: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
  registered_products: faker.number.int({ min: 1, max: 200 }),
  occupancy_division: {
    empty: faker.number.int({ min: 0, max: 20 }),
    loading: faker.number.int({ min: 0, max: 20 }),
    sealed: faker.number.int({ min: 0, max: 20 }),
    in_transit: faker.number.int({ min: 0, max: 20 }),
  },
}));
