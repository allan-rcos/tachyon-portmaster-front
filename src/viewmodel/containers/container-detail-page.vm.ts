// ============================================================
//  Rota /painel/conteineres/@id.
//
//  A tela mais composta do produto: resumo do contêiner + manifesto de carga +
//  telemetria + ações. Tudo é resolvido no `+data`, em duas buscas PARALELAS —
//  o resumo e o catálogo de produtos que o editor de manifesto oferece são
//  recursos independentes, e serializar as chamadas só somaria latência.
//
//  Ver `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { ContainerStatus, Permission } from '@model/common';
import type { CargoManifestItem, TelemetryLogItem } from '@model/containers/dto';
import {
  CONTAINER_STATUS_LABEL,
  CONTAINER_STATUS_TONE,
  TELEMETRY_EVENT_LABEL,
  TELEMETRY_EVENT_TONE,
  type Tone,
} from '@viewmodel/core/i18n/labels';
import { resolveLocale, type Locale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import {
  PageNotFoundError,
  routeParam,
  type PageMeta,
  type PageRequest,
} from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import {
  formatDateTime,
  formatNumber,
  formatPercent,
  formatWeight,
} from '@viewmodel/core/utils/formatters';
import { listProducts } from '@viewmodel/products/queries/list-products.query';

import { containerDetailMessages } from './i18n/container-detail-page.messages';
import type { ContainerDetailPageText } from './i18n/container-detail-page.messages';
import { getContainerSummary } from './queries/get-container-summary.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const CONTAINER_DETAIL_PERMISSIONS = [
  Permission.ContainerRead,
  Permission.ContainerSummary,
] as const;

/** Opção de produto oferecida no editor de manifesto. */
export interface ProductOption {
  /** Id opaco base62 do produto. */
  id: string;
  /** Nome exibido na opção. */
  name: string;
}

/** Cabeçalho do contêiner, já em formato de apresentação. */
export interface ContainerFacts {
  /** Id opaco, necessário às ações (lacrar, despachar, excluir). */
  id: string;
  /** Código ISO do contêiner. */
  code: string;
  /** Lacrar é permitido? Decidido AQUI, não na View: é regra de domínio. */
  canSeal: boolean;
  /** Despachar é permitido? Idem. */
  canDispatch: boolean;
  /** Status resolvido para rótulo + tom do selo. */
  statusBadge: { label: string; tone: Tone };
  /** Peso atual já formatado, com unidade. */
  weight: string;
  /** Capacidade máxima já formatada, com unidade. */
  capacity: string;
  /** Ocupação já formatada. */
  occupancy: string;
  /** Destino do link de edição. */
  editHref: string;
}

/** Uma linha do manifesto de carga, já formatada. */
export interface ManifestRowData {
  /** Id do produto, usado como chave de lista. */
  productId: string;
  /** Nome do produto. */
  productName: string;
  /** Quantidade já formatada. */
  quantity: string;
  /** Peso já formatado, com unidade. */
  weight: string;
}

/** Um evento de telemetria, já formatado. */
export interface TelemetryRowData {
  /** Id do evento, usado como chave de lista. */
  id: string;
  /** Evento resolvido para rótulo + tom do selo. */
  event: { label: string; tone: Tone };
  /** Descrição livre do evento. */
  description: string;
  /** Timestamp ISO, para o atributo `datetime`. */
  timestamp: string;
  /** Timestamp já formatado, para exibição. */
  formattedTimestamp: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ContainerDetailPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto do cluster inteiro, já no locale do request. */
  t: ContainerDetailPageText;
  /** Cabeçalho do contêiner. */
  facts: ContainerFacts;
  /** Manifesto de carga, já formatado. */
  manifest: readonly ManifestRowData[];
  /** Eventos recentes, já formatados. */
  logs: readonly TelemetryRowData[];
  /** Catálogo oferecido pelo editor de manifesto. */
  products: readonly ProductOption[];
  /** Volta para a listagem — a View não monta rota. */
  listHref: string;
}

