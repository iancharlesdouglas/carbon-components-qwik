import { Slot, component$, createContextId, useContextProvider } from "@builder.io/qwik";

export const prefixContext = createContextId<CarbonContext>('prefix');

/**
 * Carbon context
 */
type CarbonContext = {
  prefix: string;
};

/**
 * Properties for CarbonRoot
 * @property prefix - Prefix - defaults to 'cds'
 */
type CarbonRootProps = {
  prefix?: string;
};

/**
 * Root container for Carbon application
 */
export const CarbonRoot = component$((props: CarbonRootProps) => {
  useContextProvider<CarbonContext>(prefixContext, {prefix: props.prefix ?? 'cds'});
  return <Slot />;
})