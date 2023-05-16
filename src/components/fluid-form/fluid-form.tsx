import { Slot, component$, useContextProvider } from '@builder.io/qwik';
import { usePrefix } from '../../internal/use-prefix';
import classNames from 'classnames';
import { FormContext, formContext } from '../../contexts/form-context';
import { Form, FormProps } from '../form/form';
import _ from 'lodash';

/**
 * Fluid form component
 */
export const FluidForm = component$((props: FormProps) => {
  const prefix = usePrefix();
  const { class: customClass } = props;
  const classes = classNames(`${prefix}--form--fluid`, customClass);
  useContextProvider<FormContext>(formContext, { isFluid: true });
  const propsWithoutClass = _.omit(props, 'class');

  return (
    <Form class={classes} {...propsWithoutClass}>
      <Slot />
    </Form>
  );
});
