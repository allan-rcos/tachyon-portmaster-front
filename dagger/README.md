# dagger/

**As verificações e o empacotamento do front, rodando igual no seu terminal e no CI.**

Antes disto, nada aqui rodava na máquina de quem desenvolve. Descobrir que o lint quebrou, que os tipos não fecham ou que o build morreu custava um push e a espera do runner. Agora custa `dagger call ci`.

Os módulos são TypeScript, como a aplicação.

-----

## 🗺️ O diretório

```
dagger/
├── dagger.json              SDK TypeScript e as dependências locais
├── src/index.ts             só compõe — nenhum dag.container() aqui
└── modules/
    ├── toolchain/           bun + flatc, e o git que o vike exige
    └── artifact/            o dist podado e o zip da release
```

> O módulo se chama `artifact` e não `dist` porque o `.gitignore` traz `dist` na linha 6 — sem barra inicial, o que casa com qualquer diretório desse nome em qualquer profundidade. Um módulo em `modules/dist/` seria carregado **vazio**, e rodaria o esqueleto do `dagger init` sem erro nenhum explicando por quê.

-----

## 🚀 O que você vai rodar

De dentro de `dagger/`:

```bash
dagger call ci                    # tudo, na ordem do ci.yml
dagger call lint
dagger call typecheck
dagger call test
dagger call check-translations    # bun run i18n:check
dagger call docs-api              # TypeDoc

dagger call build export --path ../dist
dagger call dist --version 1.0.1 export --path ../portmaster-dist-v1.0.1.zip
```

**A ordem do `ci` é deliberada**, e é a mesma de sempre: as verificações baratas e mais específicas primeiro, para que um erro de lint não custe um build inteiro para aparecer. O build vem depois delas e antes do TypeDoc.

O `flatc` saiu dos workflows. A versão era três cópias do mesmo número — uma no `ci.yml`, uma no `release.yml` e uma no `build-local.sh` da infraestrutura — e agora é uma constante em `modules/toolchain`.

-----

## 📋 Os métodos

Nove funções. Nenhuma pede bun ou node instalado; `dagger call <nome> --help` lista os argumentos.

| Comando | Devolve | Arquivo | Para quê |
|---|---|---|---|
| `ci` | `String` | `ci.ts` | i18n → lint → tipos → testes → build → TypeDoc |
| `lint` | `String` | `lint.ts` | ESLint sobre a árvore |
| `typecheck` | `String` | `typecheck.ts` | `tsc --noEmit` |
| `test` | `String` | `test.ts` | A suíte do vitest |
| `check-translations` | `String` | `translations.ts` | As traduções cobrem as chaves usadas? |
| `docs-api` | `String` | `docs.ts` | TypeDoc, configurado por `typedoc.json` |
| `build` | `Directory` | `build.ts` | O `dist` construído e podado |
| `dist` | `File` | `dist.ts` | O zip que a release publica |
| `version` | `String` | `version.ts` | A versão de `package.json` |

**`build` e `dist` pedem `export`** — nenhuma função escreve no repositório (R6):

```bash
dagger call build export --path ../dist
dagger call dist --version VERSAO export --path ../portmaster-dist-vVERSAO.zip
```

### Argumentos

Todas recebem `--source`, com `defaultPath` para a raiz — na prática você não passa nada. As exceções:

| Comando | Argumento | Padrão | |
|---|---|---|---|
| `dist` | `--version` | **obrigatório** | Entra no nome do zip |
| `version` | `--package-json` | `/package.json` | |

> **A ordem do `ci` é deliberada.** As verificações baratas e mais específicas primeiro, para que um erro de lint não custe um build inteiro para aparecer. O build vem depois delas e antes do TypeDoc.

-----

## ➕ Como acrescentar um método

1. **Decida onde.** Compõe outras funções? Um arquivo em `src/`. Constrói ambiente ou implementa a cadeia de build? `modules/toolchain` ou `modules/artifact` — a R2 diz que a raiz não tem `dag.container()`.

2. **Um arquivo, com o nome do comando**, exportando **uma coisa só**:

   ```ts
   // src/format.ts
   import { dag, Directory } from "@dagger.io/dagger"

   export { checkFormat }

   /** Confere a formatação com o Prettier, sem reescrever. */
   async function checkFormat(source: Directory): Promise<string> {
     return dag
       .toolchain()
       .ready(source)
       .withExec(["bunx", "prettier", "--check", "."])
       .stdout()
   }
   ```

3. **Declare o método na classe**, em `src/index.ts`. É o único lugar que cresce, e é uma linha que delega — o Dagger exige uma classe decorada e TypeScript não divide classe em vários arquivos:

   ```ts
   import { checkFormat } from "./format"

   /** Confere a formatação com o Prettier. */
   @func()
   async checkFormat(
     @argument({ defaultPath: "/", ignore: IGNORE }) source: Directory,
   ): Promise<string> {
     return checkFormat(source)
   }
   ```

4. **`dagger develop`** no módulo alterado, depois na raiz.

5. **`dagger functions`** para confirmar que apareceu.

### As armadilhas de quem escreve um método novo

