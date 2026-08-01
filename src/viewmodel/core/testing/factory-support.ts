/**
 * Apoio comum às factories de teste do ViewModel.
 *
 * As factories em si moram na feature que possui o recurso
 * (`@viewmodel/<feature>/testing/<x>.factory`); aqui fica só o que não
 * pertence a nenhuma delas: o envelope de paginação.
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
