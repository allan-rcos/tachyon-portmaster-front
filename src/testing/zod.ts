// ============================================================
//  Geração de dados a partir dos schemas Zod do ViewModel.
//
//  Usa `zod-schema-faker`, e não `@anatine/zod-mock`: este último declara peer
//  `zod@^3` e o projeto está no Zod 4 — os schemas daqui não passam por ele.
//  A função entregue é a mesma: dado um schema, produzir uma instância válida.
//
//  Importa do subpath `/v4`, e não da raiz: a entrada padrão do pacote fala
//  Zod 3 e falha com "Unsupported schema type: undefined" já num `z.object`
//  trivial. Só o subpath versionado funciona com o Zod 4 deste projeto.
//
//  Serve para exercitar o CAMINHO FELIZ de um formulário sem escrever à mão um
//  objeto que satisfaça todas as regras. Para o caminho infeliz, monte o valor
//  inválido explicitamente — é justamente o desvio que está sendo testado.
//
//  LIMITE CONHECIDO: schemas com `z.coerce.*` não são suportados (o gerador não
//  sabe produzir a entrada "antes da coerção"). Isso atinge os schemas de
//  produto, contêiner e manifesto, que recebem string do input e convertem para
//  número. Para esses, use as factories de `@testing/factories/model.factory`
//  ou monte o objeto do formulário à mão — que é o valor realmente digitado.
// ============================================================
import { faker } from '@faker-js/faker';
import type { ZodType } from 'zod';
import { fake, setFaker } from 'zod-schema-faker/v4';

// A entrada `/v4` não traz faker embutido — injetamos o mesmo do resto da
// infra de teste, para que `seedFaker()` controle as duas fontes de dados.
setFaker(faker);

/**
 * Gera um valor válido segundo o schema.
 *
 * @typeParam T Tipo inferido do schema.
 * @param schema Schema Zod do ViewModel (sem `z.coerce`).
 */
export function fakeFromSchema<T>(schema: ZodType<T>): T {
  return fake(schema) as T;
}
