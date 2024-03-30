import { Slot, component$, useContextProvider } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import classNames from 'classnames';
import { FormContext, formContext } from '../../internal/contexts/form-context';
import { Form, FormProps } from '../form/form';
import { removeProps } from '../../internal/objects/remove-props';

/**
 * Fluid form component
 */
export const FluidForm = component$((props: FormProps) => {
  const prefix = usePrefix();
  const { class: customClass } = props;
  const classes = classNames(`${prefix}--form--fluid`, customClass);
  useContextProvider<FormContext>(formContext, { isFluid: true });
  const propsWithoutClass = removeProps(props, 'class');

  return (
    <Form class={classes} {...propsWithoutClass}>
      <Slot />
    </Form>
  );
});
