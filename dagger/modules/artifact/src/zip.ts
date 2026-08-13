/**
 * O empacotamento do `dist` podado, com o nome que a release publica e que o
 * `fetch` da infraestrutura espera.
 */
import { dag, Directory, File } from "@dagger.io/dagger"

import { build } from "./build"

export { zip }

function zip(source: Directory, version: string): File {
  const name = `portmaster-dist-v${version}.zip`

  return dag
    .toolchain()
    .base()
    .withWorkdir("/out")
    .withDirectory("/out/dist", build(source))
    .withExec(["zip", "-qr", name, "dist"])
    .file(`/out/${name}`)
}
