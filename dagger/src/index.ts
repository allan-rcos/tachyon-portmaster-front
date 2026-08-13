/**
 * FrontSolid — as verificações e o empacotamento da variante Solid.
 *
 * Expõe EXATAMENTE os mesmos nomes de função que front-lit, e isso é o ponto:
 * a infraestrutura chama `ci`, `build` e `dist` sem saber qual framework está
 * atrás. O que difere é a cadeia, não a interface.
 *
 * ------------------------------------------------------------------------
 * COMO ESTE DIRETÓRIO É ORGANIZADO
 *
 * Um arquivo por comando. Para mexer no que `dagger call lint` faz, abra
 * lint.ts.
 *
 *   index.ts          a classe — só delega, e existe porque o Dagger precisa de
 *                     uma classe decorada, e TypeScript não divide classe em
 *                     vários arquivos
 *   ignore.ts         o que não entra no Directory
 *   lint.ts           dagger call lint
 *   typecheck.ts      dagger call typecheck
 *   test.ts           dagger call test
 *   translations.ts   dagger call check-translations
 *   docs.ts           dagger call docs-api
 *   build.ts          dagger call build
 *   dist.ts           dagger call dist
 *   ci.ts             dagger call ci
 *   version.ts        dagger call version
 *
 * O QUE É GERADO E O QUE VOCÊ ESCREVE
 *
 *   escrito à mão   dagger.json, package.json, tsconfig.json, src/, modules/
 *   gerado          sdk/ (5,6 MB), node_modules/
 *
 * O gerado já está no .gitignore deste diretório e é reconstruído por
 * `dagger develop`. Não edite nada dele.
 * ------------------------------------------------------------------------
 */
import { Directory, File, object, func, argument } from "@dagger.io/dagger"

import { IGNORE } from "./ignore"
import { lint } from "./lint"
import { typecheck } from "./typecheck"
import { test } from "./test"
import { checkTranslations } from "./translations"
import { docsApi } from "./docs"
import { build } from "./build"
import { dist } from "./dist"
import { ci } from "./ci"
import { version } from "./version"

export { FrontSolid }

@object()
class FrontSolid {
  /** Lint com ESLint. */
  @func()
  async lint(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
  ): Promise<string> {
    return lint(source)
  }

  /** Checagem de tipos. */
  @func()
  async typecheck(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
  ): Promise<string> {
    return typecheck(source)
  }

  /** Suíte de testes (vitest). */
  @func()
  async test(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
  ): Promise<string> {
    return test(source)
  }

  /** Contrato de i18n: as traduções cobrem as chaves usadas? */
  @func()
  async checkTranslations(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
  ): Promise<string> {
    return checkTranslations(source)
  }

  /** Referência de API (TypeDoc). */
  @func()
  async docsApi(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
  ): Promise<string> {
    return docsApi(source)
  }

  /**
   * Build da aplicação, devolvendo o `dist` já podado.
   *
   *     dagger call build export --path dist
   */
  @func()
  build(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
  ): Directory {
    return build(source)
  }

  /** Tudo que tem de estar verde antes de um merge. */
  @func()
  async ci(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
  ): Promise<string> {
    return ci(source)
  }

  /**
   * O zip que a release publica.
   *
   *     dagger call dist --version 1.0.1 export --path portmaster-dist-v1.0.1.zip
   */
  @func()
  dist(
    @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
    version: string,
  ): File {
    return dist(source, version)
  }

  /** A versão declarada no package.json. */
  @func()
  async version(
    @argument({ defaultPath: "/package.json" }) packageJson: File,
  ): Promise<string> {
    return version(packageJson)
  }
}
