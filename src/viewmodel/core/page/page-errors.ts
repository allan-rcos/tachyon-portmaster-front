/**
 * Erros de autorização de página, sinalizados pelo ViewModel.
 *
 * O ViewModel NÃO chama `redirect()` nem `render()` do Vike: ele descreve o
 * que aconteceu e quem traduz para uma resposta HTTP é o composition root
 * (`pages/`). É o que mantém a decisão de autorização testável sem levantar
 * framework nenhum — e o que permitiria trocar o roteador sem reescrever
 * regra de acesso.
 *
 * Ver `@viewmodel/core/page/page-request` para `PageNotFoundError`, que segue
 * o mesmo princípio para "o recurso não existe".
 *
 * @packageDocumentation
 */
/**
 * Não há sessão válida: o cookie está ausente, expirado ou foi rejeitado.
 *
 * O composition root traduz para um redirect ao login preservando o destino.
 */
export class UnauthorizedError extends Error {
  constructor(message = 'Sessão ausente ou expirada') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Há sessão, mas faltam permissões para a rota.
 *
 * Diferente de `UnauthorizedError` de propósito: mandar ao login quem já está
 * autenticado produz um laço de redirect, e esconder a existência da rota de
 * quem só não tem permissão não protege nada que o menu já não revele.
 */
export class ForbiddenError extends Error {
  /** Permissões que a rota exigia e o usuário não possui. */
  readonly missing: readonly string[];

  /**
   * @param missing Permissões faltantes, para diagnóstico.
   */
  constructor(missing: readonly string[] = []) {
    super(`Permissões insuficientes: ${missing.join(', ') || '(não informadas)'}`);
    this.name = 'ForbiddenError';
    this.missing = missing;
  }
}
