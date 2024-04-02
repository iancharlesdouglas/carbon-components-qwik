import { Item, ItemToString } from '../dropdown/dropdown';

/**
 * Item label comparison function
 */
export type CompareItems = (
  itemA: string | undefined,
  itemB: string | undefined,
  options: { locale: string }
) => number;

/**
 * Default item comparator implementation
 * @param itemA Item A label
 * @param itemB Item B label
 * @param param2 Options: locale
 * @param param2.locale Locale code
 * @returns Comparison
 */
export const defaultCompareItems: CompareItems = (itemA, itemB, { locale }) =>
  itemA && itemB ? itemA.localeCompare(itemB, locale, { numeric: true }) : 0;

/**
 * Sort options
 */
export type SortOptions = {
  selectedItems: Item[] | undefined;
  itemToString: ItemToString;
  compareItems: CompareItems;
  locale: string;
};

/**
 * Sort items function for multi-select -- can handle selected vs non-selected items
 */
export type SortItems = (items: Item[] | undefined, options: SortOptions) => Item[] | undefined;

/**
 * Default sort items implementation
 * @param items Items
 * @param param1 Options
 * @param param1.selectedItems Selected items
 * @param param1.itemToString Item to string function
 * @param param1.compareItems Comparator function
 * @param param1.locale Locale code
 * @returns Sorted items
 */
export const defaultSortItems: SortItems = (items, { selectedItems, itemToString, compareItems, locale }) => {
  items?.sort((itemA, itemB) => {
    const selectedItemA = selectedItems?.includes(itemA);
    const selectedItemB = selectedItems?.includes(itemB);
    if (selectedItemA && !selectedItemB) {
      return -1;
    }
    if (selectedItemB && !selectedItemA) {
      return 1;
    }
    return compareItems(itemToString(itemA), itemToString(itemB), { locale });
  });
  return items;
};
