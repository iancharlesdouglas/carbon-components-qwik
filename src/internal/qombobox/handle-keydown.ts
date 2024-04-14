import { ItemToString } from './../../components/dropdown/dropdown';
import { Signal, QRL } from '@builder.io/qwik';
import { Item } from '../../components/dropdown/dropdown';
import { ListBoxDimensions } from '../../components/list-box/list-box-menu';
import { ComboboxState } from './qombobox';
import { itemsEqual } from './items-equal';
import { itemDisabled } from './item-disabled';
import { Key } from '../key';

/**
 * Keys state
 */
export type Keys = {
  typed: string[];
  reset: boolean;
  timer?: number;
};

/**
 * Function that handles selection of an item
 */
export type Selector = QRL<(state: ComboboxState, onSelect$?: QRL<(item: Item) => void>) => void>;

/**
 * Keydown handler for combobox
 * @param event Key event
 * @param keys Keys state
 * @param items Items in the list
 * @param state State of the listbox
 * @param onSelect$ Select handler
 * @param selector$ Selector function that handles selection of an item
 * @param listBoxDimensions Listbox dimensions as measured
 * @param defaultItemToString Default item to string converter
 * @param triggerElement Triggering element
 */
export const handleKeyDown = async (
  event: KeyboardEvent,
  keys: Keys,
  items: Item[] | undefined,
  state: ComboboxState,
  onSelect$: QRL<(item: Item) => void> | undefined,
  selector$: Selector,
  listBoxDimensions: ListBoxDimensions,
  defaultItemToString: ItemToString,
  triggerElement: Signal<Element | undefined>
) => {
  switch (event.key) {
    case Key.DownArrow: {
      keys.typed = [];
      keys.reset = true;
      if (state.highlightedItem && items) {
        let currentIndex = items.findIndex(item => itemsEqual(item, state.highlightedItem));
        while (currentIndex < items.length - 1) {
          if (itemDisabled(items[currentIndex + 1])) {
            currentIndex++;
          } else {
            break;
          }
        }
        state.highlightedItem = items[currentIndex + 1];
      } else if (items) {
        state.isOpen = true;
        if (event.getModifierState && !event.getModifierState('Alt')) {
          state.highlightedItem = items[0];
        }
      }
      break;
    }
    case Key.UpArrow: {
      keys.typed = [];
      keys.reset = true;
      if (state.isOpen) {
        if (event.getModifierState && event.getModifierState('Alt')) {
          selector$(state, onSelect$);
        } else {
          if (state.highlightedItem && items) {
            let currentIndex = items.findIndex(item => itemsEqual(item, state.highlightedItem));
            while (currentIndex > 0) {
              currentIndex--;
              if (!itemDisabled(items[currentIndex])) {
                break;
              }
            }
            state.highlightedItem = items[currentIndex];
          }
        }
      } else if (items) {
        state.isOpen = true;
        if (event.getModifierState && !event.getModifierState('Alt')) {
          state.highlightedItem = items[0];
        }
      }
      break;
    }
    case Key.Enter:
    case Key.Space:
    case Key.Tab: {
      if (state.isOpen) {
        selector$(state, onSelect$);
      } else if (event.key !== Key.Tab) {
        state.isOpen = true;
        event.stopPropagation();
      }
      break;
    }
    case Key.Home: {
      state.isOpen = true;
      keys.typed = [];
      keys.reset = true;
      if (event.getModifierState && !event.getModifierState('Alt')) {
        if (items) {
          let currentIndex = 0;
          while (itemDisabled(items[currentIndex]) && currentIndex < items.length - 1) {
            currentIndex++;
          }
          state.highlightedItem = items[currentIndex];
        }
      }
      break;
    }
    case Key.End: {
      state.isOpen = true;
      keys.typed = [];
      keys.reset = true;
      if (items) {
        let currentIndex = items.length - 1;
        while (itemDisabled(items[currentIndex]) && currentIndex > 0) {
          currentIndex--;
        }
        state.highlightedItem = items[currentIndex];
      }
      break;
    }
    case Key.PageDown: {
      if (listBoxDimensions.visibleRows) {
        if (state.highlightedItem && items) {
          let currentIndex = items.findIndex(item => itemsEqual(item, state.highlightedItem));
          if (currentIndex > -1 && currentIndex + listBoxDimensions.visibleRows <= items.length) {
            currentIndex = currentIndex + listBoxDimensions.visibleRows;
            while (itemDisabled(items[currentIndex]) && currentIndex < items.length - 1) {
              currentIndex++;
            }
            state.highlightedItem = items[currentIndex];
          }
        }
      }
      break;
    }
    case Key.PageUp: {
      if (listBoxDimensions.visibleRows) {
        if (state.highlightedItem && items) {
          let currentIndex = items.findIndex(item => itemsEqual(item, state.highlightedItem));
          if (currentIndex > -1 && currentIndex - listBoxDimensions.visibleRows >= 0) {
            currentIndex = currentIndex - listBoxDimensions.visibleRows;
            while (itemDisabled(items[currentIndex]) && currentIndex > 0) {
              currentIndex--;
            }
            state.highlightedItem = items[currentIndex];
          }
        }
      }
      break;
    }
    case Key.Escape: {
      state.isOpen = false;
      if (!state.highlightSelectedItem) {
        state.highlightedItem = undefined;
      }
      (triggerElement.value as HTMLButtonElement).focus();
      break;
    }
    default: {
      if (/[A-Za-z]/.test(event.key)) {
        state.isOpen = true;
        keys.reset = true;
        keys.typed.push(event.key);
        const repeatedKey = keys.typed.every(key => key === event.key);
        const matchingItem = repeatedKey
          ? items?.filter(
              item => defaultItemToString(item)?.substring(0, 1).toLowerCase() === event.key && !itemDisabled(item)
            )?.[keys.typed.length - 1]
          : items?.find(
              item =>
                defaultItemToString(item)?.substring(0, keys.typed.length).toLowerCase() === keys.typed.join('') &&
                !itemDisabled(item)
            );
        state.highlightedItem = matchingItem;
        if (
          repeatedKey &&
          items?.filter(
            item => defaultItemToString(item)?.substring(0, 1).toLowerCase() === event.key && !itemDisabled(item)
          )?.length === keys.typed.length
        ) {
          keys.typed = [];
        }
      }
    }
  }
};
