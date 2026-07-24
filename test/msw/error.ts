// Erro de teste com status HTTP. Usado pelo resolver/handlers MSW para
// sinalizar respostas de erro (401/404/422). Infra de teste — não faz
// parte do bundle do app.
export class MockApiError extends Error {
  constructor(
    public status: number,
    message?: string,
  ) {
    super(message ?? `HTTP ${status}`);
    this.name = 'MockApiError';
  }
}
