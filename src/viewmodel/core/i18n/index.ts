/**
 * Locale, catálogos transversais, rótulos e contratos de texto comuns.
 *
 * O contrato de texto mora no ViewModel de propósito: quem **produz** o texto
 * (resolvendo catálogo para um locale) é esta camada, quem consome é a View. Se as
 * interfaces `*Text` morassem no componente, o ViewModel dependeria da View para
 * se tipar — a regra de dependência invertida. O `tsc` fecha o ciclo: catálogo
 * que esquece uma chave falha no build, não na tela.
 *
 * @packageDocumentation
 */
export * from './async-boundary.messages';
export * from './common';
export * from './labels';
export * from './locale';
export * from './text-contracts';
