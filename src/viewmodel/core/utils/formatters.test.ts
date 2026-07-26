// ============================================================
//  Estes formatadores substituíram `Intl`, que o txiki.js não implementa, e
//  passaram a rodar no SERVIDOR (o `+data` entrega dado já formatado). Duas
//  coisas, portanto, precisam estar travadas por teste:
//
//   • a saída por locale, que antes vinha do ICU e agora vem de date-fns/numbro;
//   • a AUSÊNCIA de dependência de `Intl` — é o que quebrou em produção e o
//     tipo de regressão que passa despercebida em dev (onde `Intl` existe).
// ============================================================
import { afterEach, describe, expect, it } from 'vitest';

import {
  formatDate,
  formatDateTime,
  formatDecimal,
  formatDensity,
  formatNumber,
  formatPercent,
  formatWeight,
} from './formatters';

describe('formatação por locale', () => {
  it('separa milhar e decimal conforme o locale', () => {
    expect(formatNumber(1234567, 'pt-BR')).toBe('1.234.567');
    expect(formatNumber(1234567, 'en')).toBe('1,234,567');
    expect(formatNumber(1234567, 'es')).toBe('1.234.567');
  });

  it('formata densidade com unidade e vírgula decimal em pt-BR', () => {
    expect(formatDensity(0.58, 'pt-BR')).toBe('0,58 t/m³');
    expect(formatDensity(0.58, 'en')).toBe('0.58 t/m³');
  });

  it('corta zeros à direita em vez de exibir 24.000,00 kg', () => {
    expect(formatWeight(24000, 'pt-BR')).toBe('24.000 kg');
    expect(formatWeight(1234.5, 'pt-BR')).toBe('1.234,5 kg');
  });

  it('formata percentual', () => {
    expect(formatPercent(58.3, 'pt-BR')).toBe('58,3%');
  });

  it('usa a ordem de campos de data de cada locale', () => {
    const iso = '2026-07-26T14:05:00.000Z';
    expect(formatDate(iso, 'pt-BR')).toMatch(/^\d{2}\/\d{2}\/2026$/);
    // pt-BR e en diferem na ORDEM (dd/MM vs MM/dd), então o dia 26 aparece em
    // posições distintas — é o que distingue os dois formatos.
    expect(formatDate(iso, 'pt-BR').startsWith('26/')).toBe(true);
    expect(formatDate(iso, 'en').startsWith('07/')).toBe(true);
  });

  it('formata data e hora', () => {
    expect(formatDateTime('2026-07-26T14:05:00.000Z', 'pt-BR')).toMatch(
      /^\d{2}\/\d{2}\/2026 \d{2}:\d{2}$/,
    );
  });

  it('cai no locale padrão quando não recebe um', () => {
    expect(formatDensity(0.58)).toBe(formatDensity(0.58, 'pt-BR'));
  });
});

describe('independência de Intl', () => {
  const original = globalThis.Intl;

  afterEach(() => {
    globalThis.Intl = original;
  });

  it('formata com `Intl` ausente — que é o ambiente do txiki.js', () => {
    // @ts-expect-error — remover um global é exatamente o que se quer provar.
    delete globalThis.Intl;

    expect(formatNumber(1234567, 'pt-BR')).toBe('1.234.567');
    expect(formatDensity(0.58, 'pt-BR')).toBe('0,58 t/m³');
    expect(formatWeight(24000, 'pt-BR')).toBe('24.000 kg');
    expect(formatPercent(58.3, 'pt-BR')).toBe('58,3%');
    expect(formatDate('2026-07-26T14:05:00.000Z', 'pt-BR')).toMatch(/^\d{2}\/\d{2}\/2026$/);
    expect(formatDateTime('2026-07-26T14:05:00.000Z', 'pt-BR')).toBeTruthy();
  });
});

describe('formatDecimal', () => {
  it('preserva as casas decimais que `formatNumber` arredondaria', () => {
    // O painel desenha o número e a unidade separados, então precisa do valor
    // sem sufixo — mas com as decimais que `formatPercent` mostrava.
    expect(formatDecimal(58.3, 'pt-BR')).toBe('58,3');
    expect(formatNumber(58.3, 'pt-BR')).toBe('58');
  });

  it('corta zeros à direita', () => {
    expect(formatDecimal(12, 'pt-BR')).toBe('12');
    expect(formatDecimal(1234.5, 'en')).toBe('1,234.5');
  });
});
