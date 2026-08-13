/**
 * O dev com o código gerado presente.
 *
 * ------------------------------------------------------------------------
 * As ferramentas são chamadas DIRETO, e não por `bun run gen`.
 *
 * Encadear scripts do package.json aqui deixaria a ordem — e as flags — escritas
 * em dois lugares. Estes são os mesmos comandos que `gen:fbs`, `gen:css` e
 * `i18n:compile` declaram, e é aqui que eles passam a viver.
 *
 * Rodam antes de qualquer verificação porque lint, tipos e testes importam as
 * mensagens do paraglide e os tipos de `fbs`, que são saída de compilador e não
 * existem no repositório. Sem isto o erro aparece como módulo não encontrado, no
 * passo errado.
 *
 * É uma função à parte para ser calculada UMA vez: lint, typecheck, test e build
 * partem todos daqui, e o cache do Dagger faz os quatro compartilharem o mesmo
 * resultado em vez de gerarem de novo cada um (R9).
 * ------------------------------------------------------------------------
 */
import { Container, Directory } from "@dagger.io/dagger"

import { dev } from "./dev"

export { ready }

function ready(source: Directory): Container {
  return dev(source)
    .withExec([
      "bunx",
      "paraglide-js",
      "compile",
      "--project",
      "./packages/tachyon-portmaster-i18n/project.inlang",
      "--outdir",
      "./dist/paraglide",
      "--strategy",
      "baseLocale",
      "--emit-ts-declarations",
      "--is-server",
      "typeof window === 'undefined'",
    ])
    .withExec([
      "flatc",
      "--ts",
      "--gen-object-api",
      "--gen-all",
      "-o",
      "dist/fbs",
      "src/model/contract/swagger/flatbuffers/schemas/api.fbs",
    ])
    .withExec([
      "bunx",
      "typed-scss-modules",
      "src/**/*.module.scss",
      "--nameFormat",
      "none",
      "--exportType",
      "default",
      "--aliasPrefixes.@ds/",
      "packages/tachyon-design/scss/",
      "--logLevel",
      "error",
    ])
}
