import { createContextId } from '@builder.io/qwik';

/**
 * Context ID for prefix
 */
export const prefixContext = createContextId<CarbonContext>('prefix');

/**
 * Carbon context
 */
export type CarbonContext = {
  prefix: string;
};
