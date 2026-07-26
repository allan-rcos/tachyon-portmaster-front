import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid';
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
    files: ['**/*.{ts,tsx}'],
    plugins: {
      solid,
      import: importPlugin,
    },
    rules: {
      // Regras FLOW
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Reatividade Solid.
      //
      // `toAccessor` é a nossa ponte alien-signals → Solid: ela monta um
      // `effect` internamente, então a função que recebe É consumida num escopo
      // rastreado. Sem declará-la aqui, a regra acusa toda leitura de ViewModel
      // como reatividade perdida — um falso positivo por rota.
      'solid/reactivity': ['warn', { customReactiveFunctions: ['toAccessor'] }],
      'solid/no-destructure': 'error', // Desestruturar props quebra a reatividade granular
      'solid/jsx-no-undef': 'error',

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
  //  Na View o JSDoc é opcional: um componente Solid se documenta pela
  //  assinatura de props. Ali as regras só garantem que o que EXISTE está
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
    files: ['src/view/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
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
      // plugin não reconhece, mas que é a única legível para JSX.
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
    files: ['src/model/**/*.{ts,tsx}'],
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
              group: ['solid-js', 'solid-js/*', '@tanstack/*'],
              message: 'O Model não conhece a biblioteca de interface.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/viewmodel/**/*.{ts,tsx}'],
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
              group: ['solid-js', 'solid-js/*', 'vike-solid', 'vike-solid/*', '@tanstack/solid-*'],
              message:
                'O ViewModel é agnóstico de framework de interface — é o que o mantém testável sem DOM.',
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
    files: ['src/view/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@model/*'],
              message:
                'A View não fala com a camada de dados — e, desde a Etapa 4, também não PRECISA: o ViewModel entrega dado de apresentação (rótulo, tom, opções), não DTO.',
            },
            {
              group: ['vike', 'vike/*', 'vike-*'],
              message:
                'Só @view/core/components/ClientOnly.tsx enxerga o vike-solid. Trocar de framework de rota deve ser trocar UM arquivo.',
            },
          ],
        },
      ],
    },
  },
  {
    // A única exceção à regra acima: o wrapper existe justamente para embrulhar
    // o `ClientOnly` do vike-solid.
    files: ['src/view/core/components/ClientOnly.tsx'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['pages/**/*.{ts,tsx,js}'],
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

  // As telas recebem um ViewModel instanciado UMA vez pelo `+Page.tsx` e nunca
  // trocado — ler `props.vm` fora de escopo rastreado é correto aqui, e é o que
  // permite assinar os sinais na montagem. A regra não tem como saber disso;
  // desligá-la só neste diretório evita 24 avisos falsos sem afrouxar o resto.
  {
    files: ['src/view/**/screens/**/*.{ts,tsx}'],
    rules: {
      'solid/reactivity': 'off',
    },
  },

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
