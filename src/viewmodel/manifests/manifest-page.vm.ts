/**
 * Rota /painel/manifestos — as duas metades do MVVM desta tela.
 *
 * • `createManifestPageInput` é o DATA: autoriza, resolve texto e traz o que os
 *   dois seletores precisam (contêineres que aceitam movimentação e o catálogo
 *   de produtos), tudo PURO e serializável.
 *
 * • `createManifestVM` é a REATIVIDADE: modo (carregar/descarregar), seleção,
 *   quantidade e a previsão de peso.
 *
 * A tela existe no protótipo e não tinha equivalente aqui: dava para carregar
 * manifesto só de DENTRO do detalhe de um contêiner, o que obriga a saber em
 * qual contêiner a carga vai antes de começar. Esta rota inverte: escolhe-se a
 * operação, depois o contêiner.
 *
 * O trabalho de rede reaproveita a feature de contêineres — `loadManifestItem`
 * e `unloadManifestItem` já existiam para o detalhe, e o schema de validação
 * também. Nada foi duplicado.
 *
 * @packageDocumentation
 */
import { ContainerStatus } from '@model/common/dto';
import type { Container } from '@model/containers/dto';
import type { Product } from '@model/products/dto';
import { loadManifestItem } from '@viewmodel/containers/mutations/load-manifest-item.mutation';
import { unloadManifestItem } from '@viewmodel/containers/mutations/unload-manifest-item.mutation';
import { listContainers } from '@viewmodel/containers/queries/list-containers.query';
import { createLoadItemSchema } from '@viewmodel/containers/schemas/manifest.schema';
import { riskClassLabels } from '@viewmodel/core/i18n/labels';
import type { Locale } from '@viewmodel/core/i18n/locale';
import { authorize, can } from '@viewmodel/core/page/authorize';
import type { PageMeta, PageRequest } from '@viewmodel/core/page/page-request';
import { shellIdentity, type ShellIdentity } from '@viewmodel/core/page/shell';
import { formatWeight } from '@viewmodel/core/utils/formatters';
import { listProducts } from '@viewmodel/products/queries/list-products.query';
import { computed, signal } from 'alien-signals';
import { z } from 'zod';

import { manifestMessages } from './i18n/manifest-page.messages';
import type { ManifestPageText } from './i18n/text-contracts';

/** Permissões para ABRIR a tela: sem os dois catálogos não há o que escolher. */
export const MANIFEST_PAGE_PERMISSIONS = ['container:read', 'product:read'] as const;

/** Permissões de cada modo, avaliadas para habilitar as abas. */
const LOAD_PERMISSIONS = ['manifest:load'] as const;
const UNLOAD_PERMISSIONS = ['manifest:unload'] as const;

/** Os dois sentidos da movimentação. */
export type ManifestMode = 'load' | 'unload';

/** Campos do formulário. */
export type ManifestField = 'container_id' | 'product_id' | 'quantity';

/** Um contêiner no seletor, já em formato de apresentação. */
export interface ContainerOption {
  /** Id opaco base62. */
  id: string;
  /** Código do contêiner (ex.: `CSQU3054383`). */
  code: string;
  /** Peso atual em kg — cru, para a previsão fazer conta. */
  currentWeight: number;
  /** Capacidade máxima em kg — crua, para a previsão fazer conta. */
  maxCapacity: number;
  /** Ocupação já formatada, ex.: `"11.000 kg / 25.000 kg"`. */
  occupancyText: string;
}

/** Um produto no seletor, já em formato de apresentação. */
export interface ProductOption {
  id: string;
  name: string;
  /** Classe de risco resolvida, que o seletor mostra ao lado do nome. */
  riskLabel: string;
}

