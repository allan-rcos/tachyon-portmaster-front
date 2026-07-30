/**
 * Identidade que o chrome autenticado (sidebar) mostra no rodapé.
 *
 * Fica no `PageInput` — e não no layout — pela mesma razão que o `meta`: o
 * `+Layout` não tem `+data` próprio no Vike, mas enxerga `pageContext.data`.
 * Como TODA rota autenticada já chama `authorize()`, o perfil já está em mãos;
 * o que falta é entregá-lo em formato de apresentação.
 *
 * @packageDocumentation
 */
import type { AccountProfile } from '@model/account';

/** O que o rodapé da barra lateral desenha. Serializável. */
export interface ShellIdentity {
  /** Nome completo, exibido no rodapé. */
  name: string;
  /** Perfil principal, exibido abaixo do nome. */
  role: string;
  /** Iniciais para o avatar (no máximo duas letras). */
  initials: string;
  /** Destino do bloco — a própria conta. */
  href: string;
}

/**
 * Converte o perfil da sessão na identidade do chrome.
 *
 * @param account Perfil já carregado por `authorize`.
 */
export function shellIdentity(account: AccountProfile): ShellIdentity {
  const parts = account.name.trim().split(/\s+/).filter(Boolean);
  const first = parts.at(0)?.[0] ?? '';
  // Primeira e ÚLTIMA inicial, não as duas primeiras: "Ana Luiza Ferreira" vira
  // "AF", que é como as pessoas se reconhecem num avatar.
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';

  return {
    name: account.name,
    role: account.roles.at(0)?.name ?? '',
    initials: `${first}${last}`.toUpperCase(),
    href: '/painel/conta',
  };
}
