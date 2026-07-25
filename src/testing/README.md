# Infraestrutura de teste

Tudo o que os testes compartilham vive aqui. Testes em si ficam **colados ao
código** que exercitam (`*.test.ts` ao lado do fonte), nunca num diretório
espelho — quem abre um arquivo vê o teste dele na mesma pasta.

```
src/testing/
  factories/   fishery + faker: dados com o formato dos DTOs do Model
  zod.ts       geração a partir de um schema Zod do ViewModel
  dom.ts       auxiliares de jsdom (input controlado, stub de location)
  setup.ts     setup global do Vitest
```

## Por que não há mais um mock de API

O projeto mantinha, em `test/msw/`, uma **réplica do backend**: 733 linhas de
rotas, paginação, autenticação por cookie e regras de negócio (lacrar, carregar
manifesto, recalcular peso). Três problemas com isso:

1. **Media o mock, não o código.** Um teste de query passava mesmo com o
   mapeamento de parâmetros errado, desde que o clone concordasse com o erro.
2. **Sai de sincronia.** Quem conhece o contrato da API é o Model. Manter uma
   segunda implementação dele significava atualizar as duas a cada mudança do
   backend — e descobrir a divergência em produção.
3. **Testava a camada errada.** Islands e telas não falam com a API; falam com
   o ViewModel. Interceptar `fetch` para testá-los era atravessar três camadas
   para verificar uma.

Hoje cada teste mocka **a fronteira logo abaixo** do que está exercitando.

## Como testar cada camada

| Camada | Mocka | Verifica |
|---|---|---|
| **Model** | `fetch` | codificação do wire, mapeamento de erro |
| **ViewModel** (query) | `@model/<recurso>` | tradução de parâmetros, formato do retorno |
| **ViewModel** (tela) | as queries/mutations | transições de sinal, montagem do texto |
| **View** (island) | as mutations do ViewModel | a chamada feita, e a validação que a impede |
| **View** (componente) | nada | o que é renderizado, a partir de props |

### Query — o que ela faz é traduzir parâmetros

```ts
vi.mock('@model/products');
const mockedList = vi.mocked(apiListProducts);

it('repassa o cursor da query string', async () => {
  await listProducts(HEADERS, new URLSearchParams({ cursor: '10' }));
  expect(mockedList).toHaveBeenCalledWith(expect.anything(), { limit: '50', cursor: '10' });
});
```

### ViewModel de tela — sem DOM, sem Vike, sem rede

```ts
vi.mock('@viewmodel/products/queries/list-products.query');

it('expõe a falha como estado, sem lançar', async () => {
  vi.mocked(listProducts).mockRejectedValueOnce(new Error('500'));
  const vm = createProductListVM();
  await expect(vm.load()).resolves.toBeUndefined();
  expect(vm.products.status()).toBe('error');
});
```

### Island — verifica a chamada, não o efeito no backend

```ts
vi.mock('@viewmodel/products/mutations/create-product.mutation');

it('cria o produto com a densidade convertida em número', async () => {
  // …preenche e submete…
  expect(vi.mocked(createProduct)).toHaveBeenCalledWith({ name: 'Cimento', density: 1.44, … });
});
```

## Dados de teste

**Factories** (`factories/model.factory.ts`) para DTOs do Model. Ids têm
`sequence`, o resto vem do faker — valores aleatórios expõem testes que dependem,
sem querer, de um dado específico. Use `seedFaker()` só quando o teste precisar
de determinismo real (ex.: snapshot).

```ts
const page = paged(productFactory.buildList(3));
const admin = roleFactory.build({ name: 'Admin' });   // sobrescreve o que importa
```

**`fakeFromSchema`** (`zod.ts`) para entrada válida de formulário a partir de um
schema Zod do ViewModel.

Duas ressalvas, ambas descobertas na prática:

- `@anatine/zod-mock` **não serve**: declara peer `zod@^3` e o projeto está no
  Zod 4. Daí `zod-schema-faker`, importado do subpath **`/v4`** — a entrada raiz
  fala Zod 3 e quebra num `z.object` trivial.
- Schemas com **`z.coerce`** (produto, contêiner, manifesto) não são suportados:
  o gerador não sabe produzir a entrada *antes* da coerção. Para esses, monte o
  objeto do formulário à mão — é o valor que o usuário de fato digita.
