import { QwikIntrinsicElements, Slot, component$, useContextProvider } from '@builder.io/qwik';
import classNames from 'classnames';
import _ from 'lodash';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { FormContext, formContext } from '../../internal/contexts/form-context';

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
  useContextProvider<FormContext>(formContext, { isFluid: false });
  const propsWithoutClass = _.omit(props, 'class');
  return (
    <form class={classes} {...propsWithoutClass}>
      <Slot />
    </form>
  );
});
