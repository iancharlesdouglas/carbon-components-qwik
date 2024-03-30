/**
 * Returns a new object without listed properties from the entity
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
