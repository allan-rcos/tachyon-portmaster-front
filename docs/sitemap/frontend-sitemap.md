# PortMaster — Sitemap do frontend (FLOW SSR + Islands)

App single-tenant (sem segmento `@slug`). Auth por cookie `auth_token` + `pages/+guard.ts`
(GET /v1/account; 401 → `/entrar`). Estado de dados **mocado** na camada de transporte
(`services/mocks/`, flag `VITE_USE_MOCKS`, ligado por padrão) — sem backend por ora.

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

- Component (SSR) vs island: ver `.island.tsx`. Islands entram via `ClientOnly` de `vike-solid`
  com `fallback`.
- Título por rota: cada `+data.ts` devolve `title`; único `pages/+Head.tsx` o renderiza (evita a
  acumulação de `<title>` do Vike pela árvore).
- IDs base62 opacos ponta-a-ponta (URL/mocks), sem conversão numérica.
- Rotas ↔ CSVs: `frontend-routes.csv` e `backend-routes.csv` neste diretório.
