# Adicionar uma fonte de dados ao Model

O Model não é "o SDK da API do PortMaster" — é **a camada de dados**. API
externa, banco local no navegador, cache, arquivo: tudo entra aqui, com a mesma
forma. Quem consome (ViewModel) não deveria distinguir a origem.

## A forma

```
src/model/<fonte>/
  api.ts     as operações (leitura e escrita)
  dto.ts     tipos e constantes — NUNCA funções
  index.ts   barril
```

A regra de ouro é a separação **`api` × `dto`**: `dto` é o que a View pode ver
(via `@viewmodel/<feature>/domain`), `api` é o que só o ViewModel alcança. Se
uma função escapar para o `dto`, a interface ganha acesso à rede.

## API externa

Mesmo desenho do recurso interno, com o seu próprio cliente:

```ts
// src/model/weather/api.ts
import { createClient } from '../core/http';
import type { WeatherReport } from './dto';

// Cliente próprio: baseURL e credenciais diferentes da API do PortMaster.
const client = createClient({ baseURL: 'https://api.exemplo.com', wire: 'json' });

/**
 * Consulta a previsão para um porto.
 *
 * @param portCode Código IATA/UN-LOCODE do porto.
 */
export async function getWeather(portCode: string): Promise<WeatherReport> {
  return client.fetch(`/forecast/${portCode}`);
}
```

Se a fonte precisar de credencial por requisição, receba o cliente por
parâmetro, como faz o recurso interno — mantém a função pura e testável.

## Banco local no navegador (IndexedDB, OPFS…)

Vale a mesma forma. Duas cautelas:

```ts
// src/model/drafts/api.ts

/** Guarda um rascunho de manifesto para retomar depois. */
export async function saveDraft(draft: ManifestDraft): Promise<void> {
  const db = await open(); // aberto sob demanda, não no topo do módulo
  await db.put('drafts', draft);
}
```

1. **Não abra a conexão no topo do módulo.** O Model é importado durante o SSR,
   onde `indexedDB` não existe; abrir sob demanda mantém o módulo carregável nos
   dois lados.
2. **Continue devolvendo DTOs.** O ViewModel não deve receber cursores nem
   objetos do driver.

Se a fonte for exclusivamente de navegador, diga isso no JSDoc — o `+data.ts` de
uma rota SSR não poderá usá-la.

## Depois de criar a fonte

1. `src/viewmodel/<feature>/domain.ts` → `export * from '@model/<fonte>/dto';`
2. Uma query por leitura, uma mutation por escrita.
3. O ViewModel de tela combina as fontes — é o lugar certo para juntar API
   remota com rascunho local, por exemplo.

O que **não** muda: a View continua recebendo dados prontos e não sabe de onde
vieram. Trocar a origem de um dado não deveria tocar um único componente.

## O que o Model não pode fazer

O lint reprova, mas vale saber o porquê:

| Proibido                             | Razão                                   |
| ------------------------------------ | --------------------------------------- |
| importar `@viewmodel/*` ou `@view/*` | é a camada mais baixa                   |
| importar `solid-js` / `@tanstack/*`  | não conhece a biblioteca de interface   |
| importar `vike`                      | não conhece o roteador                  |
| importar `@/paraglide/*`             | mensagem de erro é decisão do ViewModel |
| ler `import.meta.env`                | o app injeta baseURL e credenciais      |
