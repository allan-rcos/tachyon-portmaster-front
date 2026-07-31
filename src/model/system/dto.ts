/**
 * Identificação e telemetria do processo do BACKEND.
 *
 * Homônimo do `SystemInfo` de `@viewmodel/system`, e de propósito: são os mesmos
 * campos medidos em dois processos diferentes. Este vem do Rust por HTTP; aquele
 * o front lê do próprio runtime, sem E/S. A rota `/info` mostra os dois lado a
 * lado, e é por isso que nenhum dos dois pode virar o "o" info.
 */
export interface ProjectInfo {
  name: string;
  version: string;
  environment: string;
  runtime: string;
  /** Memória residente em MB. Cru: quem formata é o `PageInput`. */
  memory_usage_mb: number;
}
