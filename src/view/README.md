# View — a interface

Recebe dados prontos e desenha. **Nunca importa `@model`** e nunca fala com a
rede — o lint reprova.

TypeScript puro com **[Lit](https://lit.dev)**: `html\`\`` é _tagged template_, não
sintaxe. Não há compilador de interface no caminho — o que se importa é o que
roda. **Nenhum `.tsx` no projeto.**

```
view/
  core/
    components/  design system (Card, Badge, RowList, CardList, Icon…)
    layouts/     AppShell
    island/      Island (classe base) + island() (a diretiva que monta)
    islands/     interativos transversais (ConfirmDialog, InfiniteList…)
    styles/      global.scss
    testing/     stub-location — stub de domínio, não harness
    types.ts     Renderable — o que cabe num slot `${…}`
  <feature>/
    components/  SSR puros, recebem props
    islands/     *.island.ts — interativos, hidratados no cliente
    screens/     ligam o ViewModel aos componentes
    styles/      SCSS de página
```

## Os três papéis

|               | busca dados?         | guarda estado?      | recebe        |
| ------------- | -------------------- | ------------------- | ------------- |
| **component** | não                  | não                 | props prontas |
| **island**    | não (chama o VM)     | só estado de UI     | o ViewModel   |
| **screen**    | não                  | não                 | o ViewModel   |

Nenhum dos três busca dados: quando a tela renderiza, o `+data` da rota já
resolveu tudo. E nenhum dos três formata: pesos, datas e percentuais chegam como
string, do ViewModel.

**Estado de formulário não mora aqui.** Valores, campos tocados, "está enviando"
e "falhou" são estado de aplicação, e vivem no ViewModel da rota. O que sobra na
View é estado de interface pura — um diálogo aberto, um drawer visível, um
observador de viewport ligado — e isso é o que justifica um island.

## Componentes são funções

```ts
export function Badge(props: BadgeProps): TemplateResult {
  return html`<span class=${styles.badge} data-tone=${props.tone ?? 'neutral'}>
    ${props.children}
  </span>`;
}
```

Compor é **chamar**: `${Badge({ tone: 'teal', children: role.name })}`. Não há
elemento intermediário nem ciclo de vida — a função executa e acaba.

Tradução do que era Solid:

| Solid                       | Lit                                    |
| --------------------------- | -------------------------------------- |
| `<Show when={x}>`           | ternário + `nothing`                   |
| `<For each={xs}>`           | `xs.map(…)`                            |
| `<Dynamic component={tag}>` | `literal` do `lit/static-html.js`      |
| `classList={{ a: cond }}`   | `classMap({ a: cond })`                |
| `style={{ width }}`         | `styleMap({ width })`                  |
| `onClick=` / `disabled=`    | `@click=` / `?disabled=`               |
| `value=` (controlado)       | `.value=${live(…)}`                    |
| `children: JSX.Element`     | `children: Renderable` (`./core/types`) |

`class=${…}` continua igual. Atenção a uma diferença de HTML: `<span />` é válido
em JSX e **não** em HTML — escreva `<span></span>`.

## Islands

Um island é classe, e é a única coisa da View que guarda estado:

```ts
export class SidebarDrawer extends Island<void> {
  #open = signal(false);
  template(): Renderable { … }
  override dispose(): void { … }   // o que era `onCleanup`
}
```

Monta-se pela diretiva, nunca por `new`:

```ts
html`${island(ConfirmDialog, { title: t.delete, onConfirm: vm.remove })}`
```

O `lit-html` mantém **uma instância de diretiva por posição de template**, e é
isso que dá identidade ao island: o effect raiz reavalia a página inteira e a
instância sobrevive, com os signals intactos. Props novas chegam por `setProps`.

Como as props vão por argumento e não por atributo de DOM, elas **não precisam
ser serializáveis** — callbacks e o próprio ViewModel passam inteiros.

Islands sem estado voltam a ser função: um formulário que só desenha e encaminha
eventos (`LoginForm`, `ProductForm`) não precisa de classe.

## O que o island precisa do ViewModel, ele declara

```ts
export interface ProductFormVM {
  value: (field: ProductField) => string;
  error: (field: ProductField) => string | undefined;
  submit: () => Promise<boolean>;
  /* … */
}
```

A View descreve o que desenha. Os VMs que satisfazem o tipo **não o importam** —
o casamento é estrutural, então a dependência continua indo num sentido só.

## Quem navega é a View

O ViewModel calcula o destino e sinaliza o resultado; tocar `window.location` é
da View:

```ts
void vm.submit().then((ok) => {
  if (ok) window.location.href = vm.listHref;
});
```

## Reatividade

Uma só: `signal`/`computed`/`effect` do **alien-signals**. O `onRenderClient` do
`vike-lit` liga um effect raiz que reavalia o template da página; ler um getter do
ViewModel ali é o que registra a dependência. Não há ponte a manter.

Aresta que vale saber: o `effect` do alien-signals trata o **retorno** como
função de limpeza, e o `render` do lit devolve um `RootPart`. Use corpo em bloco:

```ts
effect(() => {
  render(view(), container);
});
```

## Estilos

CSS Modules colados ao componente. Ver [o guia](../../docs/guides/styling.md).

## JSDoc

Opcional aqui — um componente se documenta pela assinatura de props. As regras só
garantem que o que existe está correto.
