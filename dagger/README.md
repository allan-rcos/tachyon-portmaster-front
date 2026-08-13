# dagger/

**As verificações e o empacotamento da variante Solid, rodando igual no seu terminal e no CI.**

Esta branch é uma **segunda implementação do mesmo front** que a `main` serve em lit. As duas expõem **exatamente as mesmas funções Dagger** — `ci`, `lint`, `typecheck`, `test`, `build`, `dist`, `version` — e é isso que permite à infraestrutura escolher qual constrói sem saber qual framework está atrás:

```bash
cd ../../dagger
dagger call build --front solid export --path ../.build
```

O que difere é a cadeia por dentro, não a interface.

-----

## 🔀 O que difere da variante lit

| | `front-lit` | `front-solid` |
|---|---|---|
| Framework | `lit` + `@lit-labs/ssr` | `solid-js` + `vike-solid` |
| Pacotes do workspace construídos antes | `vike-lit` **e** `vike-txiki-adapter` | só `vike-txiki-adapter` |
| `typecheck` e `test` | precisam do `vike-lit` construído | não precisam de build nenhum antes |

**O `vike-lit` é a diferença inteira.** Na variante lit ele é um pacote do workspace que o tsconfig resolve pelo `dist` — saída de build que não existe num checkout limpo —, então `typecheck` e `test` constroem antes ou falham com "cannot find module", apontando para o import e não para a causa. Aqui o framework vem do `solid-js` instalado como dependência normal, e esse passo não existe.

O resto — o `git init` que o crawler do vike exige, a poda do `dist`, o flatc, o paraglide, o `typed-scss-modules` — é idêntico, porque são propriedades do vike e do txiki, não do framework de view.

-----

## 🗺️ O diretório

```
dagger/
├── dagger.json          SDK TypeScript e as dependências locais
├── src/
│   ├── index.ts         a classe FrontSolid — só delega
│   ├── ignore.ts        o que não entra no Directory
│   └── lint.ts typecheck.ts test.ts translations.ts docs.ts
│       build.ts dist.ts ci.ts version.ts
└── modules/
    ├── toolchain/       bun + flatc, e o git que o vike exige
    └── artifact/        o dist podado e o zip da release
```

Um arquivo por comando. O `index.ts` existe porque o Dagger precisa de uma classe decorada e TypeScript não divide classe em vários arquivos — cada método é uma linha que delega.

**O que é gerado:** `sdk/` (~5,6 MB) e `node_modules/`, os dois já no `.gitignore` deste diretório. **O que você escreve:** `dagger.json`, `package.json`, `tsconfig.json`, `src/`, `modules/`.

-----

## 🌱 O `git init` que parece supérfluo e não é

O `toolchain.dev()` recria um repositório git dentro do container antes de instalar as dependências. Apagar essas duas linhas quebra o build, e o erro não menciona git em lugar nenhum.

Os gitlinks dos submódulos apontam para dentro de `.git/modules`, que não existe no container — por isso ficam fora do que o Dagger carrega. Só que **não ter repositório também quebra**: o crawler do vike usa o git para saber o que ignorar, e sem índice ele varre o `dist` dos pacotes do workspace e tenta executar o `+config.d.ts` como se fosse página da aplicação.

O sintoma é `ReferenceError: _default is not defined` seguido de `At least one page should be defined`.

-----

## ⚠️ As armadilhas

> **Não escreva um glob com asterisco-barra dentro de um comentário `/** */`.** A sequência fecha o bloco ali mesmo, o texto seguinte vira código, e o introspector do Dagger falha com `could not resolve type reference for any` — que não menciona comentário nenhum, e aparece no módulo que **depende** do quebrado.

> **O módulo se chama `artifact` e não `dist`.** O `.gitignore` desta branch traz `dist` na linha 6, sem barra inicial, o que casa com qualquer diretório desse nome em qualquer profundidade. Um módulo em `dagger/modules/dist` seria carregado **vazio**, e rodaria o esqueleto do `dagger init` sem erro nenhum explicando por quê.

> **Esta branch ainda não teve release.** O repositório do front só tem as tags `v1.0.0` e `v1.0.1`, ambas builds em lit. Até a primeira release sair daqui, `dagger call fetch --front solid` na infraestrutura falha dizendo que a release não existe, e a variante só vem de `build`, a partir do submódulo.

-----

## 📚 Relacionado

* [`../../dagger/README.md`](../../dagger/README.md) — as regras de arquitetura e as quatro combinações.
* [`../../front-lit/dagger/README.md`](../../front-lit/dagger/README.md) — a outra implementação do mesmo front.