/** Tudo que a tela precisa para existir. Resolvido ANTES do ViewModel. */
export interface ManifestPageInput {
  /** `<title>`/`<description>` da rota. */
  meta: PageMeta;
  /** Identidade que o rodapé da barra lateral mostra. */
  shell: ShellIdentity;
  /** Texto da tela, já no locale da requisição. */
  t: ManifestPageText;
  /**
   * Contêineres que ACEITAM movimentação.
   *
   * Filtrado aqui, e não na View: "lacrado e despachado não recebem carga" é
   * regra de domínio, e a View não deveria conhecê-la para desabilitar opção.
   */
  containers: readonly ContainerOption[];
  /** Catálogo de produtos, para o segundo seletor. */
  products: readonly ProductOption[];
  /** Permissão de carregar, já avaliada. */
  canLoad: boolean;
  /** Permissão de descarregar, já avaliada. */
  canUnload: boolean;
  /** Locale resolvido, para formatar a previsão igual ao resto. */
  locale: Locale;
}

/**
 * Um contêiner lacrado ou em trânsito está fora de movimentação.
 *
 * @param c Contêiner vindo do Model.
 */
function acceptsMovement(c: Container): boolean {
  return c.status === ContainerStatus.Empty || c.status === ContainerStatus.Loading;
}

/**
 * Converte o DTO do contêiner na opção que o seletor desenha.
 *
 * @param c      Contêiner vindo do Model.
 * @param locale Locale da apresentação.
 */
function toContainerOption(c: Container, locale: Locale): ContainerOption {
  return {
    id: c.id,
    code: c.code,
    currentWeight: c.current_weight,
    maxCapacity: c.max_capacity,
    occupancyText: `${formatWeight(c.current_weight, locale)} / ${formatWeight(c.max_capacity, locale)}`,
  };
}

/**
 * O trabalho de servidor da rota: sessão, permissões, i18n e os dois catálogos.
 *
 * @param request Requisição de página, neutra de framework.
 * @throws {UnauthorizedError} Sem sessão válida.
 * @throws {ForbiddenError} Sem `container:read` + `product:read`.
 */
export async function createManifestPageInput(request: PageRequest): Promise<ManifestPageInput> {
  const account = await authorize(request, MANIFEST_PAGE_PERMISSIONS);
  const locale = request.t();
  const t = manifestMessages(locale);
  const riskLabels = riskClassLabels(locale);

  // Os dois catálogos em paralelo: um não depende do outro.
  const [containerPage, productPage] = await Promise.all([
    listContainers(request.headers),
    listProducts(request.headers),
  ]);

  return {
    meta: { title: t.title, description: t.subtitle },
    shell: shellIdentity(account, request),
    t,
    containers: containerPage.data.filter(acceptsMovement).map((c) => toContainerOption(c, locale)),
    products: productPage.data.map((p: Product) => ({
      id: p.id,
      name: p.name,
      riskLabel: riskLabels[p.risk_class],
    })),
    canLoad: can(account, LOAD_PERMISSIONS),
    canUnload: can(account, UNLOAD_PERMISSIONS),
    locale,
  };
}

/** Valores enquanto se digita — tudo texto, que é o que um controle produz. */
interface Draft {
  container_id: string;
  product_id: string;
  quantity: string;
}

const ALL_FIELDS: readonly ManifestField[] = ['container_id', 'product_id', 'quantity'];

