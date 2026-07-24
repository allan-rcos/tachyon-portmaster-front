import type { Container } from 'tachyon-portmaster-sdk/containers';
import type { PageContextServer } from 'vike/types';

import { containerEditMessages, type ContainerEditText } from './messages';

import { getContainer } from '@/features/containers/loaders/getContainer';
import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';

export interface Data {
  id: string;
  container: Container;
  t: ContainerEditText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const id = pageContext.routeParams.id;
  const headers = pageContext.headers as IncomingHeaders;
  const t = containerEditMessages(resolveLocale(headers));
  const container = await getContainer(id, headers);
  return { id, container, t, title: `${t.edit} ${container.code}`, description: t.subtitle };
}
