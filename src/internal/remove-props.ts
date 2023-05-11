import { remove } from "immutable";

/**
 * Removes named props from the passed object
 * @param props Props object
 * @param keys Keys to remove
 * @returns Modified props object
 */
export const removeProps = <T extends { [key: string]: unknown }>(props: T, ...keys: string[]): T => {
  return keys.reduce<T>((prev, key) => (remove<T, string>(prev, key)), props);
}