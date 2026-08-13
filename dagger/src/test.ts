/**
 * A suíte do vitest.
 *
 * Sem passo de build antes: nada aqui depende de um pacote do workspace ter
 * sido construído.
 */
import { dag, Directory } from "@dagger.io/dagger"

export { test }

async function test(source: Directory): Promise<string> {
  return dag
    .toolchain()
    .ready(source)
    .withExec(["bunx", "vitest", "run"])
    .stdout()
}
