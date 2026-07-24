// Catálogo da rota /painel/conteineres/@id (detalhe). Um único `t` alimenta o
// cluster do detalhe (ContainerSummary + tabela/telemetria + ações/editor de
// manifesto). `summary` é usado só pelo +data (meta). Erros de manifesto via valText.
import { commonText, valText, type CommonText, type ValText } from '@/features/core/i18n/common';
import type { Locale } from '@/features/core/i18n/locale';
import { m } from '@/paraglide/messages';

export type ContainerDetailPageText = CommonText &
  ValText & {
    title: string;
    summary: string;
    weight: string;
    capacity: string;
    occupancy: string;
    manifest: string;
    logs: string;
    emptyManifest: string;
    product: string;
    quantity: string;
    seal: string;
    dispatch: string;
    sealConfirm: string;
    dispatchConfirm: string;
    deleteConfirm: string;
    load: string;
    unload: string;
  };

export const containerDetailMessages = (locale: Locale): ContainerDetailPageText => ({
  ...commonText(locale),
  ...valText(locale),
  title: m.containers_title({}, { locale }),
  summary: m.containers_summary({}, { locale }),
  weight: m.containers_weight({}, { locale }),
  capacity: m.containers_capacity({}, { locale }),
  occupancy: m.containers_occupancy({}, { locale }),
  manifest: m.containers_manifest({}, { locale }),
  logs: m.containers_logs({}, { locale }),
  emptyManifest: m.containers_empty_manifest({}, { locale }),
  product: m.containers_product({}, { locale }),
  quantity: m.containers_quantity({}, { locale }),
  seal: m.containers_seal({}, { locale }),
  dispatch: m.containers_dispatch({}, { locale }),
  sealConfirm: m.containers_seal_confirm({}, { locale }),
  dispatchConfirm: m.containers_dispatch_confirm({}, { locale }),
  deleteConfirm: m.containers_delete_confirm({}, { locale }),
  load: m.containers_load({}, { locale }),
  unload: m.containers_unload({}, { locale }),
});
