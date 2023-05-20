import { createContextId } from '@builder.io/qwik';

/**
 * Context ID for grid context
 */
export const gridContext = createContextId<GridContext>('grid');

/**
 * Grid context
 */
export type GridContext = GridState;

/**
 * Grid mode
 */
export type GridMode = 'wide' | 'narrow' | 'condensed';

/**
 * Grid state
 * @property {boolean} subGrid - Whether the grid is a sub-grid (nested)
 * @property {GridMode} mode - Whether the grid is wide, narrow or condensed
 */
export type GridState = {
  subGrid: boolean;
  mode: GridMode;
};
