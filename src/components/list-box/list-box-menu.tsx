import { QwikIntrinsicElements, Slot, component$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';

/**
 * ListBoxMenu props
 * @property {string} id - ID
 */
export type ListBoxMenuProps = QwikIntrinsicElements['div'] & {
  id?: string;
};

/**
 * ListBoxMenu
 */
export const ListBoxMenu = component$((props: ListBoxMenuProps) => {
  const prefix = usePrefix();
  const { id } = props;
  return (
    <div id={id} class={`${prefix}--list-box__menu`} role="listbox" {...props}>
      <Slot />
    </div>
  );
});