> **Nunca escreva um glob com asterisco-barra dentro de um JSDoc.** A sequência fecha o bloco ali mesmo, o texto seguinte vira código, e o erro é `could not resolve type reference for any` — que não menciona comentário nenhum **e aparece no módulo que depende do quebrado**, não nele. Escreva `packages/<nome>/.git`.

> **Um módulo não pode se chamar `dist`.** O `.gitignore` traz `dist` sem barra inicial, e o Dagger respeita o `.gitignore`: o módulo é carregado **vazio** e roda o esqueleto do `dagger init`, sem erro que explique. É por isso que o de empacotamento se chama `artifact`.

> **Use `IGNORE` de `ignore.ts`, não uma lista nova.** Um `ignore` divergente muda a chave de cache e faz a função reexecutar sozinha, sem erro nenhum.

> **Partindo de `toolchain.ready()`, não de `dev()`.** O `ready` já rodou paraglide, flatc e o `typed-scss-modules`, e o cache faz todas as funções compartilharem uma geração só. Do `dev` você teria de repetir os três passos — e a ordem deles.

### E se a função substitui um script do `package.json`

A regra é reimplementar, não envelopar: chamar `bun run <script>` daqui deixaria a ordem dos passos escrita em dois lugares sem nada obrigando os dois a concordarem. Traga os comandos, um `withExec` por passo, e **remova a cadeia do `package.json`** — foi o que aconteceu com `build`, `typecheck` e `test`. Os aliases de uma palavra para uma ferramenta (`lint`, `format`) ficam: não há ordem a duplicar neles, e os editores os usam.

-----

## 🌱 O `git init` que parece supérfluo e não é

O `toolchain.dev()` recria um repositório git dentro do container antes de instalar as dependências. Apagar essas duas linhas quebra o build, e o erro não menciona git em lugar nenhum.

Os gitlinks dos submódulos apontam para dentro de `.git/modules`, que não existe no container — por isso eles ficam de fora do que o Dagger carrega. Só que **não ter repositório também quebra**: o crawler do vike usa o git para saber o que ignorar, e sem índice ele varre o `dist` de `packages/vike-lit` e tenta executar o `+config.d.ts` como se fosse página da aplicação.

O sintoma é `ReferenceError: _default is not defined` seguido de `At least one page should be defined`. Recriar o repositório resolve os dois lados de uma vez, e o `git add` roda antes de qualquer build, então o `dist` nasce depois e fica fora do índice.

-----

## 🔑 Os submódulos, e por que o Dagger não os clona

O `packages/tachyon-design` é **privado**. O checkout continua sendo trabalho do `actions/checkout` no CI, com a deploy key e o alias de host que o [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) documenta.

O Dagger recebe o diretório pronto e nunca clona nada por conta própria. Isso mantém toda a ginástica de credencial no único lugar onde ela já funciona, e é a regra geral: nada entra numa função Dagger que não tenha sido passado como argumento.

Localmente, basta ter rodado `git submodule update --init --recursive`.

-----

## ✂️ A poda do `dist`

O que roda em produção é `dist/txiki/server.mjs` mais `dist/client`, que ele alcança por `../client/` a partir do próprio `import.meta.url`. O resto é entrada de build: `dist/server` já foi embutido no bundle pelo `Bun.build` do adapter, e `fbs` e `paraglide` chegaram aos assets pelos aliases do Vite.

A poda acontece em `modules/artifact`, **antes** do zip e da imagem — que é o que mantém os dois com exatamente o mesmo conteúdo, e a razão de a release construir a aplicação uma vez só.

-----

## ♻️ A regra do `CACHED`

Duas execuções seguidas e idênticas: a segunda sai inteiramente `CACHED`. Um passo que reexecuta significa entrada não determinística — um `Directory` largo demais que pegou `node_modules` ou `dist`, por exemplo.

`toolchain.ready()` existe por essa razão: `lint`, `typecheck`, `test` e `build` partem todos dele, e o cache faz os quatro compartilharem uma geração só de paraglide e flatc, em vez de refazê-la cada um.

-----

## ⚠️ As armadilhas

> **Não escreva um glob com asterisco-barra dentro de um comentário `/** */`.** A sequência fecha o bloco ali mesmo, o texto seguinte vira código, e o introspector do Dagger falha com `could not resolve type reference for any` — que não menciona comentário nenhum, e cujo erro aparece no módulo que **depende** do quebrado, não nele. Escreva `packages/<nome>/.git`.

> **O Dagger lê a sua árvore de trabalho; o CI lê um checkout novo.** Se os finais de linha do seu clone divergirem do `.gitattributes`, o resultado local diverge do CI.

> **Os módulos são carregados respeitando o `.gitignore`.** Um diretório de módulo cujo nome case com um padrão de lá é carregado vazio, em silêncio. Confira antes de criar um módulo novo.

-----

## 📚 Relacionado

* [`../../dagger/README.md`](../../dagger/README.md) — as regras de arquitetura e a regra de decisão, na infraestrutura.
* [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) — o que sobrou no YAML, e por quê.
* [`../package.json`](../package.json) — os scripts que estes módulos envelopam.
