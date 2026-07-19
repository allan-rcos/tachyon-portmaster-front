import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { type JSX } from 'solid-js';

// Cada island interativo carrega seu próprio QueryClient (dedup/estado
// isolado). Sem estado global compartilhado entre islands.
export function IslandProvider(props: { children: JSX.Element }): JSX.Element {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
  });
  return <QueryClientProvider client={client}>{props.children}</QueryClientProvider>;
}
