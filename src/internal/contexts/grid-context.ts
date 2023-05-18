import { createContextId } from '@builder.io/qwik';

/**
 * Context ID for grid context
 */
export const gridContext = createContextId<GridContext>('grid');

/**
 * Grid context
 * @property {boolean} subGrid - Whether grid is a sub-grid
 */
export type GridContext = {
  subGrid: boolean;
};
