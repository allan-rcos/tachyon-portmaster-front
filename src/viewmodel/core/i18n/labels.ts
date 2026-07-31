/**
 * Rótulos pt-BR e "tom" (cor de badge) dos enums do domínio.
 *
 * @packageDocumentation
 */
import {
  RiskClass,
  type ContainerStatus,
  type TelemetryEvent,
  type Permission,
} from '@model/common';
import type { OptionGroup, SelectOption } from '@viewmodel/core/page/options';

export type Tone = 'gold' | 'sage' | 'teal' | 'orange' | 'danger' | 'neutral';

export const CONTAINER_STATUS_LABEL: Record<ContainerStatus, string> = {
  Empty: 'Vazio',
  Loading: 'Carregando',
  Sealed: 'Lacrado',
  InTransit: 'Em trânsito',
};

export const CONTAINER_STATUS_TONE: Record<ContainerStatus, Tone> = {
  Empty: 'neutral',
  Loading: 'gold',
  Sealed: 'sage',
  InTransit: 'teal',
};

export const RISK_CLASS_LABEL: Record<RiskClass, string> = {
  Class1Explosives: 'Classe 1 — Explosivos',
  Class2Gases: 'Classe 2 — Gases',
  Class3FlammableLiquids: 'Classe 3 — Líquidos inflamáveis',
  Class4FlammableSolids: 'Classe 4 — Sólidos inflamáveis',
  Class5OxidizingSubstances: 'Classe 5 — Oxidantes',
  Class6ToxicSubstances: 'Classe 6 — Tóxicos',
  Class7RadioactiveMaterials: 'Classe 7 — Radioativos',
  Class8CorrosiveSubstances: 'Classe 8 — Corrosivos',
  Class9Miscellaneous: 'Classe 9 — Diversos',
  None: 'Sem risco',
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

export const TELEMETRY_EVENT_LABEL: Record<TelemetryEvent, string> = {
  load: 'Carga',
  unload: 'Descarga',
};

export const TELEMETRY_EVENT_TONE: Record<TelemetryEvent, Tone> = {
  load: 'gold',
  unload: 'orange',
};

/**
 * Rótulo pt-BR de cada slug de permissão conhecido.
 *
 * `Record<string, ...>` e não `Record<Permission, ...>`: o catálogo é do
 * servidor, então esta tabela é PRESENTACIONAL e parcial por natureza — traduz o
 * que conhece e não pretende ser a lista do que existe. Um slug novo aparece na
 * matriz assim que o backend o registra, com o fallback de
 * {@link permissionLabel}; ninguém precisa mexer aqui para a tela não quebrar.
 */
export const PERMISSION_LABEL: Record<string, string> = {
  'product:read': 'Ver produtos',
  'product:create': 'Criar produtos',
  'product:update': 'Editar produtos',
  'product:delete': 'Excluir produtos',
  'container:read': 'Ver contêineres',
  'container:create': 'Criar contêineres',
  'container:update': 'Editar contêineres',
  'container:delete': 'Excluir contêineres',
  'container:seal': 'Lacrar contêineres',
  'container:dispatch': 'Despachar contêineres',
  'container:summary': 'Ver resumo de contêineres',
  'manifest:load': 'Carregar manifesto',
  'manifest:unload': 'Descarregar manifesto',
  'user:get': 'Ver usuário',
  'user:list': 'Listar usuários',
  'user:create': 'Criar usuários',
  'user:update': 'Editar usuários',
  'user:delete': 'Excluir usuários',
  'user:change-password': 'Alterar senha de usuários',
  'user:update-roles': 'Atribuir perfis',
  'role:list': 'Listar perfis',
  'role:create': 'Criar perfis',
  'role:update-permissions': 'Editar permissões',
  'permission:list': 'Listar permissões',
  'metrics:read': 'Ver métricas',
};

/** Rótulo pt-BR do recurso à esquerda do `:`, para agrupar a matriz. */
const PERMISSION_RESOURCE_LABEL: Record<string, string> = {
  product: 'Produtos',
  container: 'Contêineres',
  manifest: 'Manifesto',
  user: 'Usuários',
  role: 'Perfis',
  permission: 'Permissões',
  metrics: 'Métricas',
};

/**
 * Rótulo de uma permissão, com o slug cru como último recurso.
 *
 * Mostrar `relatorio:exportar` é feio, mas é honesto: a alternativa seria a
 * caixa aparecer sem texto — ou nem aparecer — só porque o backend registrou uma
 * permissão que este arquivo ainda não traduz.
 *
 * @param slug Slug vindo do catálogo.
 */
export const permissionLabel = (slug: Permission): string => PERMISSION_LABEL[slug] ?? slug;

/**
 * Opções do seletor de classe de risco, na ordem do enum.
 *
 * A View recebe pares `{ value, label }` em vez do enum: quem garante que o
 * valor escolhido é uma `RiskClass` é o schema do formulário, na submissão.
 */
export const RISK_CLASS_OPTIONS: readonly SelectOption[] = Object.values(RiskClass).map(
  (value) => ({ value, label: RISK_CLASS_LABEL[value] }),
);

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
 */
export function permissionOptionGroups(catalog: readonly Permission[]): readonly OptionGroup[] {
  const byResource = new Map<string, SelectOption[]>();
  for (const resource of Object.keys(PERMISSION_RESOURCE_LABEL)) byResource.set(resource, []);

  for (const slug of catalog) {
    const resource = slug.split(':')[0] ?? slug;
    const options = byResource.get(resource) ?? byResource.set(resource, []).get(resource)!;
    options.push({ value: slug, label: permissionLabel(slug) });
  }

  return [...byResource.entries()]
    .filter(([, options]) => options.length > 0)
    .map(([resource, options]) => ({
      label: PERMISSION_RESOURCE_LABEL[resource] ?? resource,
      options,
    }));
}
