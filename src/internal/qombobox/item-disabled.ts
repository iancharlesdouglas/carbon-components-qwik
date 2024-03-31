import { Item } from '../../components/dropdown/dropdown';

/**
 * Whether an item is disabled
 * @param item Item
 * @returns True if the item is disabled
 */
export const itemDisabled = (item: Item) => {
  if (typeof item === 'string') {
    return false;
  } else {
    return item.disabled;
  }
};
