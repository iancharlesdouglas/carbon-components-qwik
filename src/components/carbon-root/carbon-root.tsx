import { Slot, component$, useContextProvider } from '@builder.io/qwik';
import { CarbonContext, prefixContext } from '../../contexts/carbon-context';
import { FormContext, formContext } from '../../contexts/form-context';

/**
 * Properties for CarbonRoot component
 * @property {string} prefix - Prefix - defaults to 'cds'
 */
type CarbonRootProps = {
  prefix?: string;
};

/**
 * Root component for Carbon application
 */
export const CarbonRoot = component$((props: CarbonRootProps) => {
  useContextProvider<CarbonContext>(prefixContext, { prefix: props.prefix ?? 'cds' });
  useContextProvider<FormContext>(formContext, { isFluid: false });
  return <Slot />;
});
