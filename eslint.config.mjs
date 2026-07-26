import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Ignorados globais (código gerado, build, workspaces, ferramentas)
  {
    ignores: [
      'dist/**',
      'out/**',
      // Submodules e código de terceiros têm lint próprio no repositório de
      // origem. `packages/tachyon-portmaster-i18n` é NOSSO — fica lintável.
      'packages/tachyon-design/**',
      'packages/vike-txiki-adapter/**',
      'packages/vike-lit/**',
      'packages/tachyon-portmaster-sdk/**',
      'node_modules/**',
      '.claude/**',
      'docs/prototype/**',
      // Referência de API gerada pelo TypeDoc (bun run docs:api).
      'docs/api/**',
      'swagger/**',
      // A saída do compilador Paraglide agora vive em `dist/paraglide`, já
      // coberta por `dist/**` acima.
    ],
  },

  tseslint.configs.recommended,
  prettier,

  {
    files: ['**/*.ts'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Regras FLOW
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // As três regras do `eslint-plugin-solid` (`reactivity`, `no-destructure`,
      // `jsx-no-undef`) saíram com o Solid. Não têm equivalente a instalar: elas
      // existiam para policiar a reatividade granular do Solid, que era fácil de
      // perder ao desestruturar props ou ler um sinal fora de escopo rastreado.
      // Com Lit não há escopo rastreado a perder — o template é reavaliado
      // inteiro e o diff decide o DOM.

      // Import order
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],

      // Web Standards — proibir Node.js built-ins (txiki não suporta).
      // `paths` casa nomes de módulo exatos; o `group: ['node:*']` cobre o
      // protocolo node: (inclui subpaths tipo node:fs/promises). Os patterns
      // também barram os diretórios extintos (services/ → SDK; shared/ → core).
      'no-restricted-imports': [
        'error',
        {
          paths: [
            'fs',
            'path',
            'crypto',
            'http',
            'https',
            'net',
            'tls',
            'child_process',
            'os',
            'stream',
            'zlib',
            'buffer',
          ].map((name) => ({
            name,
            message:
              'txiki não suporta Node.js built-ins. Use Web Standards (fetch, URL, crypto.subtle).',
          })),
          patterns: [
            {
              group: ['node:*'],
              message: 'txiki não suporta protocolo node:. Use Web Standards.',
            },
            {
              group: ['@/features', '@/features/*'],
              message:
                'features/ foi dissolvido no MVVM: interface em @view/*, lógica em @viewmodel/*, dados em @model/*.',
            },
            {
              group: ['@/services', '@/services/*', '@/shared', '@/shared/*'],
              message: 'Diretório extinto. Use @model/*, @viewmodel/* ou @view/*.',
            },
          ],
        },
      ],

      // Import relativo que ATRAVESSA diretório (`../`) esconde a camada de
      // destino no specifier, que é justamente onde a regra de dependência
      // (view → viewmodel → model) precisa estar visível — e é o que as regras
      // de fronteira mais abaixo inspecionam. Irmão (`./`) continua liberado:
      // um arquivo referir o vizinho não atravessa fronteira nenhuma.
      'import/no-relative-parent-imports': 'error',
    },
  },

  // ============================================================
  //  JSDoc no que é EXPORTADO por Model e ViewModel — as camadas cujo
  //  consumidor é outro arquivo, e não uma tela. É o que alimenta o TypeDoc e
  //  o que faz o autocomplete explicar a função sem abrir o fonte.
  //
  //  As regras aqui pedem DESCRIÇÃO, não cerimônia: tipo de parâmetro e de
  //  retorno já vivem no TypeScript, e repeti-los na tag só cria duplicação que
  //  envelhece mal. `@param` sem texto é pior que nenhum `@param` — por isso
  //  `require-param-description` é erro, e o autofix (que insere tags vazias)
  //  não deve ser usado para satisfazer estas regras.
  //
  //  Na View o JSDoc é opcional: uma função que recebe props se documenta pela
  //  própria assinatura. Ali as regras só garantem que o que EXISTE está
  //  correto e completo.
  // ============================================================
  {
    files: ['src/model/**/*.ts', 'src/viewmodel/**/*.ts'],
    ignores: ['**/*.test.ts'],
    extends: [jsdoc.configs['flat/recommended-typescript-error']],
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          require: { FunctionDeclaration: true, ClassDeclaration: true },
          contexts: ['TSInterfaceDeclaration'],
        },
      ],
      'jsdoc/require-param': ['error', { checkDestructuredRoots: false }],
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-throws-type': 'off',
      'jsdoc/tag-lines': 'off',
      // Estilo, não conteúdo — o TypeDoc renderiza igual nos dois casos.
      'jsdoc/multiline-blocks': 'off',
    },
  },
  {
    files: ['src/view/**/*.ts'],
    ignores: ['**/*.test.ts'],
    extends: [jsdoc.configs['flat/recommended-typescript']],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/tag-lines': 'off',
      'jsdoc/multiline-blocks': 'off',
      // Componentes documentam props como `@param props.foo` — forma que o
      // plugin não reconhece, mas que é a única legível para uma função que
      // recebe um objeto de props.
      'jsdoc/check-param-names': 'off',
    },
  },

  // ============================================================
  //  Regra de dependência do MVVM:  pages → view → viewmodel → model
  //
  //  Cada camada só enxerga a de baixo. Isso é o que sustenta as promessas da
  //  arquitetura: o Model roda sem DOM, o ViewModel é testável sem renderizar,
  //  e mover uma tela entre servidor e cliente não atravessa camadas.
  //  Documentar não basta — aqui a regra falha o build.
  // ============================================================
  {
    files: ['src/model/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@viewmodel/*', '@view/*', '@/paraglide/*', 'vike', 'vike/*', 'vike-*'],
              message:
                'O Model é a camada mais baixa: dados puros, sem framework, sem i18n, sem UI.',
            },
            {
              group: ['lit', 'lit/*', 'lit-html', 'lit-html/*', '@lit-labs/*', '@lit/*'],
              message: 'O Model não conhece a biblioteca de interface.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/viewmodel/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@view/*'],
              message:
                'O ViewModel não enxerga a View. Se precisa de um tipo declarado lá (ex.: contrato de texto), mova a declaração para @viewmodel/<feature>/i18n/text-contracts.',
            },
            {
              group: [
                'lit',
                'lit/*',
                'lit-html',
                'lit-html/*',
                '@lit-labs/*',
                '@lit/*',
                'vike-lit',
              ],
              message:
                'O ViewModel é agnóstico de framework de interface — é o que o mantém testável sem DOM. Estado de formulário mora aqui, mas em `signal` do alien-signals; quem transforma isso em markup é a View.',
            },
            {
              group: ['vike', 'vike/*'],
              message:
                'O ViewModel não conhece o Vike. Receba `PageRequest` (@viewmodel/core/page/page-request) e deixe a adaptação para a casca em pages/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/view/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          // Nome EXATO, não glob: o `@lit-labs/ssr` tem caminhos bons e ruins
          // sob o mesmo prefixo. Liberados: `lib/render-lit-html.js` e
          // `lib/render-result.js`, que são JS puro. Barrados os quatro abaixo,
          // que arrastam Node built-ins ausentes no txiki.js.
          paths: [
            { name: '@lit-labs/ssr', message: 'A raiz importa lib/dom-shim.js → node-fetch.' },
            {
              name: '@lit-labs/ssr/lib/install-global-dom-shim.js',
              message: 'Importa lib/dom-shim.js → node-fetch.',
            },
            {
              name: '@lit-labs/ssr/lib/module-loader.js',
              message: 'Importa enhanced-resolve.',
            },
            {
              name: '@lit-labs/ssr/lib/render-result-readable.js',
              message:
                'Importa `stream` do Node. Para stream, use `renderToWebStream` do vike-lit (ReadableStream Web).',
            },
          ],
          patterns: [
            {
              group: ['@model/*'],
              message:
                'A View não fala com a camada de dados — e, desde a Etapa 4, também não PRECISA: o ViewModel entrega dado de apresentação (rótulo, tom, opções), não DTO.',
            },
            {
              group: ['vike', 'vike/*', 'vike-*'],
              message:
                'Só @view/core/components/ClientOnly.ts enxerga a integração de rota. Trocá-la deve ser trocar UM arquivo.',
            },
          ],
        },
      ],
    },
  },
  {
    // A única exceção à regra acima: o wrapper existe justamente para embrulhar
    // o `clientOnly` do vike-lit.
    files: ['src/view/core/components/ClientOnly.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['pages/**/*.{ts,js}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@model/*'],
              message:
                'pages/ é composition root do Vike: compõe View e ViewModel, nunca acessa dados direto.',
            },
          ],
        },
      ],
    },
  },

  // A exceção que existia aqui (`solid/reactivity: off` em `screens/`) saiu com
  // o plugin: ela desligava 24 falsos positivos sobre ler `props.vm` fora de
  // escopo rastreado. Sem reatividade granular não há escopo rastreado, e a
  // leitura direta do ViewModel no template passou a ser simplesmente correta.

  // Config e scripts (Vite/Vitest/i18n) rodam em Node — liberam os built-ins.
  {
    files: [
      '*.{js,mjs,cjs,ts}',
      'vite.config.ts',
      'vitest.config.ts',
      'packages/tachyon-portmaster-i18n/bin/**/*.mjs',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
