import type { PageContextServer } from 'vike/types';

import { getContainer } from '@/features/containers/loaders/getContainer';
import type { IncomingHeaders } from '@/services/clients/server';
import { resolveLocale, loadMessages } from '@/shared/i18n/server';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const locale = resolveLocale(headers);
  const t = loadMessages(locale, 'containers');
  const container = await getContainer(id, headers);
  return { id, container, t, title: `${t.edit} ${container.code}`, description: t.subtitle };
}
