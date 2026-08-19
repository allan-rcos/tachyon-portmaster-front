/**
 * Rótulos e "tom" (cor de badge) dos enums do domínio.
 *
 * Os rótulos eram tabelas pt-BR fixas, o que passou despercebido enquanto o
 * idioma vinha de um cookie que ninguém escrevia — na prática o app era só
 * português. Com o idioma no endereço, `/en/painel/conteineres` mostrava
 * "Carregando" e "Classe 3 — Líquidos inflamáveis" no meio de uma tela em
 * inglês. Viraram FUNÇÕES do locale, como `commonText`.
 *
 * Os TONS continuam constantes: cor de badge não é texto, não traduz.
 *
 * @packageDocumentation
 */
import {
  RiskClass,
  type ContainerStatus,
  type TelemetryEvent,
  type Permission,
} from '@model/common';
import type { Locale } from '@viewmodel/core/i18n/locale';
import type { OptionGroup, SelectOption } from '@viewmodel/core/page/options';

import { labelsText } from './labels.messages';

export type Tone = 'gold' | 'sage' | 'teal' | 'orange' | 'danger' | 'neutral';

/**
 * Rótulo de cada status de contêiner, no locale dado.
 *
 * @param locale Locale já resolvido pelo contexto.
 */
export const containerStatusLabels = (locale: Locale): Record<ContainerStatus, string> => {
  const L = labelsText(locale);
  return {
    Empty: L.status_empty,
    Loading: L.status_loading,
    Sealed: L.status_sealed,
    InTransit: L.status_in_transit,
  };
};

export const CONTAINER_STATUS_TONE: Record<ContainerStatus, Tone> = {
  Empty: 'neutral',
  Loading: 'gold',
  Sealed: 'sage',
  InTransit: 'teal',
};

/**
 * Rótulo de cada classe de risco IMDG, no locale dado.
 *
 * @param locale Locale já resolvido pelo contexto.
 */
export const riskClassLabels = (locale: Locale): Record<RiskClass, string> => {
  const L = labelsText(locale);
  return {
    Class1Explosives: L.risk_class1,
    Class2Gases: L.risk_class2,
    Class3FlammableLiquids: L.risk_class3,
    Class4FlammableSolids: L.risk_class4,
    Class5OxidizingSubstances: L.risk_class5,
    Class6ToxicSubstances: L.risk_class6,
    Class7RadioactiveMaterials: L.risk_class7,
    Class8CorrosiveSubstances: L.risk_class8,
    Class9Miscellaneous: L.risk_class9,
    None: L.risk_none,
  };
};

export const RISK_CLASS_TONE: Record<RiskClass, Tone> = {
  Class1Explosives: 'danger',
  Class2Gases: 'orange',
  Class3FlammableLiquids: 'orange',
  Class4FlammableSolids: 'orange',
  Class5OxidizingSubstances: 'gold',
  Class6ToxicSubstances: 'danger',
  Class7RadioactiveMaterials: 'danger',
  Class8CorrosiveSubstances: 'orange',
  Class9Miscellaneous: 'neutral',
  None: 'sage',
};

/**
 * Rótulo de cada evento de telemetria, no locale dado.
 *
 * @param locale Locale já resolvido pelo contexto.
 */
export const telemetryEventLabels = (locale: Locale): Record<TelemetryEvent, string> => {
  const L = labelsText(locale);
  return {
    load: L.event_load,
    unload: L.event_unload,
  };
};

export const TELEMETRY_EVENT_TONE: Record<TelemetryEvent, Tone> = {
  load: 'gold',
  unload: 'orange',
};

/**
 * Rótulo de cada slug de permissão conhecido, no locale dado.
 *
 * `Record<string, ...>` e não `Record<Permission, ...>`: o catálogo é do
 * servidor, então esta tabela é PRESENTACIONAL e parcial por natureza — traduz o
 * que conhece e não pretende ser a lista do que existe. Um slug novo aparece na
 * matriz assim que o backend o registra, com o fallback de
 * {@link permissionLabel}; ninguém precisa mexer aqui para a tela não quebrar.
 *
 * @param locale Locale já resolvido pelo contexto.
 */
