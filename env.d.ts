/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base das chamadas de browser (islands). Ex.: "/api". Exposta ao cliente. */
  readonly PUBLIC_ENV__API_BASE_URL?: string;
  /** Base loopback do server (loaders/txiki) para o Rust. URL de infra
   *  (não-secreta); usada só server-side, mas exposta ao bundle. */
  readonly PUBLIC_ENV__API_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Versão do `package.json`, injetada no build pelo `define` do Vite/Vitest. */
declare const __APP_VERSION__: string;

// Rede de segurança para `import styles from './x.module.scss'`.
//
// O tipo REAL de cada módulo vem do `x.module.scss.d.ts` que o `gen:css`
// escreve ao lado do arquivo, declarando exatamente as classes que ele define:
// resolução relativa vence o curinga, então é aquele que o TypeScript usa.
// Isso é o que permite `classList={{ [styles.invalid]: … }}` compilar (com
// `noUncheckedIndexedAccess`, um `Record` daria `string | undefined`, que não
// serve como chave computada) e o que transforma um nome de classe errado em
// erro de compilação.
//
// Esta declaração só entra em cena se o codegen não tiver rodado.
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

// Os arquivos de idioma do numbro não têm tipos: o pacote só declara a API
// principal. São dados de locale (separadores, abreviações) que só passam por
// `numbro.registerLanguage`, então a forma exata não acrescenta segurança.
declare module 'numbro/languages/*.js' {
  const language: import('numbro').NumbroLanguage;
  export default language;
}
