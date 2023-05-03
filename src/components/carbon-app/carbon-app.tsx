import { Slot, component$, createContextId, useContextProvider } from "@builder.io/qwik";

export const prefixContext = createContextId<CarbonContext>('prefix');

type CarbonContext = {
  prefix: string;
};

/**
 * Root container for Carbon application
 */
export const CarbonApp = component$(() => {
  useContextProvider<CarbonContext>(prefixContext, {prefix:'cds'});
  return <Slot />;
})