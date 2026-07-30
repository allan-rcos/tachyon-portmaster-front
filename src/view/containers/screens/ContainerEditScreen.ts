import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import type { ContainerEditVM } from '@viewmodel/containers/container-edit-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela de edição de contêiner. */
export interface ContainerEditScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ContainerEditVM;
}

/**
 * Tela de edição de contêiner (capacidade máxima). Stateless: o contêiner já
 * veio resolvido pelo `+data`.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerEditScreen(props: ContainerEditScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.code }] })}
    ${PageHeader({ title: `${vm.t.edit} — ${vm.code}` })} ${ContainerForm({ vm })}
  </section>`;
}
