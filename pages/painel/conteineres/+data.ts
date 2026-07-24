import type { Container } from 'tachyon-portmaster-sdk/containers';
import type { PageContextServer } from 'vike/types';

import { containersListMessages } from './messages';

import type { ContainerListText } from '@/features/containers/components/ContainerList';
import { listContainers } from '@/features/containers/loaders/listContainers';
import type { IncomingHeaders } from '@/features/core/api/client';
import { resolveLocale } from '@/features/core/i18n/locale';

export interface Data {
  items: Container[];
  total: number;
  nextCursor?: string;
  filters: { search: string; status: string };
  t: ContainerListText;
  title: string;
  description: string;
}

export async function data(pageContext: PageContextServer): Promise<Data> {
  const headers = pageContext.headers as IncomingHeaders;
  const t = containersListMessages(resolveLocale(headers));
  const query = new URL(pageContext.urlOriginal, 'http://localhost').searchParams;
  const res = await listContainers(headers, query);
  return {
    items: res.data,
    total: res.total,
    nextCursor: res.next_cursor,
    filters: { search: query.get('search') ?? '', status: query.get('status') ?? '' },
    t,
    title: t.title,
    description: t.subtitle,
  };
}
