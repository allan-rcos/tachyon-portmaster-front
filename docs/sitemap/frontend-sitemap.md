# PortMaster — Sitemap do frontend (FLOW SSR + Islands)

App single-tenant (sem segmento `@slug`). Auth por cookie `auth_token` +
`pages/+guard.ts` (GET /v1/account; 401 → `/entrar`), executado **no servidor**
mesmo nas rotas que renderizam no navegador.

As telas de `/painel` buscam dados no cliente, via ViewModel — o servidor só
roda o guard. As rotas públicas (`/entrar`, `/info`, `/_error`) seguem em SSR com
dados. Ver [a arquitetura](../architecture/mvvm.md).

## Público

- **`/entrar`** — Login (island `LoginForm`). Grava cookie `auth_token` e redireciona.

## Autenticado (`noindex`, guard)

- **`/`** → redireciona para `/painel`.
- **`/painel`** — Painel operacional: KPIs (SSR) + donut de ocupação (island Chart.js, fallback
  barra SSR). Loader `getMetrics`.
- **Contêineres**
  - `/painel/conteineres` — lista (tabela SSR, filtro por código/status, paginação por cursor).
  - `/painel/conteineres/nova` — registrar (island `ContainerForm`).
  - `/painel/conteineres/@id` — resumo: dados + manifesto + telemetria; ações lacrar/despachar/excluir
    (island `ContainerActions`) e carregar/descarregar (island `ManifestEditor`).
  - `/painel/conteineres/@id/editar` — editar capacidade (island `ContainerForm`).
- **Produtos**
  - `/painel/produtos` — catálogo (tabela SSR, classe de risco).
  - `/painel/produtos/nova` · `/painel/produtos/@id/editar` — island `ProductForm` (edição inclui excluir).
- **Usuários (ADMIN)**
  - `/painel/usuarios` — lista com perfis.
  - `/painel/usuarios/nova` · `/painel/usuarios/@id/editar` — island `UserForm` (+`UserAdminActions`: reset de
    senha e exclusão).
- **Perfis / RBAC (ADMIN)**
  - `/painel/perfis` — lista (contagem de usuários e permissões).
  - `/painel/perfis/nova` · `/painel/perfis/@id/permissoes` — island `RoleForm` com matriz de 24 permissões.
- **`/painel/conta`** — perfil próprio (SSR) + island `AccountForm` (dados) + island `PasswordChange`.

## Convenções

- **Camadas:** componente (puro) × island (`*.island.tsx`, interativo) × screen
  (liga o ViewModel aos dois). Islands e screens entram via `ClientOnly` do
  `vike-solid`, com `fallback`.
- **Título por rota:** as rotas de `/painel` declaram `+routeMeta.ts`, que
  reexporta a função de meta do ViewModel; as públicas devolvem `title` no
  `+data.ts`. Um único `pages/+Head.tsx` renderiza os dois casos — o Vike
  acumularia `<title>` se houvesse mais de um `+Head` na árvore.
- **Permissões por rota:** `+permissions.js`, lido pelo guard.
- IDs base62 opacos ponta a ponta, sem conversão numérica.
- Rotas ↔ CSVs: `frontend-routes.csv` e `backend-routes.csv` neste diretório.
