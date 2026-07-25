// ============================================================
//  Demonstra a geração de dados a partir de um schema Zod — útil quando o
//  teste precisa de uma entrada VÁLIDA e não se importa com os valores.
//
//  Vale só para schemas sem `z.coerce` (ver `@testing/zod`): os de produto,
//  contêiner e manifesto convertem string→número e ficam de fora.
// ============================================================
import { fakeFromSchema } from '@testing/zod';
import { describe, expect, it } from 'vitest';

import { loginSchema } from './login.schema';

describe('fakeFromSchema', () => {
  it('gera credenciais que o próprio schema aceita', () => {
    const value = fakeFromSchema(loginSchema);
    expect(loginSchema.safeParse(value).success).toBe(true);
  });

  it('gera valores diferentes a cada chamada', () => {
    expect(fakeFromSchema(loginSchema)).not.toEqual(fakeFromSchema(loginSchema));
  });
});
