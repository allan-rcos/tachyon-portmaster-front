// ============================================================
//  Factories dos DTOs do Model (fishery + faker).
//
//  Substituem o banco em memória que o MSW mantinha. A diferença que importa:
//  o antigo `test/msw/db.ts` era uma RÉPLICA da API — 700 linhas de rotas,
//  paginação e regras de negócio que precisavam ser mantidas em sincronia com
//  o backend, e que passavam a mentir assim que ele mudasse. Uma factory só
//  produz um dado com o formato do DTO; quem define comportamento é o mock da
//  função do Model, no próprio teste.
//
//  Toda factory tem `sequence` no id, então dois `build()` nunca colidem, e
//  campos aleatórios via faker — o que expõe testes que dependem, sem querer,
//  de um valor específico do seed.
// ============================================================
import { faker } from '@faker-js/faker';
import type { AccountProfile, RoleRef } from '@model/account/dto';
import type { Paged, Permission, RiskClass } from '@model/common/dto';
import { CONTAINER_STATUS, PERMISSION, RISK_CLASS, TELEMETRY_EVENT } from '@model/common/dto';
import type {
  CargoManifestItem,
  Container,
  ContainerSummary,
  TelemetryLogItem,
} from '@model/containers/dto';
import type { Metrics } from '@model/metrics/dto';
import type { Product } from '@model/products/dto';
import type { Role } from '@model/roles/dto';
import type { UserAdmin } from '@model/users/dto';
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
    status: faker.helpers.arrayElement(CONTAINER_STATUS),
  };
});

export const productFactory = Factory.define<Product>(({ sequence }) => ({
  id: `prd_${sequence}`,
  name: faker.commerce.productName(),
  density: faker.number.float({ min: 0.1, max: 3, fractionDigits: 2 }),
  risk_class: faker.helpers.arrayElement(RISK_CLASS) as RiskClass,
}));

export const manifestItemFactory = Factory.define<CargoManifestItem>(({ sequence }) => ({
  product_id: `prd_${sequence}`,
  product_name: faker.commerce.productName(),
  quantity: faker.number.int({ min: 1, max: 500 }),
  weight: faker.number.int({ min: 100, max: 5_000 }),
}));

export const telemetryLogFactory = Factory.define<TelemetryLogItem>(({ sequence }) => ({
  id: `log_${sequence}`,
  event: faker.helpers.arrayElement(TELEMETRY_EVENT),
  description: faker.lorem.sentence(),
  timestamp: faker.date.recent().toISOString(),
}));

export const containerSummaryFactory = Factory.define<ContainerSummary>(() => ({
  container: containerFactory.build(),
  manifest: manifestItemFactory.buildList(2),
  recent_logs: telemetryLogFactory.buildList(3),
}));

export const roleFactory = Factory.define<Role>(({ sequence }) => ({
  id: `rol_${sequence}`,
  name: faker.person.jobTitle(),
  user_count: faker.number.int({ min: 0, max: 20 }),
  permissions: faker.helpers.arrayElements(PERMISSION, 3) as Permission[],
}));

export const roleRefFactory = Factory.define<RoleRef>(({ sequence }) => ({
  id: `rol_${sequence}`,
  name: faker.person.jobTitle(),
  user_count: faker.number.int({ min: 0, max: 20 }),
  permissions: faker.helpers.arrayElements(PERMISSION, 3) as Permission[],
}));

export const userFactory = Factory.define<UserAdmin>(({ sequence }) => ({
  id: `usr_${sequence}`,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  roles: roleRefFactory.buildList(1),
}));

export const accountProfileFactory = Factory.define<AccountProfile>(({ sequence }) => ({
  id: `usr_${sequence}`,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  roles: roleRefFactory.buildList(1),
}));

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

/**
 * Envelopa itens numa resposta paginada do Model.
 *
 * @param data       Itens da página.
 * @param nextCursor Cursor da próxima página, quando houver.
 */
export function paged<T>(data: T[], nextCursor?: string): Paged<T> {
  return { data, total: data.length, next_cursor: nextCursor };
}

/**
 * Fixa a semente do faker para tornar um teste determinístico.
 *
 * Use só quando o teste depender do VALOR gerado (ex.: comparar snapshot). Se
 * ele depende só do formato, deixe aleatório — é o que faz aparecer acoplamento
 * acidental a um dado específico.
 *
 * @param seed Semente a fixar.
 */
export function seedFaker(seed = 20260725): void {
  faker.seed(seed);
}