const permissionLabels = (locale: Locale): Record<string, string> => {
  const L = labelsText(locale);
  return {
    'product:read': L.perm_product_read,
    'product:create': L.perm_product_create,
    'product:update': L.perm_product_update,
    'product:delete': L.perm_product_delete,
    'container:read': L.perm_container_read,
    'container:create': L.perm_container_create,
    'container:update': L.perm_container_update,
    'container:delete': L.perm_container_delete,
    'container:seal': L.perm_container_seal,
    'container:dispatch': L.perm_container_dispatch,
    'container:summary': L.perm_container_summary,
    'manifest:load': L.perm_manifest_load,
    'manifest:unload': L.perm_manifest_unload,
    'user:get': L.perm_user_get,
    'user:list': L.perm_user_list,
    'user:create': L.perm_user_create,
    'user:update': L.perm_user_update,
    'user:delete': L.perm_user_delete,
    'user:change-password': L.perm_user_change_password,
    'user:update-roles': L.perm_user_update_roles,
    'role:list': L.perm_role_list,
    'role:create': L.perm_role_create,
    'role:update-permissions': L.perm_role_update_permissions,
    'permission:list': L.perm_permission_list,
    'metrics:read': L.perm_metrics_read,
  };
};

/**
 * Rótulo do recurso à esquerda do `:`, para agrupar a matriz.
 *
 * @param locale Locale já resolvido pelo contexto.
 */
const permissionResourceLabels = (locale: Locale): Record<string, string> => {
  const L = labelsText(locale);
  return {
    product: L.res_product,
    container: L.res_container,
    manifest: L.res_manifest,
    user: L.res_user,
    role: L.res_role,
    permission: L.res_permission,
    metrics: L.res_metrics,
  };
};

/**
 * Rótulo de uma permissão, com o slug cru como último recurso.
 *
 * Mostrar `relatorio:exportar` é feio, mas é honesto: a alternativa seria a
 * caixa aparecer sem texto — ou nem aparecer — só porque o backend registrou uma
 * permissão que este arquivo ainda não traduz.
 *
 * @param slug   Slug vindo do catálogo.
 * @param locale Locale já resolvido pelo contexto.
 */
export const permissionLabel = (slug: Permission, locale: Locale): string =>
  permissionLabels(locale)[slug] ?? slug;

/**
 * Opções do seletor de classe de risco, na ordem do enum.
 *
 * A View recebe pares `{ value, label }` em vez do enum: quem garante que o
 * valor escolhido é uma `RiskClass` é o schema do formulário, na submissão.
 *
 * @param locale Locale já resolvido pelo contexto.
 */
export const riskClassOptions = (locale: Locale): readonly SelectOption[] => {
  const labels = riskClassLabels(locale);
  return Object.values(RiskClass).map((value) => ({ value, label: labels[value] }));
};

/**
 * A matriz de permissões como dado de apresentação, pronta para o `PageInput`.
 *
 * Virou FUNÇÃO do catálogo em vez de constante do módulo: a lista de permissões
 * é do servidor agora, então a matriz não pode nascer de uma tabela deste
 * arquivo — ela nasce do que `GET /metadata/permissions` respondeu naquela
 * requisição.
 *
 * O agrupamento sai do próprio slug (`recurso:ação`), não de uma lista paralela:
 * é o que faz uma permissão nova cair no grupo certo sozinha. Recursos
 * conhecidos vêm primeiro, na ordem de `PERMISSION_RESOURCE_LABEL`, e o que o
 * front não conhece é agrupado pelo próprio prefixo, no fim — visível e
 * concedível, ainda que sem tradução.
 *
 * Mesma razão do `RISK_CLASS_OPTIONS`: a View renderiza grupos de caixas com
 * valores opacos; quem cobra que sejam slugs válidos é o backend, na submissão.
 *
 * @param catalog Slugs registrados, na ordem em que o backend os devolveu.
 * @param locale  Locale já resolvido pelo contexto.
 */
export function permissionOptionGroups(
  catalog: readonly Permission[],
  locale: Locale,
): readonly OptionGroup[] {
  const resources = permissionResourceLabels(locale);
  const labels = permissionLabels(locale);
  const byResource = new Map<string, SelectOption[]>();
  for (const resource of Object.keys(resources)) byResource.set(resource, []);

  for (const slug of catalog) {
    const resource = slug.split(':')[0] ?? slug;
    const options = byResource.get(resource) ?? byResource.set(resource, []).get(resource)!;
    options.push({ value: slug, label: labels[slug] ?? slug });
  }

  return [...byResource.entries()]
    .filter(([, options]) => options.length > 0)
    .map(([resource, options]) => ({
      label: resources[resource] ?? resource,
      options,
    }));
}
