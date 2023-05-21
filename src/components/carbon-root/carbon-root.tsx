import { Slot, component$, useContextProvider } from '@builder.io/qwik';
import { CarbonContext, prefixContext } from '../../internal/contexts/carbon-context';
import { TextDirection, TextDirectionContext, textDirectionContext } from '../../internal/contexts/text-direction-context';

/**
 * Properties for CarbonRoot component
 * @property {string} prefix - Prefix - defaults to 'cds'
 * @property {TextDirection} dir - Text direction - defaults to 'auto'
 */
type CarbonRootProps = {
  prefix?: string;
  dir?: TextDirection;
};

/**
 * Root component for Carbon application
 */
export const CarbonRoot = component$((props: CarbonRootProps) => {
  const { dir: direction = 'auto' } = props;
  useContextProvider<CarbonContext>(prefixContext, { prefix: props.prefix ?? 'cds' });
  useContextProvider<TextDirectionContext>(textDirectionContext, { dir: direction });
  return <Slot />;
});
