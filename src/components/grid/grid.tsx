import { QwikIntrinsicElements, Slot, component$, useContext } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import { GridScope } from './grid-scope';
import _ from 'lodash';
import { gridContext } from '../../internal/contexts/grid-context';

/**
 * Grid props
 * @property {string} class - Custom class
 * @property {boolean} condensed - Whether the grid is to be rendered condensed (default false)
 * @property {boolean} fullWidth - Whether the grid is to be rendered full-width (default false)
 * @property {boolean} narrow - Whether the grid is to be rendered narrow (default false)
 */
export type GridProps = QwikIntrinsicElements['div'] & {
  class?: string;
  condensed?: boolean;
  fullWidth?: boolean;
  narrow?: boolean;
};

type GridMode = 'wide' | 'narrow' | 'condensed';

/**
 * Grid component
 */
export const Grid = component$((props: GridProps) => {
  const { narrow = false, condensed = false, fullWidth = false, class: customClass } = props;
  const prefix = usePrefix();
  const { subGrid } = useContext(gridContext);
  let mode: GridMode = 'wide';
  if (narrow) {
    mode = 'narrow';
  } else if (condensed) {
    mode = 'condensed';
  }

  if (subGrid) {
    return (
      <GridScope subGrid>
        <SubGrid class={customClass} mode={mode} {...props}>
          <Slot />
        </SubGrid>
      </GridScope>
    );
  }

  const classes = classNames(
    customClass,
    `${prefix}--css-grid`,
    { [`${prefix}--css-grid--condensed`]: mode === 'condensed' },
    { [`${prefix}--css-grid--narrow`]: mode === 'narrow' },
    { [`${prefix}--css-grid--full-width`]: fullWidth }
  );

  const sanitizedProps = _.omit(props, 'condensed', 'fullWidth', 'narrow');

  return (
    <GridScope subGrid={true}>
      <div class={classes} {...sanitizedProps}>
        <Slot />
      </div>
    </GridScope>
  );
});

type SubGridProps = {
  class?: string;
  mode: GridMode;
};

const SubGrid = component$((props: SubGridProps) => {
  const { mode, class: customClass } = props;
  const prefix = usePrefix();

  const classes = classNames(
    customClass,
    `${prefix}--subgrid`,
    { [`${prefix}--subgrid--condensed`]: mode === 'narrow' },
    { [`${prefix}--subgrid--narrow`]: mode === 'condensed' },
    { [`${prefix}--subgrid--wide`]: mode === 'wide' }
  );

  const sanitizedProps = _.omit(props, 'mode');

  return (
    <div class={classes} {...sanitizedProps}>
      <Slot />
    </div>
  );
});
