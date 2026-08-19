/**
 * Catálogo i18n da rota /painel/manifestos. Dono do texto é a página; a View
 * recebe `t` resolvido por prop. `ManifestPageText` é o contrato.
 *
 * @packageDocumentation
 */
import { commonText, valText } from '@viewmodel/core/i18n/common';
import type { Locale } from '@viewmodel/core/i18n/locale';

import type { ManifestPageText } from './text-contracts';

import { m } from '@/paraglide/messages';

export const manifestMessages = (locale: Locale): ManifestPageText => ({
  ...commonText(locale),
  ...valText(locale),
  eyebrow: m.manifests_eyebrow({}, { locale }),
  title: m.manifests_title({}, { locale }),
  subtitle: m.manifests_subtitle({}, { locale }),
  move: m.manifests_move({}, { locale }),
  load: m.manifests_load({}, { locale }),
  unload: m.manifests_unload({}, { locale }),
  loadDesc: m.manifests_load_desc({}, { locale }),
  unloadDesc: m.manifests_unload_desc({}, { locale }),
  container: m.manifests_container({}, { locale }),
  product: m.manifests_product({}, { locale }),
  quantity: m.manifests_quantity({}, { locale }),
  quantityHint: m.manifests_quantity_hint({}, { locale }),
  weightAfter: m.manifests_weight_after({}, { locale }),
  rules: m.manifests_rules({}, { locale }),
  ruleRisk: m.manifests_rule_risk({}, { locale }),
  ruleWeight: m.manifests_rule_weight({}, { locale }),
  ruleSealed: m.manifests_rule_sealed({}, { locale }),
  ruleEmpty: m.manifests_rule_empty({}, { locale }),
  noContainers: m.manifests_no_containers({}, { locale }),
  noProducts: m.manifests_no_products({}, { locale }),
  selectContainer: m.manifests_select_container({}, { locale }),
  selectProduct: m.manifests_select_product({}, { locale }),
  done: m.manifests_done({}, { locale }),
});
