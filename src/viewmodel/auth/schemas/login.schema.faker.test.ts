// ============================================================
//  Demonstra a geração de dados a partir de um schema Zod — útil quando o
//  teste precisa de uma entrada VÁLIDA e não se importa com os valores.
//
//  O import é do subpath `/v4`, e não da raiz: a entrada padrão do pacote fala
//  Zod 3 e falha com "Unsupported schema type: undefined" já num `z.object`
//  trivial. Só o subpath versionado funciona com o Zod 4 deste projeto.
//
//  `setFaker` injeta a MESMA instância do faker que as factories usam, para que
//  `seedFaker()` continue controlando as duas fontes de dados.
//
//  LIMITE CONHECIDO (medido em 2026-07-26, zod-schema-faker 2.1.1): os schemas
//  com campo numérico digitado continuam FORA do gerador. A Etapa 4 trocou
//  `z.coerce.number()` por `z.string().regex().transform().pipe(z.number())`,
//  o que resolveu o problema de TIPO na View — mas não este: o gerador agora
//  quebra no `ZodPipe`/`ZodTransform` (`Cannot read properties of undefined`)
//  em vez de na coerção. Ou seja, o plano previa que o limite sumiria e ele
//  apenas mudou de causa. Por isso a demonstração usa o `loginSchema`, que é
//  string pura ponta a ponta.
// ============================================================
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { fake, setFaker } from 'zod-schema-faker/v4';

import { loginSchema } from './login.schema';

setFaker(faker);

describe('geração a partir do schema', () => {
  it('gera credenciais que o próprio schema aceita', () => {
    const value = fake(loginSchema);
    expect(loginSchema.safeParse(value).success).toBe(true);
  });

  it('gera valores diferentes a cada chamada', () => {
    expect(fake(loginSchema)).not.toEqual(fake(loginSchema));
  });
});
