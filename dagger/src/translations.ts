/**
 * O contrato de i18n: as traduções cobrem as chaves usadas?
 *
 * O script é executado por `bun` e não por `node`, que é o que o package.json
 * declarava: a imagem base é o `oven/bun`, e não traz node. É um `.mjs` sem
 * dependência de API do Node além de `fs`, então os dois o executam igual.
 */
import { dag, Directory } from "@dagger.io/dagger"

export { checkTranslations }

async function checkTranslations(source: Directory): Promise<string> {
  return dag
    .toolchain()
    .ready(source)
    .withExec(["bun", "packages/tachyon-portmaster-i18n/bin/i18n-check.mjs"])
    .stdout()
}
