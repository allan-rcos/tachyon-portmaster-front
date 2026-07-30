# Estilos

## Onde o CSS mora

Junto do componente que ele estiliza, na View:

```
src/view/<feature>/components/MinhaCoisa.ts
src/view/<feature>/components/MinhaCoisa.module.scss
```

Estilos de página inteira vão para `src/view/<feature>/styles/`. **`pages/` não
tem CSS** — o único import global vive em `pages/+Layout.ts`, apontando para
`@view/core/styles/global.scss`.

## CSS Modules por padrão

```ts
import styles from './MinhaCoisa.module.scss';
html`<div class=${styles.card}></div>`;
```

O nome de classe é hasheado, então não há colisão entre componentes.

**Exceção:** `src/view/info/styles/info-page.scss` é uma folha global de
propósito — a tela usa nomes de classe globais em strings. Convertê-la em módulo
trocaria os nomes por hashes e a página perderia o estilo. Se for mexer nela,
saiba que é a única assim.

## Design system

Os tokens e mixins vêm do submodule `tachyon-design`, pelo alias `@ds`:

```scss
@use '@ds/glass' as glass;

.card {
  @include glass.glass-l1;
  border-radius: var(--radius-md);
}
```

Trocar a origem do design system é trocar um alias em `vite.config.ts` e
`vitest.config.ts` — os `@use '@ds/…'` continuam iguais.

Como `packages/tachyon-design` é submodule, alterá-lo exige commit no
repositório de origem.

## Tema

Não há seletor de tema: **o produto é escuro**. O `pages/+Head.ts` declara
`<meta name="color-scheme" content="dark">` e é isso. O seletor claro/escuro, o
cookie `flow-theme` e o script anti-FOUC que existiam foram removidos junto com o
`ThemeSwitcher` — sobrariam duas árvores de estilo para manter, uma delas nunca
vista.

## Cores por "tom"

Badges e gráficos usam a união `Tone`
(`gold | sage | teal | orange | danger | neutral`). Os mapas que traduzem tom em
variável CSS são tipados por essa união, então acrescentar um tom quebra na
compilação em vez de renderizar um elemento sem cor.
