import { Slot, component$, createContextId, useContextProvider } from "@builder.io/qwik";

export const prefixContext = createContextId<CarbonContext>('prefix');

type CarbonContext = {
  prefix: string;
};

type CarbonAppProps = {
  prefix?: string;
};

/**
 * Root container for Carbon application
 */
export const CarbonApp = component$((props: CarbonAppProps) => {
  useContextProvider<CarbonContext>(prefixContext, {prefix: props.prefix ?? 'cds'});
  return <Slot />;
})