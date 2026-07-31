/**
 * Helpers de cookie. `parseCookies` roda no server (a partir do
 * header Cookie); `getCookie`/`setCookie`/`deleteCookie` no browser
 * (islands). Estado de preferência (tema/sidebar) vive aqui.
 *
 * @packageDocumentation
 */
/**
 * Converte o cabeçalho `Cookie` num mapa nome → valor.
 *
 * @param header Conteúdo do cabeçalho, ou `document.cookie`.
 */
export function parseCookies(header: string | undefined | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

/**
 * Lê um cookie do documento.
 *
 * @param name Nome do cookie.
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return parseCookies(document.cookie)[name];
}

/**
 * Grava um cookie no documento.
 *
 * @param name      Nome do cookie.
 * @param value     Valor a gravar.
 * @param maxAgeDays Validade em dias.
 */
export function setCookie(name: string, value: string, maxAgeDays = 365): void {
  if (typeof document === 'undefined') return;
  const maxAge = Math.round(maxAgeDays * 24 * 60 * 60);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

/**
 * Remove um cookie do documento.
 *
 * @param name Nome do cookie.
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}
