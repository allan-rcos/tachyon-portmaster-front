# Testes

O guia completo — o que mockar em cada camada, por que o MSW saiu e como usar as
factories — está junto do código, em
[`src/testing/README.md`](../../src/testing/README.md).

Resumo:

| Camada            | Mocka                  | Verifica                                |
| ----------------- | ---------------------- | --------------------------------------- |
| Model             | `fetch`                | codificação do wire, mapeamento de erro |
| ViewModel (query) | `@model/<recurso>`     | tradução de parâmetros                  |
| ViewModel (tela)  | queries e mutations    | transições de sinal                     |
| View (island)     | mutations do ViewModel | a chamada feita e a validação           |
| View (componente) | nada                   | o que é renderizado                     |

```bash
bun run test         # suíte completa
bun run test:watch   # durante o desenvolvimento
```

Testes ficam **colados ao código** (`*.test.ts` ao lado do fonte), nunca num
diretório espelho.
