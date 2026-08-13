/**
 * Toolchain — o ambiente em que este front é construído.
 *
 * Um arquivo por assunto:
 *
 *   index.ts   a classe, que só delega
 *   base.ts    bun + flatc, sem nada do projeto
 *   dev.ts     o base com o código e as dependências instaladas
 *   ready.ts   o dev com o código gerado presente
 *
 * NOTA para quem editar comentários aqui: não escreva um glob que contenha a
 * sequência de fechamento de bloco (asterisco seguido de barra) dentro de um
 * JSDoc. Ela encerra o comentário ali mesmo, o texto seguinte vira código, e o
 * erro é "could not resolve type reference for any" — que não menciona
 * comentário nenhum, e aparece no módulo que DEPENDE do quebrado.
 */
import { Container, Directory, object, func, argument } from "@dagger.io/dagger"

import { base } from "./base"
import { dev } from "./dev"
import { ready } from "./ready"
import { IGNORE } from "./ignore"

export { Toolchain }

@object()
class Toolchain {
  /** O bun com o flatc instalado, e nada do projeto. */
  @func()
  base(): Container {
    return base()
  }

  /** O base com o código montado e as dependências instaladas. */
  @func()
  dev(
    @argument({ ignore: IGNORE }) source: Directory,
  ): Container {
    return dev(source)
  }

  /** O dev com paraglide e flatc já rodados. */
  @func()
  ready(
    @argument({ ignore: IGNORE }) source: Directory,
  ): Container {
    return ready(source)
  }
}
