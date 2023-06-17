import { PropFunction, QwikIntrinsicElements, Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { Item } from '../dropdown/dropdown';

/**
 * Measured dimensions
 */
export type ListBoxDimensions = {
  height: number;
  itemHeight: number;
  visibleRows: number;
};

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
  onMeasure$?: PropFunction<(dimensions: ListBoxDimensions) => void>;
};

/**
 * ListBoxMenu
 */
export const ListBoxMenu = component$((props: ListBoxMenuProps) => {
  const prefix = usePrefix();
  const { id, items, highlightedItem, onMeasure$ } = props;
  const listBoxElement = useSignal<HTMLDivElement>();
  useVisibleTask$(({ track }) => {
    track(props);
    if (items && highlightedItem && listBoxElement.value) {
      const children = Array.from(listBoxElement.value.children);
      const itemHeight = children[0]?.clientHeight;
      const highlightedIndex = items.indexOf(highlightedItem);
      if (highlightedIndex > -1) {
        const itemTop = highlightedIndex * itemHeight;
        if (itemTop < listBoxElement.value.scrollTop) {
          listBoxElement.value.scrollTo(0, itemTop);
        } else if (itemTop + itemHeight > listBoxElement.value.clientHeight + listBoxElement.value.scrollTop) {
          listBoxElement.value.scrollTo(0, itemTop - itemHeight);
        }
      }
      if (listBoxElement.value.clientHeight && itemHeight) {
        onMeasure$ &&
          onMeasure$({ height: listBoxElement.value.clientHeight, itemHeight, visibleRows: Math.floor(listBoxElement.value.clientHeight / itemHeight) });
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
