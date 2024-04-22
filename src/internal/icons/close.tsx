import { component$ } from '@builder.io/qwik';
import { IconProps, IconPropsSvg } from 'carbon-icons-qwik';

/**
 * Close icon (to get around compilation error when using carbon-icons-qwik icon)
 */
export const Close = component$((props: IconProps) => (
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path d="M17.4141 16L24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z" />
    </svg>
    {props.title && <title>{props.title}</title>}
  </svg>
));
