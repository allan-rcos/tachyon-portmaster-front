/**
 * Artifact — o `dist` publicável do front.
 *
 *   index.ts    a classe, que só delega
 *   build.ts    a cadeia de build, reimplementada
 *   zip.ts      o empacotamento
 *   version.ts  a versão do package.json
 *
 * O módulo se chama `artifact` e não `dist` porque o `.gitignore` deste
 * repositório traz `dist` na linha 6 — um padrão sem barra inicial, que o git
 * aplica a qualquer diretório com esse nome em qualquer profundidade. O Dagger
 * respeita o .gitignore ao carregar um módulo local, então um módulo em
 * `dagger/modules/dist` seria carregado VAZIO, e rodaria o esqueleto do
 * `dagger init` sem erro nenhum explicando por quê.
 */
import { Directory, File, object, func, argument } from "@dagger.io/dagger"

import { build } from "./build"
import { zip } from "./zip"
import { version } from "./version"
import { IGNORE } from "./ignore"

export { Artifact }

@object()
class Artifact {
  /** O `dist` construído e podado. */
  @func()
  dist(
    @argument({ ignore: IGNORE }) source: Directory,
  ): Directory {
    return build(source)
  }

  /** O `dist` podado, empacotado com o nome que a release publica. */
  @func()
  zip(
    @argument({ ignore: IGNORE }) source: Directory,
    version: string,
  ): File {
    return zip(source, version)
  }

  /** A versão declarada no package.json. */
  @func()
  async version(packageJson: File): Promise<string> {
    return version(packageJson)
  }
}
