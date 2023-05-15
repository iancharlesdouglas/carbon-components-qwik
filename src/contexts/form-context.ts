import { createContextId } from '@builder.io/qwik';

/**
 * Context ID for form context
 */
export const formContext = createContextId<FormContext>('form');

/**
 * Form context
 */
export type FormContext = {
  isFluid: boolean;
};
