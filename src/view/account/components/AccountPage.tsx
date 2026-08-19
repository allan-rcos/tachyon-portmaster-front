import { AccountProfile } from '@view/account/components/AccountProfile';
import { AccountForm } from '@view/account/islands/AccountForm.island';
import { PasswordChange } from '@view/account/islands/PasswordChange.island';
import styles from '@view/account/styles/AccountPage.module.scss';
import { Card } from '@view/core/components/Card';
import { Toolbar } from '@view/core/components/Toolbar';
import type { AccountPageVM } from '@viewmodel/account/account-page.vm';
import type { JSX } from 'solid-js';

/** Props da tela da conta própria. */
export interface AccountPageProps {
  /** ViewModel da rota. */
  vm: AccountPageVM;
}

/**
 * Tela da conta própria: resumo + formulários. Stateless.
 *
 * Coluna ÚNICA, como no protótipo. As duas colunas de antes deixavam o cartão
 * de segurança ao lado do de perfil, e uma senha longa apertada em meia largura
 * enquanto sobrava espaço vazio embaixo do resumo. Empilhado, cada cartão tem a
 * largura de leitura e a ordem vira a da tarefa: quem sou → meus dados → minha
 * senha.
 *
 * O cabeçalho passou a ser o `Toolbar` (sobrescrita + título), que é o que
 * todas as outras rotas usam — o par `Breadcrumbs` + `PageHeader` daqui era o
 * último resquício do desenho anterior, e a trilha de um nível só (`Minha
 * conta` → `Minha conta`) não levava a lugar nenhum.
 *
 * Os `ClientOnly` em volta dos formulários saíram: o conteúdo vem do servidor e
 * as islands hidratam por cima, sem esqueleto piscando.
 *
 * @param props.vm ViewModel da rota.
 */
export function AccountPage(props: AccountPageProps): JSX.Element {
  return (
    <section>
      <Toolbar
        eyebrow={props.vm.t.eyebrow}
        title={props.vm.t.title}
        subtitle={props.vm.t.subtitle}
      />
      <div class={styles.grid}>
        <AccountProfile vm={props.vm} />
        <Card title={props.vm.t.profile}>
          <AccountForm vm={props.vm} />
        </Card>
        <Card title={props.vm.t.security}>
          <PasswordChange vm={props.vm} />
        </Card>
      </div>
    </section>
  );
}
