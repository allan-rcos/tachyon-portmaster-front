# tachyon-portmaster-i18n

Fonte única do i18n do PortMaster. Este pacote guarda **os dados** (catálogos por
locale) e **as regras** (projeto inlang + validador de contrato). Ele não exporta
código de runtime: o que a aplicação importa é a *saída compilada* do Paraglide.

```
packages/tachyon-portmaster-i18n/
  project.inlang/        configuração do inlang (locales, plugin de formato)
  messages/              catálogos: pt-BR.json (base), en.json, es.json
  bin/i18n-check.mjs     validador do contrato bilateral
```

## Como o i18n flui

```
messages/{locale}.json ──► paraglideVitePlugin ──► dist/paraglide/messages/*.js
        (fonte)                 (compilação)            (funções m.* tree-shakeable)
```

A saída fica em `dist/paraglide` porque **é build, não fonte** — regenerável a
qualquer momento e por isso gitignorada junto do resto de `dist`. O alias
`@/paraglide/*` (declarado em `tsconfig.json`, `vite.config.ts` e
`vitest.config.ts`) aponta para lá, então o specifier usado no código é estável:

```ts
import { m } from '@/paraglide/messages';
m.products_title({}, { locale });
```

**O locale é sempre explícito.** Não há estado global, `AsyncLocalStorage` nem
detecção implícita: quem resolve o locale é o ViewModel (a partir do cookie
`flow-locale`) e o passa adiante. Isso é o que permite renderizar o mesmo
componente em locales diferentes na mesma requisição.

## O contrato bilateral

Cada catálogo de rota/formulário tem um `*.messages.schema.json` irmão que é a
**fonte da verdade** e valida os dois lados:

| lado | o que é verificado | falha |
|---|---|---|
| **Dados** | todo locale tem todas as chaves exigidas, com string não-vazia | fatal |
| **Resolver** | o `messages.ts` irmão referencia exatamente as chaves declaradas | fatal |
| **Órfãs** | chave no catálogo base que nenhum schema exige | aviso |

Chave usada mas não declarada **e** declarada mas não usada são ambas fatais —
é o que impede o catálogo de acumular lixo ou de silenciosamente perder tradução.

```bash
bun run i18n:check     # da raiz do repositório
```

O validador varre `pages/`, `src/` e `features/` (as que existirem), lê os
locales do `project.inlang/settings.json` e resolve os catálogos relativo ao
próprio pacote — roda de qualquer diretório.

## Adicionar uma mensagem

1. Adicione a chave nos **três** catálogos (`pt-BR`, `en`, `es`). Faltar em
   qualquer um é erro fatal, não aviso.
2. Declare a chave no `*.messages.schema.json` da rota/formulário que a consome.
3. Referencie no resolver irmão: `minhaChave: m.minha_chave({}, { locale })`.
4. `bun run i18n:compile && bun run i18n:check`.

A tipagem fecha o ciclo: o retorno do resolver **é** a interface de texto que o
componente exige (`ProductListText`, `ContainerFormText`, …), então esquecer uma
chave quebra o `tsc`, não a tela em produção.

## Adicionar um locale

Inclua o código em `project.inlang/settings.json` (`locales`), crie
`messages/<locale>.json` completo e estenda o tipo `Locale` no ViewModel.
O `i18n:check` passa a exigir o novo locale automaticamente.
