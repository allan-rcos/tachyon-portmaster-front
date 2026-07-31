# View — a interface

Recebe dados prontos e desenha. **Nunca importa `@model`** e nunca fala com a
rede — o lint reprova.

JSX com **[Solid](https://solidjs.com)**, compilado pelo `vite-plugin-solid`.

```
view/
  core/
    components/  design system (Card, Badge, RowList, CardList, Icon…)
    layouts/     AppShell
    islands/     interativos transversais (ConfirmDialog, InfiniteList…)
    observable/  toAccessor — a ponte alien-signals → Solid
    styles/      global.scss
    testing/     stub-location — stub de domínio, não harness
  <feature>/
    components/  SSR puros, recebem props
    islands/     *.island.tsx — interativos, hidratados no cliente
    screens/     ligam o ViewModel aos componentes
    styles/      SCSS de página
```

## Os três papéis

|               | busca dados?     | guarda estado?  | recebe        |
| ------------- | ---------------- | --------------- | ------------- |
| **component** | não              | não             | props prontas |
| **island**    | não (chama o VM) | só estado de UI | o ViewModel   |
| **screen**    | não              | não             | o ViewModel   |

Nenhum dos três busca dados: quando a tela renderiza, o `+data` da rota já
resolveu tudo. E nenhum dos três formata: pesos, datas e percentuais chegam como
string, do ViewModel.

**Estado de formulário não mora aqui.** Valores, campos tocados, "está enviando"
e "falhou" são estado de aplicação, e vivem no ViewModel da rota. O que sobra na
View é estado de interface pura — um diálogo aberto, um drawer visível, um
observador de viewport ligado — e isso é o que justifica um island.

## Componentes são funções

```tsx
export function Badge(props: BadgeProps): JSX.Element {
  return (
    <span class={styles.badge} data-tone={props.tone ?? 'neutral'}>
      {props.children}
    </span>
  );
}
```

Nada de desestruturar `props`: a reatividade granular do Solid vive nos getters
do objeto, e desestruturar a congela na primeira leitura. O lint reprova
(`solid/no-destructure`).

## Islands

Island aqui é componente comum — o que o distingue é guardar estado:

```tsx
export function SidebarDrawer(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  onCleanup(() => {
    /* listeners de document/window */
  });
  return /* … */;
}
```

Islands **sem** estado próprio são só funções de desenho: um formulário que
recebe `{ vm }`, encaminha eventos e não guarda nada (`LoginForm`,
`ProductForm`) continua no diretório por causa do `.module.scss` ao lado, mas
não tem nada de island.

## O que o island precisa do ViewModel, ele declara

```ts
export interface ProductFormVM {
  value: (field: ProductField) => string;
  error: (field: ProductField) => string | undefined;
  submit: () => Promise<boolean>;
  /* … */
}
```

A interface mora em `@viewmodel/<feature>/vm-contracts` — quem **produz** o
objeto é o ViewModel, e declará-la na View inverteria a dependência. O casamento
é estrutural: a rota de criação e a de edição satisfazem o mesmo contrato, e é
isso que permite ao formulário ser um componente só.

## Reatividade: a ponte `toAccessor`

O ViewModel expõe getters de **alien-signals**, que o Solid não rastreia.
`@view/core/observable/to-accessor` os converte em `Accessor`, e é o **único**
arquivo do projeto que conhece as duas bibliotecas — o preço, deliberado e
contido, de manter o ViewModel independente do framework de interface.

A regra de uso: acessores nascem **no setup** do componente, nunca dentro do JSX.
`toAccessor` cria um signal e um effect; chamá-lo numa expressão rastreada os
recriaria a cada reavaliação.

```tsx
export function ProductForm(props: { vm: ProductFormVM }): JSX.Element {
  const name = {
    value: toAccessor(() => props.vm.value('name')),
    error: toAccessor(() => props.vm.error('name')),
  };
  return <input value={name.value()} />;
}
```

Para getters parametrizados isso significa um acessor por campo, montado a
partir da lista estática de campos. Dentro de `<For>`, um por item — o callback
roda por item, não por render.

## Quem navega é a View

O ViewModel calcula o destino e sinaliza o resultado; tocar `window.location` é
da View. O destino é lido **antes** do `await`: depois dele o callback está fora
do escopo rastreado, que é o que a regra `solid/reactivity` existe para pegar.

```ts
const destination = props.vm.listHref;
void props.vm.submit().then((ok) => {
  if (ok) window.location.href = destination;
});
```

## Estilos

CSS Modules colados ao componente. Ver [o guia](../../docs/guides/styling.md).

## JSDoc

Opcional aqui — um componente Solid se documenta pela assinatura de props. As
regras só garantem que o que existe está correto.
