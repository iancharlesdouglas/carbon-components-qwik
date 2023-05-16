import { QwikIntrinsicElements, Slot, component$ } from '@builder.io/qwik';
import classNames from 'classnames';
import _ from 'lodash';
import { usePrefix } from '../../internal/use-prefix';

/**
 * Form props
 */
export type FormProps = QwikIntrinsicElements['form'] & {
  class?: string;
};

/**
 * Form component
 */
export const Form = component$((props: FormProps) => {
  const { class: customClass } = props;
  const prefix = usePrefix();
  const classes = classNames(`${prefix}--form`, customClass);
  const propsWithoutClass = _.omit(props, 'class');
  return (
    <form class={classes} {...propsWithoutClass}>
      <Slot />
    </form>
  );
});
