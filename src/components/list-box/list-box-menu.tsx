import { QwikIntrinsicElements, Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';

/**
 * ListBoxMenu props
 * @property {string} id - ID
 * @property {boolean} scrollToBottom - Whether to scroll to the bottom of the list
 */
export type ListBoxMenuProps = QwikIntrinsicElements['div'] & {
  id?: string;
  scrollToBottom: boolean;
};

/**
 * ListBoxMenu
 */
export const ListBoxMenu = component$((props: ListBoxMenuProps) => {
  const prefix = usePrefix();
  const { id, scrollToBottom } = props;
  const listBoxElement = useSignal<Element>();
  useVisibleTask$(({ track }) => {
    track(listBoxElement);
    if (scrollToBottom && listBoxElement.value) {
      const children = Array.from(listBoxElement.value.children);
      const childrenHeight = children.reduce((total, child) => total + child.clientHeight, 0);
      if (childrenHeight > listBoxElement.value.clientHeight) {
        listBoxElement.value.scrollTo(0, childrenHeight - listBoxElement.value.clientHeight);
      }
    }
  });
  return (
    <div id={id} class={`${prefix}--list-box__menu`} role="listbox" {...props} ref={listBoxElement}>
      <Slot />
    </div>
  );
});