/** Superfície reativa da tela de movimentação. */
export interface ManifestVM {
  /** Texto da tela. */
  t: ManifestPageText;
  /** Contêineres e produtos que os seletores desenham. */
  containers: readonly ContainerOption[];
  products: readonly ProductOption[];
  /** Permissões, já avaliadas no servidor. */
  canLoad: boolean;
  canUnload: boolean;
  /** Modo corrente. */
  mode: () => ManifestMode;
  /** Troca o modo, limpando o resultado da operação anterior. */
  setMode: (mode: ManifestMode) => void;
  /** Descrição que acompanha o modo. */
  description: () => string;
  /** Rótulo do botão de confirmação — é o nome do modo. */
  actionLabel: () => string;
  /** Valor atual de um campo. */
  value: (field: ManifestField) => string;
  /** Erro de um campo, ou `undefined` (só após tocar/enviar). */
  error: (field: ManifestField) => string | undefined;
  /** Escreve um campo. */
  set: (field: ManifestField, value: string) => void;
  /** Marca um campo como tocado, liberando o erro dele. */
  blur: (field: ManifestField) => void;
  /**
   * Peso do contêiner DEPOIS da operação, já formatado.
   *
   * `undefined` enquanto não há contêiner escolhido ou quantidade válida — a
   * View mostra um traço em vez de um número inventado.
   */
  preview: () => string | undefined;
  /** Uma submissão está em voo. */
  submitting: () => boolean;
  /** A última tentativa falhou na API. */
  failed: () => boolean;
  /** A última tentativa deu certo. */
  succeeded: () => boolean;
  /** Valida e movimenta. Nunca rejeita — o erro vira estado. */
  submit: () => Promise<boolean>;
}

/**
 * Cria o ViewModel da tela de movimentação.
 *
 * @param input Dado da rota, vindo do `+data`.
 */
export function createManifestVM(input: ManifestPageInput): ManifestVM {
  const schema = createLoadItemSchema(input.t);
  const initialMode: ManifestMode = input.canLoad ? 'load' : 'unload';

  const mode = signal<ManifestMode>(initialMode);
  const values = signal<Draft>({ container_id: '', product_id: '', quantity: '' });
  const touched = signal<ReadonlySet<ManifestField>>(new Set());
  const submitting = signal(false);
  const failed = signal(false);
  const succeeded = signal(false);

  const problems = computed(() => {
    const v = values();
    const result = schema.safeParse({ product_id: v.product_id, quantity: v.quantity });
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
  });

  const preview = computed(() => {
    const v = values();
    const container = input.containers.find((c) => c.id === v.container_id);
    const amount = Number(v.quantity.replace(',', '.'));
    if (!container || !Number.isFinite(amount) || amount <= 0) return undefined;

    const delta = mode() === 'load' ? amount : -amount;
    const next = Math.min(Math.max(container.currentWeight + delta, 0), container.maxCapacity);
    return formatWeight(next, input.locale);
  });

  return {
    t: input.t,
    containers: input.containers,
    products: input.products,
    canLoad: input.canLoad,
    canUnload: input.canUnload,
    mode,
    setMode: (next) => {
      mode(next);
      succeeded(false);
      failed(false);
    },
    description: () => (mode() === 'load' ? input.t.loadDesc : input.t.unloadDesc),
    actionLabel: () => (mode() === 'load' ? input.t.load : input.t.unload),
    value: (field) => values()[field],
    error: (field) => {
      if (!touched().has(field)) return undefined;
      if (field === 'container_id') {
        return values().container_id ? undefined : input.t.selectContainer;
      }
      return problems()[field]?.[0];
    },
    set: (field, value) => {
      values({ ...values(), [field]: value });
      failed(false);
      succeeded(false);
    },
    blur: (field) => touched(new Set(touched()).add(field)),
    preview,
    submitting,
    failed,
    succeeded,
    submit: async () => {
      const v = values();
      const result = schema.safeParse({ product_id: v.product_id, quantity: v.quantity });
      if (!result.success || !v.container_id) {
        // Enviar inválido revela todos os erros de uma vez.
        touched(new Set(ALL_FIELDS));
        return false;
      }
      submitting(true);
      failed(false);
      succeeded(false);
      try {
        const move = mode() === 'load' ? loadManifestItem : unloadManifestItem;
        await move(v.container_id, result.data);
        succeeded(true);
        values({ ...values(), quantity: '' });
        touched(new Set());
        return true;
      } catch {
        failed(true);
        return false;
      } finally {
        submitting(false);
      }
    },
  };
}
