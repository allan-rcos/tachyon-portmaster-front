/**
 * A versão declarada no package.json, que é a fonte da verdade para publicar.
 *
 * Lida aqui, em TypeScript, e não por um container com `jq`: é um campo de um
 * arquivo, e subir uma imagem para lê-lo era o tipo de passo que esta reescrita
 * existe para eliminar.
 */
import { File } from "@dagger.io/dagger"

export { version }

async function version(packageJson: File): Promise<string> {
  const contents = await packageJson.contents()
  const parsed = JSON.parse(contents) as { version?: string }
  return (parsed.version ?? "").trim()
}
