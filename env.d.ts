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

// Permite `import styles from './x.module.scss'` com tipagem básica.
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
