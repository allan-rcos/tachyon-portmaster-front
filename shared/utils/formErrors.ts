// Extrai a mensagem do primeiro erro de um campo do TanStack Form.
// Aceita tanto strings quanto issues de Standard Schema (zod v4).
export function errText(errors: readonly unknown[] | undefined): string | undefined {
  const e = errors?.[0];
  if (e == null) return undefined;
  if (typeof e === 'string') return e;
  if (typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message);
  return String(e);
}
