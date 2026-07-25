# ============================================================
#  Build completo: compila a aplicação E o runtime, e entrega a imagem pronta.
#
#  Três estágios, porque as ferramentas de cada um não têm nada a ver entre si:
#   1. txiki  — compila o `tjs` do fonte. Não há binário Linux publicado, então
#               não dá para simplesmente baixar. É o estágio caro; fica isolado
#               justamente para o cache do Docker reaproveitá-lo entre builds.
#   2. build  — Bun instala e builda. Bun aqui é só ferramenta: não serve nada.
#   3. runtime— Debian slim com o `tjs` e o `dist`. Sem Bun, sem node_modules,
#               sem código-fonte.
#
#  Para buildar a imagem a partir de um `dist/` já pronto (o que o CI faz, para
#  não compilar duas vezes), use o Dockerfile.dist.
# ============================================================

# ---------- 1. runtime txiki.js ----------
FROM debian:bookworm-slim AS txiki

ARG TXIKI_REF=v26.6.0

# libffi e curl são dependências nativas do txiki (FFI e cliente HTTP), não
# opcionais: sem elas o CMake falha ainda na configuração.
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential clang cmake ninja-build git ca-certificates pkg-config \
      libffi-dev libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

# `--recursive` é obrigatório: o txiki traz QuickJS e libuv como submodules.
RUN git clone --recursive --shallow-submodules --depth 1 --branch "${TXIKI_REF}" \
      https://github.com/saghul/txiki.js /usr/src/txiki
WORKDIR /usr/src/txiki

# clang, e não gcc: o fonte usa `#pragma region`, que o gcc não conhece e que,
# sob o `-Werror` do próprio projeto, aborta a compilação a 92%.
ENV CC=clang CXX=clang++
RUN make && strip build/tjs

# ---------- 2. build da aplicação ----------
FROM oven/bun:1 AS build

WORKDIR /app

# Manifests primeiro: enquanto as dependências não mudam, esta camada é cache.
# Os packages entram junto porque são workspaces — o bun precisa deles para
# resolver o lockfile.
COPY package.json bun.lock ./
COPY packages/ ./packages/
RUN bun install --frozen-lockfile

COPY . .

# Compila i18n → dist/paraglide, adapter, cliente, servidor e o bundle do tjs.
RUN bun run build

# ---------- 3. imagem final ----------
FROM debian:bookworm-slim AS runtime

# Só as bibliotecas de RUNTIME das dependências nativas do txiki (o `-dev`
# ficou no estágio de compilação) mais os certificados para TLS de saída.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates libffi8 libcurl4 libatomic1 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --create-home --uid 10001 portmaster

COPY --from=txiki /usr/src/txiki/build/tjs /usr/local/bin/tjs
COPY --from=build --chown=portmaster:portmaster /app/dist /app/dist

USER portmaster
WORKDIR /app

ENV PORT=3000
EXPOSE 3000

# `tjs run` — o bundle é autocontido: o txiki não resolve bare specifiers nem
# node_modules, e é por isso que o build empacota tudo num arquivo só.
CMD ["tjs", "run", "dist/txiki/server.mjs"]
