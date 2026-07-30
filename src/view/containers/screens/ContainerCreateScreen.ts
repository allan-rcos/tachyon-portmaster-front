import { ContainerForm } from '@view/containers/islands/ContainerForm.island';
import { Breadcrumbs } from '@view/core/components/Breadcrumbs';
import { PageHeader } from '@view/core/components/PageHeader';
import type { ContainerCreateVM } from '@viewmodel/containers/container-create-page.vm';
import { html, type TemplateResult } from 'lit';

/** Props da tela de registro de contêiner. */
export interface ContainerCreateScreenProps {
  /** ViewModel da rota, construído no `+Page`. */
  vm: ContainerCreateVM;
}

/**
 * Tela de registro de contêiner. Stateless: só o formulário.
 *
 * @param props.vm ViewModel da rota.
 */
export function ContainerCreateScreen(props: ContainerCreateScreenProps): TemplateResult {
  const { vm } = props;

  return html`<section>
    ${Breadcrumbs({ items: [{ label: vm.t.title, href: vm.listHref }, { label: vm.t.new }] })}
    ${PageHeader({ title: vm.t.new })} ${ContainerForm({ vm })}
  </section>`;
}
