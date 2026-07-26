// ============================================================
//  Campo numérico digitado — o tipo de ENTRADA é `string`, porque é isso que
//  um `<input>` produz.
//
//  Antes estes campos usavam `z.coerce.number()`, cuja entrada é `unknown`: o
//  schema deixava de casar com os valores do formulário e a View compensava com
//  um cast (`zod-adapter`), que apagava a checagem inteira do slot de validação.
//  Declarar a entrada real faz o Standard Schema casar sozinho, devolve a
//  checagem de tipo ao ponto de uso e, de quebra, aceita a vírgula decimal que
//  o protótipo mostra (`0,58`).
// ============================================================
import { z } from 'zod';

/** Dígitos com uma parte decimal opcional, separada por vírgula OU ponto. */
const DECIMAL = /^\d+(?:[.,]\d+)?$/;

/**
 * Campo de texto que representa um número positivo.
 *
 * @param format   Erro exibido quando o texto não parece um número.
 * @param positive Erro exibido quando o número é zero ou negativo.
 * @returns Schema com entrada `string` e saída `number`.
 *
 * @example
 * ```ts
 * const schema = z.object({ density: positiveNumberField(t.densityFormat, t.densityPositive) });
 * schema.parse({ density: '0,58' }); // → { density: 0.58 }
 * ```
 */
export function positiveNumberField(format: string, positive: string) {
  return z
    .string()
    .trim()
    .regex(DECIMAL, format)
    .transform((value) => Number(value.replace(',', '.')))
    .pipe(z.number().positive(positive));
}
