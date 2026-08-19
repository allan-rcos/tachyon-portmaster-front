/**
 * Factory do DTO de produto. Ver `@viewmodel/core/testing/factory-support`
 * para `paged` e `seedFaker`.
 *
 * @packageDocumentation
 */
import { faker } from '@faker-js/faker';
import { RiskClass } from '@model/common/dto';
import type { Product } from '@model/products/dto';
import { asyncBoundaryMessages } from '@viewmodel/core/i18n/async-boundary.messages';
import { productsListMessages } from '@viewmodel/products/i18n/product-list-page.messages';
import type { ProductListPageInput } from '@viewmodel/products/product-list-page.vm';
import { Factory } from 'fishery';

export const productFactory = Factory.define<Product>(({ sequence }) => ({
  id: `prd_${sequence}`,
  name: faker.commerce.productName(),
  density: faker.number.float({ min: 0.1, max: 3, fractionDigits: 2 }),
  risk_class: faker.helpers.arrayElement(Object.values(RiskClass)),
}));

/**
 * `ProductListPageInput` mínimo — o FUNDO do modal das rotas de formulário.
 *
 * As rotas `/produtos/nova` e `/produtos/@id/editar` carregam a listagem para
 * desenhá-la atrás do modal, mas o ViewModel do FORMULÁRIO não lê esse campo:
 * quem o consome é o `+Page`. Nos testes de VM ele é só o preenchimento que o
 * tipo exige, então esta factory devolve uma listagem vazia em vez de obrigar
 * cada teste a montar o objeto inteiro.
 *
 * @param overrides Campos a sobrescrever no input padrão.
 */
export function productListPageInput(
  overrides: Partial<ProductListPageInput> = {},
): ProductListPageInput {
  const t = productsListMessages('pt-BR');
  return {
    meta: { title: t.title, description: t.subtitle },
    shell: { name: 'Ana', role: 'Administrador', initials: 'AF', href: '/painel/conta' },
    t,
    boundary: asyncBoundaryMessages('pt-BR'),
    items: [],
    canCreate: true,
    search: '',
    newHref: '/painel/produtos/nova',
    locale: 'pt-BR',
    ...overrides,
  };
}
