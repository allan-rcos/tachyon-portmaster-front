# Documentação

## Arquitetura

- [**MVVM**](architecture/mvvm.md) — as três camadas, a regra de dependência e
  as decisões que a sustentam. Comece por aqui.

## Guias

- [Criar uma feature do zero](guides/add-feature.md) — Model → ViewModel → View
  → rota → testes
- [Adicionar uma página](guides/add-page.md) — inclusive como mover uma rota
  entre servidor e cliente
- [Adicionar uma fonte de dados ao Model](guides/add-model-source.md) — API
  externa, banco local, qualquer infraestrutura
- [i18n](guides/i18n.md) — catálogos, contrato bilateral e resolução de locale
- [Estilos](guides/styling.md) — CSS Modules, design system e tema
- [Testes](guides/testing.md) — o que mockar em cada camada
- [Build, Docker e release](guides/devops.md) — pipeline e publicação

## Referência

- [**API gerada**](api/index.html) — TypeDoc de Model, ViewModel e View.
  Não versionada; gere com `bun run docs:api`.
- [Sitemap do frontend](sitemap/frontend-sitemap.md) e os CSVs de rotas

## READMEs junto do código

Quando a explicação pertence ao diretório, ela mora lá:

- [`src/model`](../src/model/README.md) — a camada de dados
- [`src/viewmodel`](../src/viewmodel/README.md) — a lógica da aplicação
- [`src/view`](../src/view/README.md) — a interface
- [`packages/tachyon-portmaster-i18n`](../packages/tachyon-portmaster-i18n/README.md)

## Protótipo

[`prototype/`](prototype/) guarda o protótipo estático que originou a interface
(HTML/CSS gerados fora do projeto). Referência visual, não código de produção.
