/** ESLint sobre a árvore inteira. */
import { dag, Directory } from "@dagger.io/dagger"

export { lint }

async function lint(source: Directory): Promise<string> {
  return dag.toolchain().ready(source).withExec(["bunx", "eslint", "."]).stdout()
}
