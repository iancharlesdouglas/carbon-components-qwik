import ShortUniqueId from 'short-unique-id';

/**
 * Generates a unique ID
 * @param {number} length - Length (default: 8)
 * @returns {string} Unique ID
 */
export const uniqueId = (length: number = 8): string => {
  const uid = new ShortUniqueId({ length });
  return uid.randomUUID();
};
