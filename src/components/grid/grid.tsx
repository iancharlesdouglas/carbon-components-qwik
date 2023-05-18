import { QwikIntrinsicElements, component$, jsx } from '@builder.io/qwik';

export type GridProps = QwikIntrinsicElements['div'] & {
  class?: string;
  condensed?: boolean;
  fullWidth?: boolean;
  narrow?: boolean;
};

export const Grid = component$((props: GridProps) => {
  return <div></div>;
});
