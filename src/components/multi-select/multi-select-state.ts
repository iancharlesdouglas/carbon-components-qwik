import { Item } from '../dropdown/dropdown';

/**
 * Multi-select dropdown state
 */
export type MultiSelectState = {
  isOpen: boolean;
  selectedItems: Item[] | undefined;
  highlightedItem: Item | undefined;
};
