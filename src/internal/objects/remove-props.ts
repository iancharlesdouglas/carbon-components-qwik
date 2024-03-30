/**
 * Returns a new object copied from the entity but without the listed properties
 * @param entity Entity
 * @param props Properties to remove
 * @returns New object
 */
export const removeProps = (entity: object, ...props: string[]) => {
  const oldEntries = Object.entries(entity);
  const newEntries: [string, any][] = [];
  oldEntries.forEach(([key, value]) => {
    if (!props.some(prop => prop === key)) {
      newEntries.push([key, value]);
    }
  });
  return Object.fromEntries(newEntries);
};
