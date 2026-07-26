// ============================================================
//  Apoio comum às factories de teste do ViewModel.
//
//  As factories em si moram na feature que possui o recurso
//  (`@viewmodel/<feature>/testing/<x>.factory`); aqui fica só o que não
//  pertence a nenhuma delas: o envelope de paginação e o controle de semente.
//
//  Substituem o banco em memória que o MSW mantinha. A diferença que importa: o
//  antigo `test/msw/db.ts` era uma RÉPLICA da API — rotas, paginação e regras de
//  negócio que precisavam ser mantidas em sincronia com o backend, e que
//  passavam a mentir assim que ele mudasse. Uma factory só produz um dado com o
//  formato do DTO; quem define comportamento é o mock da função do Model, no
//  próprio teste.
// ============================================================
import { faker } from '@faker-js/faker';
import type { Paged } from '@model/common/dto';

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
