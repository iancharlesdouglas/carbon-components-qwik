import { Slot, component$, useContextProvider } from '@builder.io/qwik';
import { GridContext, GridState, gridContext } from '../../internal/contexts/grid-context';

/**
 * Grid scope properties
 */
export type GridScopeProps = GridState;

/**
 * Grid scope which sets subGrid context value
 */
export const GridScope = component$((props: GridScopeProps) => {
  const { subGrid, mode } = props;
  useContextProvider<GridContext>(gridContext, { subGrid, mode });
  return (
    <>
      <Slot />
    </>
  );
});
