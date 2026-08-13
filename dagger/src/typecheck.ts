/**
 * Checagem de tipos.
 *
 * O `build --filter vike-lit` vem antes porque o tsconfig resolve `vike-lit`
 * pelo `dist` do pacote, que é saída de build e não existe num checkout limpo.
 * Sem ele o erro é "cannot find module", que aponta para o import e não para a
 * causa.
 */
import { dag, Directory } from "@dagger.io/dagger"

export { typecheck }

async function typecheck(source: Directory): Promise<string> {
  return dag
    .toolchain()
    .ready(source)
    .withExec(["bun", "run", "--filter", "vike-lit", "build"])
    .withExec(["bunx", "tsc", "--noEmit"])
    .stdout()
}
