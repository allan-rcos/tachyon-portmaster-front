// ============================================================
//  Adaptador Zod → TanStack Form.
//
//  Os schemas vivem no ViewModel (é lá que a regra de validação pertence); a
//  View só os pluga no formulário. O TanStack Form v1 consome Standard Schema
//  nativamente, então não há conversão em runtime — o adaptador existe para
//  resolver um problema de TIPO, não de comportamento.
//
//  O problema: schemas que usam `z.coerce` têm tipo de ENTRADA `unknown`
//  (o coerce aceita qualquer coisa e converte), enquanto os valores do
//  formulário são sempre strings vindas do input. O Standard Schema do
//  TanStack não consegue casar os dois, e o código respondia a isso espalhando
//  `as never` por cada island — um cast opaco, repetido, que apagava a
//  checagem inteira do slot de validação.
//
//  `zodValidator` concentra esse cast num único lugar documentado e, em troca,
//  amarra o schema ao tipo de valores do formulário: errar o formato dos
//  valores volta a ser erro de compilação no ponto de uso.
// ============================================================
import type { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Adapta um schema Zod ao slot de validador do TanStack Form.
 *
 * @template TValues Formato dos valores do formulário que o schema valida.
 * @template TInput  Entrada do schema — inferida do argumento.
 * @template TOutput Saída do schema — inferida do argumento.
 * @param schema Schema Zod vindo do ViewModel (já resolvido com o texto i18n).
 * @returns O mesmo schema, tipado como validador de `TValues`.
 *
 * @example
 * ```ts
 * const form = createForm(() => ({
 *   defaultValues: { name: '', density: '' } as ProductFormValues,
 *   validators: { onChange: zodValidator<ProductFormValues>(createProductSchema(props.t)) },
 * }));
 * ```
 */
export function zodValidator<TValues, TInput = unknown, TOutput = unknown>(
  schema: StandardSchemaV1<TInput, TOutput>,
): StandardSchemaV1<TValues, TValues> {
  // Cast deliberado e único: em runtime o schema é o mesmo objeto Standard
  // Schema que o TanStack Form já sabe executar. Ver o cabeçalho para o porquê.
  return schema as unknown as StandardSchemaV1<TValues, TValues>;
}
