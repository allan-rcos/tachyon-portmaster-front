/** Junta classes condicionalmente (substitui o `is-*` do Bulma). */
export const cn = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join(' ');
