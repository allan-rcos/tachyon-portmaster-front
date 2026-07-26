// ============================================================
//  Rota /painel — o painel operacional.
//
//  Os KPIs e a divisão de ocupação chegam JÁ FORMATADOS: número com separador,
//  percentual com sufixo, rótulo e tom de cada status. A View só desenha —
//  antes ela fazia `formatNumber`/`formatPercent` e montava os segmentos.
//
//  Ver `@viewmodel/products/product-list-page.vm` para os dois papéis.
// ============================================================
import { Permission } from '@model/common';
import { type Tone } from '@viewmodel/core/i18n/labels';
import { resolveLocale, type Locale } from '@viewmodel/core/i18n/locale';
import { authorize } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { formatDecimal, formatNumber } from '@viewmodel/core/utils/formatters';

import { painelMessages, type PainelPageText } from './i18n/dashboard-page.messages';
import { getMetrics } from './queries/get-metrics.query';

/** Permissões que a rota exige. Antes vivia em `+permissions.js`. */
export const DASHBOARD_PERMISSIONS = [Permission.MetricsRead] as const;

/** Um cartão de KPI, pronto para desenhar. */
/**
 * Ícones que o painel pede — subconjunto FECHADO do vocabulário da View.
 *
 * Declarado aqui, e não como `string`, para que o cartão não precise de cast:
 * a união casa estruturalmente com o `IconName` do `Icon`, e pedir um ícone que
 * a View não tem vira erro de compilação no ponto de uso.
 */
export type StatIcon = 'container' | 'package' | 'weight' | 'flask';

/**
 *
 */
export interface StatTileData {
  /** Chave estável, usada como chave de lista. */
  key: string;
  /** Rótulo traduzido. */
  label: string;
  /** Número já formatado no locale, SEM unidade. */
  value: string;
  /** Unidade que acompanha o número (ex.: `'%'`), quando houver. */
  unit?: string;
  /** Nome do ícone. */
  icon: StatIcon;
  /** Tom de marca do cartão. */
  tone: Tone;
}

/** Uma linha da divisão de ocupação do pátio. */
export interface OccupancyRowData {
  /** Chave estável, usada como chave de lista. */
  key: string;
  /** Rótulo traduzido do status. */
  label: string;
  /** Contagem já formatada. */
  count: string;
  /** Fração de 0 a 100 sobre o total, para a barra. */
  share: number;
  /** Tom de marca da barra e do ponto. */
  tone: Tone;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface DashboardPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale do request. */
  t: PainelPageText;
  /** Cartões de KPI, já formatados. */
  tiles: readonly StatTileData[];
  /** Divisão de ocupação, uma linha por status. */
  occupancy: readonly OccupancyRowData[];
}

/**
 * O trabalho de servidor da rota: autorização, i18n e as métricas.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem a permissão `MetricsRead`.
 */
export async function createDashboardPageInput(request: PageRequest): Promise<DashboardPageInput> {
  const account = await authorize(request, DASHBOARD_PERMISSIONS);
  const locale: Locale = resolveLocale(request.headers);
  const t = painelMessages(locale);
  const metrics = await getMetrics(request.headers);
  const div = metrics.occupancy_division;

  const counts: ReadonlyArray<{ key: string; label: string; count: number; tone: Tone }> = [
    { key: 'loading', label: t.statusLoading, count: div.loading, tone: 'gold' },
    { key: 'sealed', label: t.statusSealed, count: div.sealed, tone: 'sage' },
    { key: 'in_transit', label: t.statusInTransit, count: div.in_transit, tone: 'teal' },
    { key: 'empty', label: t.statusEmpty, count: div.empty, tone: 'neutral' },
  ];
  // Divisor mínimo 1: com o pátio zerado, todas as barras vão a 0% em vez de
  // produzir NaN na largura.
  const total = counts.reduce((sum, c) => sum + c.count, 0) || 1;

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account),
    t,
    tiles: [
      {
        key: 'active',
        label: t.activeContainers,
        value: formatNumber(metrics.active_containers, locale),
        icon: 'container',
        tone: 'gold',
      },
      {
        key: 'total',
        label: t.totalContainers,
        value: formatNumber(metrics.total_containers, locale),
        icon: 'package',
        tone: 'teal',
      },
      {
        key: 'load',
        label: t.yardLoad,
        // Número e unidade separados: o cartão desenha o `%` menor e apagado,
        // como o protótipo faz com `/10` e `t`.
        value: formatDecimal(metrics.yard_load, locale),
        unit: '%',
        icon: 'weight',
        tone: 'orange',
      },
      {
        key: 'products',
        label: t.registeredProducts,
        value: formatNumber(metrics.registered_products, locale),
        icon: 'flask',
        tone: 'sage',
      },
    ],
    occupancy: counts.map((c) => ({
      key: c.key,
      label: c.label,
      count: formatNumber(c.count, locale),
      share: (c.count / total) * 100,
      tone: c.tone,
    })),
  };
}

/** Superfície do painel operacional. */
export interface DashboardVM {
  /** Texto da tela. */
  t: PainelPageText;
  /** Cartões de KPI, já formatados. */
  tiles: readonly StatTileData[];
  /** Divisão de ocupação, uma linha por status. */
  occupancy: readonly OccupancyRowData[];
}

/**
 * Cria o ViewModel do painel a partir do dado já resolvido.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createDashboardVM(input: DashboardPageInput): DashboardVM {
  return { t: input.t, tiles: input.tiles, occupancy: input.occupancy };
}
