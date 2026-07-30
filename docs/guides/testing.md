# Testes

```bash
bun run test         # suíte completa
bun run test:watch   # durante o desenvolvimento
```

Testes ficam **colados ao código** (`*.test.ts` ao lado do fonte), nunca num
diretório espelho. Não há diretório `src/testing/` e não há harness de render: o
que existia foi apagado de propósito, para que não houvesse código de teste
reutilizado e massivo no meio do caminho.

## O que mockar em cada camada

| Camada                | Mocka                   | Verifica                                |
| --------------------- | ----------------------- | --------------------------------------- |
| Model                 | `fetch`                 | codificação do wire, mapeamento de erro |
| ViewModel (query)     | `@model/<recurso>`      | tradução de parâmetros                  |
| ViewModel (PageInput) | queries + `loadAccount` | autorização, formatação, 404            |
| ViewModel (VM)        | mutations               | validação, submissão, transições        |
| View (componente)     | nada                    | o que é renderizado                     |

Não há MSW: cada teste mocka as funções da camada de baixo de que precisa. A
consequência prática é que um teste falha por causa do código que ele exercita, e
não por causa de um clone de backend que saiu de sincronia com o real.

## A maior parte da suíte não toca DOM

Isso inclui **os formulários**. Como valores, erros e submissão moram no
ViewModel da rota, testar é chamar funções:

```ts
const vm = createProductCreateVM(input);
vm.set('name', 'Cimento');
vm.set('density', '1,44');

await expect(vm.submit()).resolves.toBe(true);
expect(mockedCreate).toHaveBeenCalledWith({ name: 'Cimento', density: 1.44 /* … */ });
```

## Componente: montar é inline, três linhas

```ts
const el = document.createElement('div');
document.body.append(el);
render(ProductList({ vm }), el);

expect(getByText(el, '0,58 t/m³')).toBeInTheDocument();
```

As queries vêm de `@testing-library/dom` na forma que recebe o container
(`getByRole(el, …)`), e os matchers de `@testing-library/jest-dom`. O `cleanup`
entre testes é `document.body.innerHTML = ''` no `afterEach` do
`vitest.setup.ts`.

## Island: monte pela diretiva, dentro de um effect

Um island só redesenha porque algo observa os signals dele. Sem o effect raiz,
clicar muda o estado e a tela não acompanha:

```ts
// Corpo em BLOCO: o `effect` do alien-signals trata o RETORNO como função de
// limpeza, e o `render` do lit devolve um `RootPart`.
const stop = effect(() => {
  render(html`${island(ConfirmDialog, props)}`, el);
});
```

## SSR: para provar que o HTML sai completo

```ts
const html = collectResultSync(renderSsr(LoginPage({ vm })));
expect(html).toContain('type="password"');
```

E o ciclo inteiro, que é como o navegador recebe a página — SSR → hidratação →
interação:

```ts
container.innerHTML = collectResultSync(renderSsr(view()));
const serverForm = container.querySelector('form');
hydrate(view(), container);
// Se a hidratação falhasse, o lit-html teria reconstruído a árvore.
expect(container.querySelector('form')).toBe(serverForm);
```

Do `@lit-labs/ssr`, só `lib/render-lit-html.js` e `lib/render-result.js` são
importáveis — os outros caminhos arrastam built-ins do Node, e o ESLint os
proíbe.

## Vitest neste repositório

O paralelismo padrão não sobe os workers em disco lento (`Failed to start forks
worker`). Rodar com `--maxWorkers=2` resolve e é ordens de grandeza mais rápido:

```bash
bunx vitest run --maxWorkers=2
```

Esse sintoma **não** é falha do código sob teste — nenhum teste chegou a rodar.
