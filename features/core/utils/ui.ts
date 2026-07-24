// ============================================================
//  Helpers de UI para as islands: composição de classes e extração
//  de mensagem de erro do TanStack Form.
// ============================================================

/** Junta classes condicionalmente (substitui o `is-*` do Bulma). */
export const cn = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join(' ');

/** Mensagem do primeiro erro de um campo do TanStack Form.
 *  Aceita strings ou issues de Standard Schema (zod v4). */
export function errText(errors: readonly unknown[] | undefined): string | undefined {
  const e = errors?.[0];
  if (e == null) return undefined;
  if (typeof e === 'string') return e;
  if (typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message);
  return String(e);
}
