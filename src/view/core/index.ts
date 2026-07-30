/**
 * O design system e a infraestrutura de interface: componentes de apresentação,
 * o `AppShell`, a base dos islands e os interativos transversais.
 *
 * Nada aqui conhece uma feature. Um componente que só uma tela usa mora na feature,
 * não neste diretório.
 *
 * @packageDocumentation
 */
export * from './types';
export * from './components';
export * from './island';
export * from './islands';
export * from './layouts';
export * from './testing';
