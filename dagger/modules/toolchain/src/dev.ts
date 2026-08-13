/**
 * O base com o código montado e as dependências instaladas.
 *
 * ------------------------------------------------------------------------
 * O `git init` abaixo não é zelo, e apagá-lo QUEBRA o build.
 *
 * Os gitlinks dos submódulos (os `.git` dentro de `packages/<nome>`) apontam
 * para dentro de `.git/modules`, que não existe neste container — por isso o
 * `ignore` os deixa de fora. Só que simplesmente não ter repositório também
 * quebra: o crawler do vike usa o git para saber o que ignorar, e sem índice ele
 * varre o `dist` de `packages/vike-lit` e tenta executar o `+config.d.ts` como
 * se fosse página da aplicação.
 *
 * O sintoma é `ReferenceError: _default is not defined` seguido de "At least one
 * page should be defined" — e nada nas duas mensagens menciona git.
 *
 * O `git add` roda ANTES de qualquer build, então o `dist` nasce depois e fica
 * fora do índice, como deve.
 * ------------------------------------------------------------------------
 */
import { dag, Container, Directory } from "@dagger.io/dagger"

import { base } from "./base"

export { dev }

function dev(source: Directory): Container {
  return base()
    .withMountedCache("/cache/bun", dag.cacheVolume("front-bun"))
    .withEnvVariable("BUN_INSTALL_CACHE_DIR", "/cache/bun")
    .withMountedDirectory("/work", source)
    .withWorkdir("/work")
    .withExec(["git", "config", "--global", "--add", "safe.directory", "*"])
    .withExec(["sh", "-c", "git init -q . && git add -A 2>/dev/null || true"])
    .withExec(["bun", "install", "--frozen-lockfile"])
}
