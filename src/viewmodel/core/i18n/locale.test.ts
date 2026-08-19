import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LOCALE,
  localeFromUrl,
  localePrefix,
  localizedHref,
  splitLocale,
  switchLocale,
} from './locale';

describe('splitLocale', () => {
  it('sem prefixo, é o locale base e o caminho passa intacto', () => {
    expect(splitLocale('/painel/produtos')).toEqual({
      locale: 'pt-BR',
      path: '/painel/produtos',
    });
  });

  it('reconhece os locales prefixados', () => {
    expect(splitLocale('/en/painel/produtos')).toEqual({ locale: 'en', path: '/painel/produtos' });
    expect(splitLocale('/es/painel/produtos')).toEqual({ locale: 'es', path: '/painel/produtos' });
  });

  it('o prefixo sozinho vira a raiz, não string vazia', () => {
    // `''` não casaria a rota raiz no Vike.
    expect(splitLocale('/en')).toEqual({ locale: 'en', path: '/' });
    expect(splitLocale('/en/')).toEqual({ locale: 'en', path: '/' });
  });

  it('preserva a querystring', () => {
    expect(splitLocale('/en/painel/conteineres?status=Loading')).toEqual({
      locale: 'en',
      path: '/painel/conteineres?status=Loading',
    });
    expect(splitLocale('/en?x=1')).toEqual({ locale: 'en', path: '/?x=1' });
  });

  it('não confunde uma rota que começa parecido com um prefixo', () => {
    expect(splitLocale('/entrar')).toEqual({ locale: 'pt-BR', path: '/entrar' });
    expect(splitLocale('/estoque')).toEqual({ locale: 'pt-BR', path: '/estoque' });
  });

  it('`pt-BR` não é um prefixo válido — o base é a AUSÊNCIA de prefixo', () => {
    // Senão a mesma página teria dois endereços.
    expect(splitLocale('/pt-BR/painel')).toEqual({ locale: 'pt-BR', path: '/pt-BR/painel' });
  });
});

describe('localePrefix', () => {
  it('o locale base não tem prefixo', () => {
    expect(localePrefix(DEFAULT_LOCALE)).toBe('');
    expect(localePrefix('en')).toBe('/en');
  });
});

describe('localizedHref', () => {
  it('só prefixa o que não é base', () => {
    expect(localizedHref('/painel/produtos', 'pt-BR')).toBe('/painel/produtos');
    expect(localizedHref('/painel/produtos', 'es')).toBe('/es/painel/produtos');
  });
});

describe('switchLocale', () => {
  it('troca o idioma preservando a página', () => {
    expect(switchLocale('/painel/produtos', 'en')).toBe('/en/painel/produtos');
    expect(switchLocale('/en/painel/produtos', 'es')).toBe('/es/painel/produtos');
    expect(switchLocale('/en/painel/produtos', 'pt-BR')).toBe('/painel/produtos');
  });

  it('é idempotente ao trocar para o mesmo idioma', () => {
    expect(switchLocale('/en/painel', 'en')).toBe('/en/painel');
  });
});

describe('localeFromUrl', () => {
  it('lê só o idioma', () => {
    expect(localeFromUrl('/es/painel')).toBe('es');
    expect(localeFromUrl('/painel')).toBe('pt-BR');
  });
});
