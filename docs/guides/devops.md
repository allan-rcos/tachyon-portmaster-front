# Build, Docker e release

## Comandos

```bash
bun run dev          # Vite + HMR em http://localhost:3000
dagger call build        # adapter → i18n → cliente/servidor → bundle do tjs
bun run start        # roda o build com tjs (precisa do tjs no PATH)

bun run lint         # camadas, JSDoc, ordem de import
dagger call typecheck    # tsc --noEmit
bun run i18n:check   # contrato de tradução
dagger call test
bun run docs:api     # referência TypeDoc em docs/api (gitignorada)
```

## O que o build produz

```
dist/
  paraglide/    funções m.* compiladas (alias @/paraglide)
  client/       assets do navegador
  server/       runtime SSR do Vike
  txiki/        server.mjs — bundle único, autocontido
```

`dist/txiki/server.mjs` é **um arquivo só** de propósito: o txiki.js não resolve
bare specifiers nem `node_modules`.

## Docker

Dois Dockerfiles, com propósitos distintos:

| Arquivo           | O que faz                           | Quando usar              |
| ----------------- | ----------------------------------- | ------------------------ |
| `Dockerfile`      | compila a aplicação **e** o runtime | build local, do zero     |
| `Dockerfile.dist` | empacota um `dist/` já pronto       | CI, e para iterar rápido |

```bash
docker build -t portmaster .                        # tudo
dagger call build export --path dist && docker build -f Dockerfile.dist -t portmaster .   # com dist pronto

docker run --rm -p 3000:3000 portmaster
```

Imagem final: ~98 MB (Debian slim + `tjs` + `dist`). Sem Bun, sem
`node_modules`, sem fonte, e rodando como usuário não-root.

### Por que o txiki é compilado no build

Não há binário Linux publicado do `tjs`. O estágio que o compila fica isolado
justamente para o cache do Docker reaproveitá-lo — só o primeiro build paga.

Três detalhes que custaram uma tentativa cada, e por isso estão fixados:

- `libffi-dev` e `libcurl4-openssl-dev` são obrigatórias; sem elas o CMake falha
  ainda na configuração;
- a compilação usa **clang**, não gcc: o fonte usa `#pragma region`, que o gcc
  não conhece e que, sob o `-Werror` do projeto, aborta a 92%;
- a imagem final precisa de `libatomic1` além de `libffi8` e `libcurl4` — sem
  ela o `tjs` nem inicia.

## CI

`.github/workflows/ci.yml`, em todo push e PR: i18n → lint → tipos → testes →
build → TypeDoc. As verificações baratas primeiro, para um erro de lint não
custar um build inteiro.

**Submodules:** o `.gitmodules` usa URLs SSH, que não funcionam com o token do
Actions. Os workflows aplicam
`git config --global url."https://github.com/".insteadOf "git@github.com:"`
antes do checkout. Isso resolve para submodule **público**; se algum virar
privado, será preciso um PAT no lugar do `GITHUB_TOKEN`.

## Release

`.github/workflows/release.yml` roda em todo push na `main` e publica quando **a
tag `v<version>` do `package.json` ainda não existe** — não numa tag empurrada à
mão. A versão é a fonte da verdade, e publicar vira efeito de um commit revisado.

A condição é a ausência da tag, e não "o `package.json` mudou neste push". As
duas concordam no caminho normal, mas só a primeira continua certa quando uma
run é re-executada, quando vários commits chegam juntos ou quando o histórico é
reescrito — foi um force-push de histórico reescrito que fez a 1.0.0 não sair na
primeira tentativa. A pergunta é feita ao remoto (`git ls-remote`), então a
resposta é o que está publicado, não o que o checkout baixou.

Publica dois artefatos do **mesmo** build:

- `portmaster-dist-vX.Y.Z.zip` — o `dist` pronto para rodar, acompanhado do
  `.zip.sha256` para quem consome conferir o download;
- `ghcr.io/<owner>/portmaster:X.Y.Z` e `:latest` — imagem montada a partir desse
  mesmo zip, via `Dockerfile.dist`.

Buildar uma vez só é o que garante que zip e imagem contêm o mesmo código.

O `dist` é podado antes de virar zip **e** antes de virar imagem: sobram apenas
`client/` e `txiki/server.mjs`. O `server/` já foi embutido no bundle pelo
`Bun.build` do adapter, e `fbs/` e `paraglide/` chegaram aos assets pelos
aliases do Vite — os três só existiam como entrada de build.

Para publicar:

```bash
# edite "version" no package.json
git commit -am "chore: v0.2.0" && git push
```

O workflow revalida tudo antes de publicar — rede de segurança para o caso de o
commit de bump ter chegado por um caminho que pulou o CI.

## Variáveis de ambiente

Ver `.env.example`. As duas que importam:

| Variável                     | Uso                                    |
| ---------------------------- | -------------------------------------- |
| `PUBLIC_ENV__API_BASE_URL`   | chamadas do navegador (default `/api`) |
| `PUBLIC_ENV__API_SERVER_URL` | loopback do SSR para a API             |
| `PORT`                       | porta do servidor (default 3000)       |

O prefixo `PUBLIC_ENV__` expõe a variável ao bundle do cliente — **nunca use
para segredo**.
