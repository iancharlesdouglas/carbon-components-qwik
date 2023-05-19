import { Slot, component$, useContextProvider } from '@builder.io/qwik';
import { GridContext, gridContext } from '../../internal/contexts/grid-context';

/**
 * Grid scope properties
 * @property {boolean} subGrid - Whether the grid is a sub-grid
 */
export type GridScopeProps = {
  subGrid: boolean;
};

/**
 * Grid scope which sets subGrid context value
 */
export const GridScope = component$((props: GridScopeProps) => {
  const { subGrid } = props;
  useContextProvider<GridContext>(gridContext, { subGrid });
  return (
    <>
      <Slot />
    </>
  );
});
