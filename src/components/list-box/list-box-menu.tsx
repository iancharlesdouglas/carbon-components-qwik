import { QwikIntrinsicElements, Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';

/**
 * Scroll position
 */
export enum ScrollPosition {
  Top = 'top',
  Bottom = 'bottom',
}

/**
 * ListBoxMenu props
 * @property {string} id - ID
 * @property {boolean} scrollToBottom - Whether to scroll to the bottom of the list
 */
export type ListBoxMenuProps = QwikIntrinsicElements['div'] & {
  id?: string;
  scrollPosition: ScrollPosition;
};

/**
 * ListBoxMenu
 */
export const ListBoxMenu = component$((props: ListBoxMenuProps) => {
  const prefix = usePrefix();
  const { id, scrollPosition } = props;
  const listBoxElement = useSignal<HTMLDivElement>();
  useVisibleTask$(({ track }) => {
    track(props);
    if (scrollPosition === ScrollPosition.Bottom && listBoxElement.value) {
      const children = Array.from(listBoxElement.value.children);
      const childrenHeight = children.reduce((total, child) => total + child.clientHeight, 0);
      if (childrenHeight > listBoxElement.value.clientHeight) {
        listBoxElement.value.scrollTo(0, childrenHeight - listBoxElement.value.clientHeight);
      }
    } else if (scrollPosition === ScrollPosition.Top && listBoxElement.value) {
      listBoxElement.value.scrollTo && listBoxElement.value.scrollTo(0, 0);
    }
  });
  return (
    <div id={id} class={`${prefix}--list-box__menu`} role="listbox" {...props} ref={listBoxElement}>
      <Slot />
    </div>
  );
});
