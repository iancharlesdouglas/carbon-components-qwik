import { Slot, component$, useContext } from '@builder.io/qwik';
import { headingContext } from '../../internal/contexts/heading-context';

/**
 * Section component to contain a Heading
 */
export const Section = component$(() => {
  const context = useContext(headingContext);
  context.level++;
  return <Slot />;
});
