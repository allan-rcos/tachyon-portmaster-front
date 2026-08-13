/**
 * O bun com o flatc, e nada do projeto.
 *
 * R8 — a versão do flatc existia em três lugares: o ci.yml, o release.yml e o
 * build-local.sh da infraestrutura. Aqui é uma constante só.
 */
import { dag, Container } from "@dagger.io/dagger"

export { base, FLATC_VERSION }

/** A mesma versão que o back usa para gerar os bindings Go. */
const FLATC_VERSION = "25.12.19"

function base(): Container {
  const url =
    `https://github.com/google/flatbuffers/releases/download/v${FLATC_VERSION}` +
    `/Linux.flatc.binary.g++-13.zip`

  return dag
    .container()
    .from("oven/bun:1-debian")
    .withExec([
      "sh",
      "-c",
      "apt-get update -qq && apt-get install -y -qq --no-install-recommends " +
        "curl unzip zip ca-certificates git >/dev/null",
    ])
    .withExec(["curl", "-fsSL", "-o", "/tmp/flatc.zip", url])
    .withExec(["unzip", "-q", "-o", "/tmp/flatc.zip", "-d", "/usr/local/bin"])
    .withExec(["chmod", "+x", "/usr/local/bin/flatc"])
}
