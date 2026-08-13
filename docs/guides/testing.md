# Testes

```bash
dagger call test         # suíte completa
bunx vitest   # durante o desenvolvimento
```

Testes ficam **colados ao código** (`*.test.ts`/`*.test.tsx` ao lado do fonte),
nunca num diretório espelho. Não há diretório `src/testing/`: o que existia foi
apagado de propósito, para que não houvesse código de teste reutilizado e
massivo no meio do caminho.

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

## Componente: `render` do `@solidjs/testing-library`

```tsx
const { getByText } = render(() => <ProductList vm={vm} />);
expect(getByText('0,58 t/m³')).toBeInTheDocument();
```

O `cleanup()` entre testes está no `afterEach` do `vitest.setup.ts`, junto do
`vi.clearAllMocks()`. Matchers vêm de `@testing-library/jest-dom`.

## Tela com formulário: monte com o VM da rota

O que sobrou para testar com DOM é a **ligação** — o que o usuário digita chega
ao ViewModel, e o que o ViewModel diz aparece na tela. A validação em si já tem
teste sem DOM.

```tsx
const vm = createLoginVM(data);
const { getByLabelText, getByRole } = render(() => <LoginPage vm={vm} />);

fireEvent.input(getByLabelText(t.email), { target: { value: 'ana@portmaster.test' } });
await user.click(getByRole('button', { name: t.submit }));
```

Duas armadilhas que já custaram tempo:

- **A validação nativa do HTML roda antes do seu handler.** Um
  `<input type="email">` com valor malformado faz o navegador (e o jsdom) barrarem
  o envio, e o `submit` nunca dispara. Para exercitar "envio com campo inválido",
  use um campo sem constraint nativa.
- **Erro de campo só aparece depois do blur.** É desenho do ViewModel, não bug:
  validar em cima de quem ainda está digitando é ruído.

## SSR não é coberto pela suíte

O `vitest.config.ts` roda com a condição `browser`, e o `vite-plugin-solid`
compila o JSX para o DOM; o `renderToString` do Solid exige o transform de
servidor. Cobrir "HTML completo na 1ª requisição" exigiria um segundo projeto de
teste com a condição invertida — é uma lacuna consciente, registrada em
`src/view/auth/components/LoginPage.test.tsx`.

## Vitest neste repositório

O paralelismo padrão não sobe os workers em disco lento (`Failed to start forks
worker`). Rodar com `--maxWorkers=2` resolve e é ordens de grandeza mais rápido:

```bash
bunx vitest run --maxWorkers=2
```

Esse sintoma **não** é falha do código sob teste — nenhum teste chegou a rodar.
