import { QwikIntrinsicElements, Slot, component$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import _ from 'lodash';

/**
 * Row props
 * @property {boolean} condensed - Whether the row is rendered condensed
 * @property {boolean} narrow - Whether the row is rendered narrow
 * @property {string} class - Custom CSS class
 */
export type RowProps = QwikIntrinsicElements['div'] & {
  condensed?: boolean;
  narrow?: boolean;
  class?: string;
};

/**
 * Row
 */
export const Row = component$((props: RowProps) => {
  const prefix = usePrefix();
  const { condensed = false, narrow = false, class: customClass } = props;
  const classes = classNames(customClass, `${prefix}--row`, { [`${prefix}--row--condensed`]: condensed, [`${prefix}--row--narrow`]: narrow });
  const sanitizedProps = _.omit(props, 'condensed', 'narrow', 'class');
  return (
    <div class={classes} {...sanitizedProps}>
      <Slot />
    </div>
  );
});
