/** O zip que a release publica. */
import { dag, Directory, File } from "@dagger.io/dagger"

export { dist }

function dist(source: Directory, version: string): File {
  return dag.artifact().zip(source, version)
}
