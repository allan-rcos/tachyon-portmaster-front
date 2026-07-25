import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid';
import importPlugin from 'eslint-plugin-import';
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

      // Reatividade Solid
      'solid/reactivity': 'warn',
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
                'A View não fala com a camada de dados. Use os tipos de @viewmodel/<feature>/domain e as queries/mutations do ViewModel.',
            },
          ],
        },
      ],
    },
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
