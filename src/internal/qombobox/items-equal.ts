import { Item, Labelled } from '../../components/dropdown/dropdown';

/**
 * Whether two items are the same
 * @param item1 Item 1
 * @param item2 Item 2
 * @returns True if they are the same (false if either is undefined)
 */
export const itemsEqual = (item1: Item | undefined, item2: Item | undefined) => {
  if (!item1 || !item2) {
    return false;
  }
  if (typeof item1 === 'string' && typeof item2 === 'string') {
    return item1 === item2;
  }
  const labelledItem1 = item1 as Labelled;
  const labelledItem2 = item2 as Labelled;
  return labelledItem1.label === labelledItem2.label;
};
