/** A referência de API, pelo TypeDoc, configurada por typedoc.json. */
import { dag, Directory } from "@dagger.io/dagger"

export { docsApi }

async function docsApi(source: Directory): Promise<string> {
  return dag.toolchain().ready(source).withExec(["bunx", "typedoc"]).stdout()
}