/**
 * Converte um item do manifesto na linha que a tela desenha.
 *
 * @param item   Item vindo do Model.
 * @param locale Locale da apresentação.
 */
function toManifestRow(item: CargoManifestItem, locale: Locale): ManifestRowData {
  return {
    productId: item.product_id,
    productName: item.product_name,
    quantity: formatNumber(item.quantity, locale),
    weight: formatWeight(item.weight, locale),
  };
}

/**
 * Converte um evento de telemetria na linha que a tela desenha.
 *
 * @param log    Evento vindo do Model.
 * @param locale Locale da apresentação.
 */
function toTelemetryRow(log: TelemetryLogItem, locale: Locale): TelemetryRowData {
  return {
    id: log.id,
    event: { label: TELEMETRY_EVENT_LABEL[log.event], tone: TELEMETRY_EVENT_TONE[log.event] },
    description: log.description,
    timestamp: log.timestamp,
    formattedTimestamp: formatDateTime(log.timestamp, locale),
  };
}

/**
 * O trabalho de servidor da rota: autorização, i18n, resumo e catálogo.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem `ContainerRead` + `ContainerSummary`.
 * @throws {PageNotFoundError} Quando o id não corresponde a um contêiner.
 */
export async function createContainerDetailPageInput(
  request: PageRequest,
): Promise<ContainerDetailPageInput> {
  const account = await authorize(request, CONTAINER_DETAIL_PERMISSIONS);
  const locale = resolveLocale(request.headers);
  const t = containerDetailMessages(locale);
  const id = routeParam(request, 'id');

  const [summary, products] = await Promise.all([
    getContainerSummary(id, request.headers).catch(() => {
      throw new PageNotFoundError(`Contêiner não encontrado: ${id}`);
    }),
    listProducts(request.headers),
  ]);

  const c = summary.container;
  const occupancy = c.max_capacity ? Math.round((c.current_weight / c.max_capacity) * 1000) / 10 : 0;

  return {
    meta: { title: `${t.title} — ${c.code}`, description: t.summary },
    shell: shellIdentity(account),
    t,
    facts: {
      id: c.id,
      code: c.code,
      canSeal: c.status === ContainerStatus.Empty || c.status === ContainerStatus.Loading,
      canDispatch: c.status === ContainerStatus.Sealed,
      statusBadge: {
        label: CONTAINER_STATUS_LABEL[c.status],
        tone: CONTAINER_STATUS_TONE[c.status],
      },
      weight: formatWeight(c.current_weight, locale),
      capacity: formatWeight(c.max_capacity, locale),
      occupancy: formatPercent(occupancy, locale),
      editHref: `/painel/conteineres/${c.id}/editar`,
    },
    manifest: summary.manifest.map((item) => toManifestRow(item, locale)),
    logs: summary.recent_logs.map((log) => toTelemetryRow(log, locale)),
    products: products.data.map((p) => ({ id: p.id, name: p.name })),
    listHref: '/painel/conteineres',
  };
}

/** Superfície do detalhe de contêiner. */
export interface ContainerDetailVM {
  /** Texto do cluster inteiro. */
  t: ContainerDetailPageText;
  /** Cabeçalho do contêiner. */
  facts: ContainerFacts;
  /** Manifesto de carga, já formatado. */
  manifest: readonly ManifestRowData[];
  /** Eventos recentes, já formatados. */
  logs: readonly TelemetryRowData[];
  /** Catálogo oferecido pelo editor de manifesto. */
  products: readonly ProductOption[];
  /** Volta para a listagem. */
  listHref: string;
}

/**
 * Cria o ViewModel do detalhe a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createContainerDetailVM(input: ContainerDetailPageInput): ContainerDetailVM {
  return {
    t: input.t,
    facts: input.facts,
    manifest: input.manifest,
    logs: input.logs,
    products: input.products,
    listHref: input.listHref,
  };
}
