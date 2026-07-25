# View — a interface

Recebe dados prontos e desenha. **Nunca importa `@model`** e nunca fala com a
rede — o lint reprova.

```
view/
  core/
    components/  design system (Card, DataTable, Badge, Icon…)
    layouts/     AppShell
    islands/     interativos transversais (ConfirmDialog, ThemeSwitcher…)
    forms/       zodValidator — adaptador Zod → TanStack Form
    observable/  toAccessor e bindMutation — ponte alien-signals → Solid
    screens/     createScreenBinding — cola comum das telas assíncronas
    styles/      global.scss
    utils/       cn(), errText()
  <feature>/
    components/  SSR puros, recebem props
    islands/     *.island.tsx — interativos, hidratados no cliente
    screens/     ligam o ViewModel aos componentes
    styles/      SCSS de página
```

## Os três papéis

|               | busca dados?         | guarda estado?         | recebe        |
| ------------- | -------------------- | ---------------------- | ------------- |
| **component** | não                  | não                    | props prontas |
| **island**    | não (chama mutation) | estado de formulário   | props + `t`   |
| **screen**    | dispara `vm.load()`  | assina os sinais do VM | o ViewModel   |

A **screen** existe para que os componentes permaneçam puros: ela converte
sinais em accessors e trata carregando/erro/retry, e o componente só recebe o
dado pronto. Isso é o que os mantém triviais de testar e indiferentes à origem
dos dados.

## Como os dados chegam

```tsx
export function ProductListScreen(props: { vm: ProductListVM }) {
  const { data, status } = createScreenBinding(props.vm.products, props.vm.load);
  return (
    <AsyncBoundary status={status()} data={data()} /* … */>
      {(page) => <ProductList items={page.data} total={page.total} t={props.vm.t} />}
    </AsyncBoundary>
  );
}
```

`createScreenBinding` assina os sinais e chama `load` no `onMount` — nunca no
SSR, onde o componente é avaliado mas não montado.

## Vocabulário de dados

Tipos vêm de `@viewmodel/<feature>/domain`, que reexporta só o `dto` do Model.
Nenhuma função de API alcança esta camada, por construção.

## Islands

Um island chama **mutations do ViewModel**:

```tsx
const mutation = bindMutation(
  createMutationSignal((v: ProductFormData) => createProduct(v), {
    onSuccess: () => {
      window.location.href = '/painel/produtos';
    },
  }),
);
```

`bindMutation` traz `isPending`/`isError` para a reatividade do Solid.
`zodValidator(schema)` pluga o schema do ViewModel no TanStack Form — e
concentra num único ponto o cast que antes estava espalhado como `as never`.

Não há mais `IslandProvider`: o estado assíncrono é do ViewModel.

## Estilos

CSS Modules colados ao componente. Ver [o guia](../../docs/guides/styling.md).

## JSDoc

Opcional aqui — um componente Solid se documenta pela assinatura de props. As
regras só garantem que o que existe está correto.
