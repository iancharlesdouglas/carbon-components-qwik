import { QwikIntrinsicElements, Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { Item } from '../dropdown/dropdown';

/**
 * ListBoxMenu props
 * @property {string} id - ID
 * @property {Item[]} items - Items
 * @property {Item} highlightedItem - Highlighted item
 */
export type ListBoxMenuProps = QwikIntrinsicElements['div'] & {
  id?: string;
  items?: Item[];
  highlightedItem?: Item;
};

/**
 * ListBoxMenu
 */
export const ListBoxMenu = component$((props: ListBoxMenuProps) => {
  const prefix = usePrefix();
  const { id, items, highlightedItem } = props;
  const listBoxElement = useSignal<HTMLDivElement>();
  useVisibleTask$(({ track }) => {
    track(props);
    if (items && highlightedItem && listBoxElement.value) {
      const highlightedIndex = items.indexOf(highlightedItem);
      if (highlightedIndex > -1) {
        const children = Array.from(listBoxElement.value.children);
        const itemHeight = children[0]?.clientHeight;
        const itemTop = highlightedIndex * itemHeight;
        if (itemTop < listBoxElement.value.scrollTop) {
          listBoxElement.value.scrollTo(0, itemTop);
        } else if (itemTop + itemHeight > listBoxElement.value.clientHeight + listBoxElement.value.scrollTop) {
          listBoxElement.value.scrollTo(0, itemTop - itemHeight);
        }
      }
    }
    listBoxElement.value?.focus();
  });
  return (
    <div id={id} class={`${prefix}--list-box__menu`} role="listbox" {...props} ref={listBoxElement}>
      <Slot />
    </div>
  );
});
