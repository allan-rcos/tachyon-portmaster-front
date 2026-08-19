/**
 * Contratos de texto transversais (chrome autenticado).
 * Ver `@viewmodel/products/i18n/text-contracts` para o porquê de o contrato
 * morar no ViewModel.
 *
 * @packageDocumentation
 */
/** Texto do chrome autenticado — navegação lateral e ação de sair. */
export interface ShellNavText {
  /** Rótulo do grupo "administração" na barra lateral. */
  administration: string;
  painel: string;
  conteineres: string;
  produtos: string;
  manifestos: string;
  usuarios: string;
  perfis: string;
  conta: string;
  logout: string;
}
