/**
 * O que o Dagger NÃO deve carregar da árvore.
 *
 * R10 — `node_modules` e `dist` são o grosso do repositório e são saída, não
 * entrada: trazê-los invalidaria o cache a cada build sem que nada os usasse.
 *
 * Os `.git` saem porque os gitlinks dos submódulos apontam para dentro de
 * `.git/modules`, que não existe no container. O que os substitui é o `git init`
 * de `toolchain.dev()`, e o comentário lá explica por que não basta apagá-los.
 */
export { IGNORE }

const IGNORE = [
  "node_modules",
  "**/node_modules",
  "dist",
  "**/dist",
  ".git",
  "**/.git",
  ".github",
]
