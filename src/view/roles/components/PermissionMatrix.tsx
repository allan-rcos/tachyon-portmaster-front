import type { Permission } from '@viewmodel/core/domain';
import { PERMISSION_GROUPS, PERMISSION_LABEL } from '@viewmodel/core/i18n/labels';
import { For, type JSX } from 'solid-js';

import styles from './PermissionMatrix.module.scss';


/** Grade de permissões (RBAC) agrupada por recurso. Controlada pela
 *  island de perfil (recebe seleção + callback). */
export function PermissionMatrix(props: {
  selected: Set<Permission>;
  onToggle: (perm: Permission, checked: boolean) => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <div class={styles.grid}>
      <For each={PERMISSION_GROUPS}>
        {(group) => (
          <fieldset class={styles.group} disabled={props.disabled}>
            <legend class={styles.legend}>{group.label}</legend>
            <For each={group.perms}>
              {(perm) => (
                <label class={styles.item}>
                  <input
                    type="checkbox"
                    checked={props.selected.has(perm)}
                    onChange={(e) => props.onToggle(perm, e.currentTarget.checked)}
                  />
                  <span>{PERMISSION_LABEL[perm]}</span>
                </label>
              )}
            </For>
          </fieldset>
        )}
      </For>
    </div>
  );
}
