import { ItemToString } from './../../components/dropdown/dropdown';
import { QwikKeyboardEvent, Signal, PropFunction } from '@builder.io/qwik';
import { KeyCodes } from '../key-codes';
import { Item } from '../../components/dropdown/dropdown';
import { ListBoxDimensions } from '../../components/list-box/list-box-menu';
import { ComboboxState } from './qombobox';
import { itemsEqual } from './items-equal';
import { itemDisabled } from './item-disabled';

/**
 * Keys state
 */
export type Keys = {
  typed: string[];
  reset: boolean;
  timer?: number;
};

/**
 * Keydown handler for combobox
 * @param event Key event
 * @param keys Keys state
 * @param items Items in the list
 * @param state State of the listbox
 * @param onSelect$ Select handler
 * @param listBoxDimensions Listbox dimensions as measured
 * @param defaultItemToString Default item to string converter
 * @param triggerElement Triggering element
 */
export const handleKeyDown = async (
  event: QwikKeyboardEvent<HTMLDivElement>,
  keys: Keys,
  items: Item[] | undefined,
  state: ComboboxState,
  onSelect$: PropFunction<(item: Item) => void> | undefined,
  listBoxDimensions: ListBoxDimensions,
  defaultItemToString: ItemToString,
  triggerElement: Signal<Element | undefined>
) => {
  switch (event.keyCode) {
    case KeyCodes.DownArrow: {
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
    case KeyCodes.UpArrow: {
      keys.typed = [];
      keys.reset = true;
      if (state.isOpen) {
        if (event.getModifierState && event.getModifierState('Alt')) {
          state.selectedItem = state.highlightedItem;
          state.isOpen = false;
          onSelect$ && onSelect$(state.selectedItem!);
        } else {
          if (state.highlightedItem && items) {
            let currentIndex = items.findIndex(item => itemsEqual(item, state.highlightedItem));
            while (currentIndex > 0) {
              if (itemDisabled(items[currentIndex - 1])) {
                currentIndex--;
              } else {
                break;
              }
            }
            state.highlightedItem = items[currentIndex - 1];
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
    case KeyCodes.Enter:
    case KeyCodes.Space:
    case KeyCodes.Tab: {
      if (state.isOpen) {
        state.selectedItem = state.highlightedItem;
        onSelect$ && onSelect$(state.selectedItem!);
        state.isOpen = false;
      } else if (event.keyCode !== KeyCodes.Tab) {
        state.isOpen = true;
        event.stopPropagation();
      }
      break;
    }
    case KeyCodes.Home: {
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
    case KeyCodes.End: {
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
    case KeyCodes.PageDown: {
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
    case KeyCodes.PageUp: {
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
    case KeyCodes.Escape: {
      state.isOpen = false;
      (triggerElement.value as HTMLButtonElement).focus();
      break;
    }
    default: {
      if (event.keyCode >= 65 && event.keyCode <= 90 && items) {
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
