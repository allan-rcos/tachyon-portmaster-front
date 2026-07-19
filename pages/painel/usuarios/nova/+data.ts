import type { PageContextServer } from 'vike/types';

import { listRoles } from '@/features/roles/loaders/listRoles';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'users');
  const roles = await listRoles(headers);
  return {
    t,
    title: t.new,
    description: t.subtitle,
    roles: roles.data.map((r) => ({ id: r.id, name: r.name })),
  };
}
