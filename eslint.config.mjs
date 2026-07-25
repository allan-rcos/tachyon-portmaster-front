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
              group: ['@/services', '@/services/*'],
              message:
                'services/ foi dissolvido: comunicação com a API vive no SDK (tachyon-portmaster-sdk/*) e o client em @/features/core/api/client.',
            },
            {
              group: ['@/shared', '@/shared/*'],
              message: 'shared/ foi movido para features/core. Use @/features/core/*.',
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
