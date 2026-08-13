/**
 * Checagem de tipos.
 *
 * Sem o `--filter vike-lit` que a variante lit precisa: aqui o framework vem do
 * `solid-js` instalado, não de um pacote do workspace construído antes.
 */
import { dag, Directory } from "@dagger.io/dagger"

export { typecheck }

async function typecheck(source: Directory): Promise<string> {
  return dag
    .toolchain()
    .ready(source)
    .withExec(["bunx", "tsc", "--noEmit"])
    .stdout()
}
