import { QRL, $ } from '@builder.io/qwik';
import { Item } from '../dropdown/dropdown';
import { itemsEqual } from '../../internal/qombobox/items-equal';
import { ComboboxState } from '../../internal/qombobox/qombobox';

/**
 * Toggles selected state of an item
 */
export const toggleItemSelected$ = $((state: ComboboxState, onSelect$?: QRL<(item: Item) => void>) => {
  const item = state.highlightedItem;
  if (item) {
    const selectedItemIndex = state.selectedItems?.findIndex(selectedItem => itemsEqual(selectedItem, item));
    if (selectedItemIndex !== undefined && selectedItemIndex > -1) {
      state.selectedItems = state.selectedItems?.filter(selectedItem => !itemsEqual(selectedItem, item));
    } else {
      const selection = state.selectedItems ?? [];
      selection.push(item);
      state.selectedItems = selection;
    }
    onSelect$ && onSelect$(item);
  }
});
