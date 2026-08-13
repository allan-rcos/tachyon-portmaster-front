/** O `dist` construído e podado. A cadeia está em modules/artifact. */
import { dag, Directory } from "@dagger.io/dagger"

export { build }

function build(source: Directory): Directory {
  return dag.artifact().dist(source)
}
