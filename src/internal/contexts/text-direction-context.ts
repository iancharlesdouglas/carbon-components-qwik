import { createContextId } from '@builder.io/qwik';

/**
 * Text direction definition
 */
export type TextDirection = 'ltr' | 'rtl' | 'auto';

/**
 * Context ID for text direction context
 */
export const textDirectionContext = createContextId<TextDirectionContext>('text-direction');

/**
 * Text direction context
 * @property {TextDirection} dir - Direction
 */
export type TextDirectionContext = {
  dir?: TextDirection;
};
