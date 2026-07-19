import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

export default defineConfig({
  locales: ['pt-BR', 'en', 'es'],
  sourceLocale: 'pt-BR',
  catalogs: [
    {
      path: '<rootDir>/shared/i18n/locales/{locale}/messages',
      include: ['<rootDir>/shared/i18n/messages'],
    },
  ],
  format: formatter({ lineNumbers: false }),
});
