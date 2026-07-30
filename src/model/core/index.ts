/**
 * Transporte. `createClient` monta a instância ofetch (baseURL, cookies,
 * credenciais) e carrega o codec do formato de wire escolhido pelo app — JSON em
 * desenvolvimento, FlatBuffers em produção.
 *
 * O módulo é PURO: não lê variável de ambiente, não conhece `/api` nem
 * Vike/txiki. Quem injeta baseURL, headers e wire é o ViewModel, em
 * `@viewmodel/core/client`.
 *
 * @packageDocumentation
 */
export { createClient } from './http';
export type { ApiClient, CreateClientConfig, WireFormat } from './http';
export { wire } from './wire';
export type { WireSpec, HttpMethod } from './wire';
export { FetchError, isApiError, errorStatus } from './errors';
