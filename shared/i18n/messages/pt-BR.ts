// ============================================================
//  Compat: mantém a interface anterior (`Messages`/`Namespace` +
//  default com os namespaces resolvidos em pt-BR). A fonte real dos
//  textos agora é `catalog.ts` (descriptors LinguiJS); aqui apenas
//  resolvemos para strings pt-BR (usado em testes e como fallback).
// ============================================================
import { setupI18n } from '@lingui/core';
import type { MessageDescriptor } from '@lingui/core';

import { catalog, type Messages, type Namespace } from './catalog';

export type { Messages, Namespace };

const i18n = setupI18n({ locale: 'pt-BR', messages: { 'pt-BR': {} } });

function resolve(ns: Record<string, MessageDescriptor>): Messages {
  const out: Messages = {};
  for (const [key, desc] of Object.entries(ns)) out[key] = i18n._(desc);
  return out;
}

const resolved = Object.fromEntries(
  Object.entries(catalog).map(([ns, descriptors]) => [ns, resolve(descriptors)]),
) as Record<Namespace, Messages>;

export default resolved;
