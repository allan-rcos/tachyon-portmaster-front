/**
 * Uma linha do catálogo de metadados do backend.
 *
 * O `id` é um handle de consulta, não uma chave estável: a numeração nasce da
 * ordem em que os use cases se registram no WorkerStart, então guardá-la em
 * qualquer lugar do front é errado — o que identifica o metadado é o `slug`.
 */
export interface MetadataItem {
  id: number;
  slug: string;
}

/**
 * O catálogo de permissões inteiro.
 *
 * Não é `Paged`: o envelope não tem `next_cursor` nem `total` porque o catálogo
 * é limitado pela quantidade de código escrito, não de dado inserido — nunca há
 * segunda página para pedir.
 */
export interface PermissionList {
  data: MetadataItem[];
}
