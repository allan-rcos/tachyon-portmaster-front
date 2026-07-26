// ============================================================
//  Factories dos DTOs de contêiner, manifesto e telemetria.
//
//  Todo `id` sai de `sequence`, então dois `build()` nunca colidem; o resto vem
//  do faker — o que expõe teste que depende, sem querer, de um valor específico
//  do seed. Ver `@viewmodel/core/testing/factory-support` para `paged` e
//  `seedFaker`.
// ============================================================
import { faker } from '@faker-js/faker';
import { ContainerStatus, TelemetryEvent } from '@model/common/dto';
import type {
  CargoManifestItem,
  Container,
  ContainerSummary,
  TelemetryLogItem,
} from '@model/containers/dto';
import { Factory } from 'fishery';

/** Código de contêiner no padrão ISO (4 letras + 4 dígitos). */
function containerCode(): string {
  return `${faker.string.alpha({ length: 4, casing: 'upper' })}-${faker.string.numeric(4)}`;
}

export const containerFactory = Factory.define<Container>(({ sequence }) => {
  const maxCapacity = faker.number.int({ min: 10_000, max: 30_000 });
  return {
    id: `ctr_${sequence}`,
    code: containerCode(),
    current_weight: faker.number.int({ min: 0, max: maxCapacity }),
    max_capacity: maxCapacity,
    status: faker.helpers.arrayElement(Object.values(ContainerStatus)),
  };
});

export const manifestItemFactory = Factory.define<CargoManifestItem>(({ sequence }) => ({
  product_id: `prd_${sequence}`,
  product_name: faker.commerce.productName(),
  quantity: faker.number.int({ min: 1, max: 500 }),
  weight: faker.number.int({ min: 100, max: 5_000 }),
}));

export const telemetryLogFactory = Factory.define<TelemetryLogItem>(({ sequence }) => ({
  id: `log_${sequence}`,
  event: faker.helpers.arrayElement(Object.values(TelemetryEvent)),
  description: faker.lorem.sentence(),
  timestamp: faker.date.recent().toISOString(),
}));

export const containerSummaryFactory = Factory.define<ContainerSummary>(() => ({
  container: containerFactory.build(),
  manifest: manifestItemFactory.buildList(2),
  recent_logs: telemetryLogFactory.buildList(3),
}));
