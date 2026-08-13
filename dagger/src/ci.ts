/**
 * Tudo que tem de estar verde antes de um merge.
 *
 * A ordem é deliberada: as verificações baratas e mais específicas primeiro,
 * para que um erro de lint não custe um build inteiro para aparecer. O build vem
 * depois delas e antes do TypeDoc, porque é o passo caro.
 */
import { Directory } from "@dagger.io/dagger"

import { checkTranslations } from "./translations"
import { lint } from "./lint"
import { typecheck } from "./typecheck"
import { test } from "./test"
import { docsApi } from "./docs"
import { build } from "./build"

export { ci }

async function ci(source: Directory): Promise<string> {
  const steps: string[] = []
  steps.push(await checkTranslations(source))
  steps.push(await lint(source))
  steps.push(await typecheck(source))
  steps.push(await test(source))
  await build(source).sync()
  steps.push(await docsApi(source))
  return steps.join("\n")
}
