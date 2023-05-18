import { Slot, component$, useContextProvider } from '@builder.io/qwik';
import { CarbonContext, prefixContext } from '../../internal/contexts/carbon-context';

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
  return <Slot />;
});
