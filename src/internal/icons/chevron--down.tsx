import { component$ } from '@builder.io/qwik';
import { IconProps, IconPropsSvg } from 'carbon-icons-qwik';

/**
 * ChevronDown icon (to get around compilation error when using carbon-icons-qwik icon)
 */
export const ChevronDown = component$((props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    x="0px"
    y="0px"
    width={(props.size ?? 32) + 'px'}
    height={props.size ?? 32 + 'px'}
    viewBox="0 0 32 32"
    {...(props as IconPropsSvg)}
    fill={props.fill ?? 'currentColor'}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6">
      <path d="M5 6L0 1 0.7 0.3 5 4.6 9.3 0.3 10 1z" />
    </svg>
    {props.title && <title>{props.title}</title>}
  </svg>
));
