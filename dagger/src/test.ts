/**
 * A suíte do vitest.
 *
 * Mesma razão do typecheck para construir o vike-lit antes: os testes importam
 * o pacote pelo `dist` dele.
 */
import { dag, Directory } from "@dagger.io/dagger"

export { test }

async function test(source: Directory): Promise<string> {
  return dag
    .toolchain()
    .ready(source)
    .withExec(["bun", "run", "--filter", "vike-lit", "build"])
    .withExec(["bunx", "vitest", "run"])
    .stdout()
}
