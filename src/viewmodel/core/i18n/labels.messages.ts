/**
 * Catálogo dos rótulos de domínio — status de contêiner, classes de risco IMDG,
 * eventos de telemetria e permissões.
 *
 * Resolver ÚNICO e plano de propósito: é ele que o `i18n:check` emparelha com
 * o `labels.messages.schema.json` irmão, fechando o contrato bilateral (chave
 * que existe no catálogo mas ninguém usa, e chave usada que não está no
 * catálogo, viram erro de build). Quem transforma isto nos `Record<Enum, …>`
 * que as telas consomem é o `./labels`.
 *
 * @packageDocumentation
 */
import type { Locale } from './locale';

import { m } from '@/paraglide/messages';

/**
 * Todos os rótulos de domínio, no locale dado.
 *
 * @param locale Locale já resolvido pelo contexto.
 */
export const labelsText = (locale: Locale) => ({
  event_load: m.label_event_load({}, { locale }),
  event_unload: m.label_event_unload({}, { locale }),
  perm_container_create: m.label_perm_container_create({}, { locale }),
  perm_container_delete: m.label_perm_container_delete({}, { locale }),
  perm_container_dispatch: m.label_perm_container_dispatch({}, { locale }),
  perm_container_read: m.label_perm_container_read({}, { locale }),
  perm_container_seal: m.label_perm_container_seal({}, { locale }),
  perm_container_summary: m.label_perm_container_summary({}, { locale }),
  perm_container_update: m.label_perm_container_update({}, { locale }),
  perm_manifest_load: m.label_perm_manifest_load({}, { locale }),
  perm_manifest_unload: m.label_perm_manifest_unload({}, { locale }),
  perm_metrics_read: m.label_perm_metrics_read({}, { locale }),
  perm_permission_list: m.label_perm_permission_list({}, { locale }),
  perm_product_create: m.label_perm_product_create({}, { locale }),
  perm_product_delete: m.label_perm_product_delete({}, { locale }),
  perm_product_read: m.label_perm_product_read({}, { locale }),
  perm_product_update: m.label_perm_product_update({}, { locale }),
  perm_role_create: m.label_perm_role_create({}, { locale }),
  perm_role_list: m.label_perm_role_list({}, { locale }),
  perm_role_update_permissions: m.label_perm_role_update_permissions({}, { locale }),
  perm_user_change_password: m.label_perm_user_change_password({}, { locale }),
  perm_user_create: m.label_perm_user_create({}, { locale }),
  perm_user_delete: m.label_perm_user_delete({}, { locale }),
  perm_user_get: m.label_perm_user_get({}, { locale }),
  perm_user_list: m.label_perm_user_list({}, { locale }),
  perm_user_update: m.label_perm_user_update({}, { locale }),
  perm_user_update_roles: m.label_perm_user_update_roles({}, { locale }),
  res_container: m.label_res_container({}, { locale }),
  res_manifest: m.label_res_manifest({}, { locale }),
  res_metrics: m.label_res_metrics({}, { locale }),
  res_permission: m.label_res_permission({}, { locale }),
  res_product: m.label_res_product({}, { locale }),
  res_role: m.label_res_role({}, { locale }),
  res_user: m.label_res_user({}, { locale }),
  risk_class1: m.label_risk_class1({}, { locale }),
  risk_class2: m.label_risk_class2({}, { locale }),
  risk_class3: m.label_risk_class3({}, { locale }),
  risk_class4: m.label_risk_class4({}, { locale }),
  risk_class5: m.label_risk_class5({}, { locale }),
  risk_class6: m.label_risk_class6({}, { locale }),
  risk_class7: m.label_risk_class7({}, { locale }),
  risk_class8: m.label_risk_class8({}, { locale }),
  risk_class9: m.label_risk_class9({}, { locale }),
  risk_none: m.label_risk_none({}, { locale }),
  status_empty: m.label_status_empty({}, { locale }),
  status_in_transit: m.label_status_in_transit({}, { locale }),
  status_loading: m.label_status_loading({}, { locale }),
  status_sealed: m.label_status_sealed({}, { locale }),
});
