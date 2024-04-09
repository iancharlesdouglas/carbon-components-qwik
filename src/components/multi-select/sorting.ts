import { QRL, $ } from '@builder.io/qwik';
import { Item, ItemAsString } from '../dropdown/dropdown';
import { itemsEqual } from '../../internal/qombobox/items-equal';

/**
 * Item label comparison function
 */
export type CompareItems = QRL<
  (itemA: string | undefined, itemB: string | undefined, options: { locale: string }) => number
>;

/**
 * Default item comparator implementation
 * @param itemA Item A label
 * @param itemB Item B label
 * @param param2 Options: locale
 * @param param2.locale Locale code
 * @returns Comparison
 */
export const defaultCompareItems$: CompareItems = $((itemA, itemB, { locale }) =>
  itemA && itemB ? itemA.localeCompare(itemB, locale, { numeric: true }) : 0
);

/**
 * Sort options
 */
export type SortOptions = {
  itemToString$: ItemAsString;
  compareItems$: CompareItems;
  locale: string;
};

/**
 * Sort items function for multi-select -- can handle selected vs non-selected items
 */
export type SortItems = QRL<
  (
    items: Item[] | undefined,
    selectedItems: Item[] | undefined,
    fixed: boolean,
    options: SortOptions
  ) => Item[] | undefined
>;

/**
 * Default sort items implementation
 * @param items Items
 * @param selectedItems Selected items
 * @param fixed Whether items remain fixed or selected items move to the top
 * @param param1 Options
 * @param param1.itemToString Item to string function
 * @param param1.compareItems Comparator function
 * @param param1.locale Locale code
 * @returns Sorted items
 */
export const defaultSortItems$ = $(
  (
    items: Item[] | undefined,
    selectedItems: Item[] | undefined,
    fixed: boolean,
    {
      itemToString$,
      compareItems$,
      locale,
    }: { itemToString$: ItemAsString; compareItems$: CompareItems; locale: string }
  ) => {
    const comparator = async (itemA: Item, itemB: Item) => {
      if (!fixed) {
        const hasItemA = selectedItems?.some(item => itemsEqual(item, itemA));
        const hasItemB = selectedItems?.some(item => itemsEqual(item, itemB));
        if (hasItemA && !hasItemB) {
          return -1;
        }
        if (hasItemB && !hasItemA) {
          return 1;
        }
      }
      const itemAString = await itemToString$(itemA);
      const itemBString = await itemToString$(itemB);
      return compareItems$(itemAString, itemBString, { locale });
    };
    if (items) {
      return quickSort(items, comparator);
    } else {
      return Promise.resolve(items);
    }
  }
);

/**
 * Returns the mid value among x, y, and z
 * @param x X
 * @param y Y
 * @param z Z
 * @param compare Comparator function
 * @returns Comparison numeric value as promise
 */
async function getPivot<T>(x: T, y: T, z: T, compare: (a: T, b: T) => Promise<number>) {
  if ((await compare(x, y)) < 0) {
    if ((await compare(y, z)) < 0) {
      return y;
    } else if ((await compare(z, x)) < 0) {
      return x;
    } else {
      return z;
    }
  } else if ((await compare(y, z)) > 0) {
    return y;
  } else if ((await compare(z, x)) > 0) {
    return x;
  } else {
    return z;
  }
}

/**
 * Asynchronous quick sort
 * @param arr Array to sort
 * @param compare Asynchronous comparing function
 * @param left Index where the range of elements to be sorted starts
 * @param right Index where the range of elements to be sorted ends
 * @returns Sorted array as promise
 */
async function quickSort<T>(
  arr: T[],
  compare: (a: T, b: T) => Promise<number>,
  left = 0,
  right = arr.length - 1
): Promise<T[]> {
  if (left < right) {
    let i = left,
      j = right,
      tmp;
    const pivot = await getPivot(arr[i], arr[i + Math.floor((j - i) / 2)], arr[j], compare);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      while ((await compare(arr[i], pivot)) < 0) {
        i++;
      }
      while ((await compare(pivot, arr[j])) < 0) {
        j--;
      }
      if (i >= j) {
        break;
      }
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;

      i++;
      j--;
    }
    await quickSort(arr, compare, left, i - 1);
    await quickSort(arr, compare, j + 1, right);
  }
  return arr;
}
