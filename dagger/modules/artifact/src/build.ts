/**
 * A cadeia de build, reimplementada.
 *
 * ------------------------------------------------------------------------
 * Não há `bun run build` aqui, e é de propósito.
 *
 * Aquele script encadeava quatro passos com `&&`, e chamá-lo daqui deixaria a
 * ORDEM escrita em dois lugares — no package.json e neste módulo — sem nada
 * obrigando as duas a concordarem. Os passos estão abaixo, na mesma ordem, e é
 * aqui que ela passa a viver. Os pacotes do workspace continuam sendo
 * construídos por `bun run --filter`, que é o comando do bun para isso, não um
 * script do projeto.
 *
 * `ready()` já rodou paraglide, flatc e o typed-scss-modules — por isso eles não
 * reaparecem aqui.
 * ------------------------------------------------------------------------
 *
 * A poda também não é economia de espaço, é correção. O que roda em produção é
 * `dist/txiki/server.mjs` mais `dist/client`, que ele alcança por `../client/` a
 * partir do próprio `import.meta.url`. O resto é entrada de build: `dist/server`
 * já foi embutido no bundle pelo `Bun.build` do adapter, e `fbs` e `paraglide`
 * chegaram aos assets pelos aliases do Vite. Podar aqui, ANTES do zip e da
 * imagem, é o que mantém os dois com exatamente o mesmo conteúdo.
 */
import { dag, Directory } from "@dagger.io/dagger"

export { build }

function build(source: Directory): Directory {
  return dag
    .toolchain()
    .ready(source)
    .withExec(["bun", "run", "--filter", "vike-lit", "build"])
    .withExec(["bun", "run", "--filter", "vike-txiki-adapter", "build"])
    .withExec(["bunx", "--bun", "vite", "build"])
    .withExec([
      "sh",
      "-c",
      "find dist -mindepth 1 -maxdepth 1 ! -name client ! -name txiki -exec rm -rf {} +",
    ])
    .directory("/work/dist")
}
