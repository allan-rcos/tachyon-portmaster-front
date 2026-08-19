/**
 * Factories dos DTOs de contêiner, manifesto e telemetria.
 *
 * Todo `id` sai de `sequence`, então dois `build()` nunca colidem; o resto vem
 * do faker — o que expõe teste que depende, sem querer, de um valor específico
 * do seed. Ver `@viewmodel/core/testing/factory-support` para `paged` e
 * `seedFaker`.
 *
 * @packageDocumentation
 */
import { faker } from '@faker-js/faker';
import { ContainerStatus, TelemetryEvent } from '@model/common/dto';
import type {
  CargoManifestItem,
  Container,
  ContainerSummary,
  TelemetryLogItem,
} from '@model/containers/dto';
import type { ContainerListPageInput } from '@viewmodel/containers/container-list-page.vm';
import { containersListMessages } from '@viewmodel/containers/i18n/container-list-page.messages';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
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

/**
 * `ContainerListPageInput` mínimo — o FUNDO do modal das rotas de formulário.
 *
 * As rotas de cadastro/edição carregam a listagem para desenhá-la atrás do
 * modal, mas o ViewModel do FORMULÁRIO não lê esse campo: quem o consome é o
 * `+Page`. Nos testes de VM ele é só o preenchimento que o tipo exige.
 *
 * @param overrides Campos a sobrescrever no input padrão.
 */
export function containerListPageInput(
  overrides: Partial<ContainerListPageInput> = {},
): ContainerListPageInput {
  const t = containersListMessages('pt-BR');
  return {
    meta: { title: t.title, description: t.subtitle },
    shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
    t,
    boundary: asyncBoundaryMessages('pt-BR'),
    items: [],
    canCreate: true,
    newHref: '/painel/conteineres/nova',
    locale: 'pt-BR',
    filters: { search: '', status: '' },
    statusOptions: [],
    ...overrides,
  };
}
