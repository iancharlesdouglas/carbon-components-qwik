import { ItemToString } from './../../components/dropdown/dropdown';
import { QwikKeyboardEvent, Signal, PropFunction } from '@builder.io/qwik';
import { KeyCodes } from '../key-codes';
import { Item } from '../../components/dropdown/dropdown';
import { ListBoxDimensions } from '../../components/list-box/list-box-menu';

/**
 * Keys state
 */
export type Keys = {
  typed: string[];
  reset: boolean;
  timer?: number;
};

/**
 * Combobox listbox popup state
 */
export type State = {
  isOpen: boolean;
};

/**
 * Keydown handler for combobox
 * @param event Key event
 * @param keys Keys state
 * @param highlightedOption Currently highlighted option
 * @param items Items in the list
 * @param state State of the listbox
 * @param selectedOption Currently selected option
 * @param onSelect$ Select handler
 * @param listBoxDimensions Listbox dimensions as measured
 * @param defaultItemToString Default item to string converter
 * @param triggerElement Triggering element
 */
export const handleKeyDown = async (
  event: QwikKeyboardEvent<HTMLDivElement>,
  keys: Keys,
  highlightedOption: Signal<Item | undefined>,
  items: Item[] | undefined,
  state: State,
  selectedOption: Item | undefined,
  onSelect$: PropFunction<(item: Item) => void> | undefined,
  listBoxDimensions: ListBoxDimensions,
  defaultItemToString: ItemToString,
  triggerElement: Signal<Element | undefined>
) => {
  switch (event.keyCode) {
    case KeyCodes.DownArrow: {
      keys.typed = [];
      keys.reset = true;
      if (highlightedOption.value && items) {
        const currentIndex = items.indexOf(highlightedOption.value);
        if (currentIndex < items.length - 1) {
          highlightedOption.value = items[currentIndex + 1];
        }
      } else if (items) {
        state.isOpen = true;
        if (event.getModifierState && !event.getModifierState('Alt')) {
          highlightedOption.value = items[0];
        }
      }
      break;
    }
    case KeyCodes.UpArrow: {
      keys.typed = [];
      keys.reset = true;
      if (state.isOpen) {
        if (event.getModifierState && event.getModifierState('Alt')) {
          selectedOption = highlightedOption.value;
          state.isOpen = false;
          onSelect$ && onSelect$(selectedOption!);
        } else {
          if (highlightedOption.value && items) {
            const currentIndex = items.indexOf(highlightedOption.value);
            if (currentIndex > 0) {
              highlightedOption.value = items[currentIndex - 1];
            }
          }
        }
      } else if (items) {
        state.isOpen = true;
        if (event.getModifierState && !event.getModifierState('Alt')) {
          highlightedOption.value = items[0];
        }
      }
      break;
    }
    case KeyCodes.Enter:
    case KeyCodes.Space:
    case KeyCodes.Tab: {
      if (state.isOpen) {
        selectedOption = highlightedOption.value;
        onSelect$ && onSelect$(selectedOption!);
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
          highlightedOption.value = items[0];
        }
      }
      break;
    }
    case KeyCodes.End: {
      state.isOpen = true;
      keys.typed = [];
      keys.reset = true;
      if (items) {
        highlightedOption.value = items[items.length - 1];
      }
      break;
    }
    case KeyCodes.PageDown: {
      if (listBoxDimensions.visibleRows) {
        if (highlightedOption.value && items) {
          const currentIndex = items.indexOf(highlightedOption.value);
          if (currentIndex > -1 && currentIndex + listBoxDimensions.visibleRows <= items.length) {
            highlightedOption.value = items[currentIndex + listBoxDimensions.visibleRows];
          }
        }
      }
      break;
    }
    case KeyCodes.PageUp: {
      if (listBoxDimensions.visibleRows) {
        if (highlightedOption.value && items) {
          const currentIndex = items.indexOf(highlightedOption.value);
          if (currentIndex > -1 && currentIndex - listBoxDimensions.visibleRows >= 0) {
            highlightedOption.value = items[currentIndex - listBoxDimensions.visibleRows];
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
          ? items?.filter(item => defaultItemToString(item).substring(0, 1).toLowerCase() === event.key)?.[
              keys.typed.length - 1
            ]
          : items?.find(
              item => defaultItemToString(item).substring(0, keys.typed.length).toLowerCase() === keys.typed.join('')
            );
        highlightedOption.value = matchingItem;
        if (
          repeatedKey &&
          items?.filter(item => defaultItemToString(item).substring(0, 1).toLowerCase() === event.key)?.length ===
            keys.typed.length
        ) {
          keys.typed = [];
        }
      }
    }
  }
};
