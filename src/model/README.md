# Model — a camada de dados

Sabe falar com as fontes de dados, e nada mais. **Não conhece** Vike, Lit,
i18n nem DOM — o lint reprova qualquer um desses imports.

```
model/
  contract/swagger/   submodule: OpenAPI + schemas FlatBuffers
  core/               cliente HTTP, negociação de wire, erros
  common/             vocabulário transversal (status, risco, classe de risco)
  metadata/           catálogo de permissões — o que common/ deixou de fechar
  system/             GET /info do backend
  <recurso>/
    api.ts    funções que fazem a chamada; recebem o cliente por parâmetro
    dto.ts    tipos e constantes — NUNCA funções
    fbs.ts    codecs FlatBuffers (opcional; sem ele, a rota usa JSON)
    index.ts  barril
```

Os bindings do `flatc` NÃO moram aqui: saem em `dist/fbs`, importados por
`@/fbs/*`. Ver [Codegen](#codegen).

## A separação `api` × `dto` é estrutural

Não é organização: é o que impede a interface de alcançar a rede.

`@viewmodel/<feature>/domain.ts` reexporta **só** o `dto` de um recurso. Como
`dto` não contém funções, é impossível uma chamada de API vazar para a View —
não por disciplina, por construção. Se você colocar uma função em `dto.ts`,
quebra essa garantia.

## O Model não constrói clientes

Toda função de API recebe `ApiClient` por parâmetro:

```ts
export const listProducts = (c: ApiClient, query?: Record<string, string>): Promise<ProductList> =>
  wire(c, { method: 'GET', path: '/v1/products', query });
```

Quem monta o cliente — com baseURL, cookie e formato de wire — é o ViewModel
(`@viewmodel/core/client/api-client`). Isso mantém o Model puro e testável, e é
o que permite a mesma função servir o SSR (loopback) e o navegador (`/api`).

## Wire: JSON ou FlatBuffers

`wire()` escolhe pelo cliente: JSON em desenvolvimento e teste, FlatBuffers em
produção. A função de API é a mesma nos dois casos — os codecs em `fbs.ts` são
opcionais, e sem eles a chamada simplesmente usa JSON.

## Codegen

```bash
bun run gen:fbs   # flatc: contract/swagger → dist/fbs
```

A saída vai para `dist/fbs`, que é **gitignorado** e regerado por `gen`, `dev`,
`build`, `test` e `typecheck` — ou seja, o `flatc` PRECISA estar instalado.
Fica fora do lint e do TypeDoc.

O código importa esses bindings por `@/fbs/*`, e nunca por caminho relativo: o
alias é o que permite trocar o destino do build sem tocar em nenhum `fbs.ts`.

Depois de atualizar o submodule do contrato, rode `bun run gen:fbs` **antes** do
typecheck — o erro que aparece sem isso é "Cannot find module `@/fbs/...`", que
descreve o binding faltando e não a mudança de schema que o causou.

## Adicionar uma fonte

API externa, banco local, cache — tudo entra aqui com a mesma forma. Ver
[o guia](../../docs/guides/add-model-source.md).

## JSDoc é obrigatório

Tudo que o Model exporta precisa de JSDoc com descrição — é o que alimenta o
TypeDoc e o autocomplete. O lint reprova sem.

> Cuidado com `eslint --fix` nessas regras: ele insere `@param` vazio, que passa
> no lint e não informa nada. Escreva a descrição.
