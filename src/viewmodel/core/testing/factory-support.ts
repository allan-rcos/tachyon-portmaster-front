/**
 * Apoio comum às factories de teste do ViewModel.
 *
 * As factories em si moram na feature que possui o recurso
 * (`@viewmodel/<feature>/testing/<x>.factory`); aqui fica só o que não
 * pertence a nenhuma delas: o envelope de paginação e o controle de semente.
 *
 * Substituem o banco em memória que o MSW mantinha. A diferença que importa: o
 * antigo `test/msw/db.ts` era uma RÉPLICA da API — rotas, paginação e regras de
 * negócio que precisavam ser mantidas em sincronia com o backend, e que
 * passavam a mentir assim que ele mudasse. Uma factory só produz um dado com o
 * formato do DTO; quem define comportamento é o mock da função do Model, no
 * próprio teste.
 *
 * @packageDocumentation
 */
import { faker } from '@faker-js/faker';
import type { Paged } from '@model/common/dto';
import { localizedHref, type Locale } from '@viewmodel/core/i18n/locale';
import type { PageRequest } from '@viewmodel/core/page/page-request';

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

/**
 * `PageRequest` de teste, com `href`/`t` amarrados ao locale pedido.
 *
 * Existe porque o contrato deixou de carregar um `locale` cru: montar o objeto
 * à mão em cada teste significaria repetir as duas funções, e um teste que as
 * implementa errado deixa de exercitar o que a rota realmente recebe.
 *
 * @param overrides Campos a sobrescrever (url, headers, routeParams, locale).
 */
export function pageRequest(
  overrides: Partial<Omit<PageRequest, 'href' | 't'>> & { locale?: Locale } = {},
): PageRequest {
  const { locale = 'pt-BR', ...rest } = overrides;
  return {
    headers: undefined,
    url: '/painel',
    routeParams: {},
    href: (path) => localizedHref(path, locale),
    t: (<T>(catalog?: (l: Locale) => T) =>
      catalog ? catalog(locale) : locale) as PageRequest['t'],
    ...rest,
  };
}
