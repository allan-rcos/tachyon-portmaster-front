/** A versão declarada no package.json. */
import { dag, File } from "@dagger.io/dagger"

export { version }

async function version(packageJson: File): Promise<string> {
  return dag.artifact().version(packageJson)
}
