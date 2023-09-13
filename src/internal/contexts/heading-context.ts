import { createContextId } from '@builder.io/qwik';

/**
 * Context ID for heading
 */
export const headingContext = createContextId<HeadingContext>('heading-context');

/**
 * Heading context
 */
export type HeadingContext = {
  level: number;
};
