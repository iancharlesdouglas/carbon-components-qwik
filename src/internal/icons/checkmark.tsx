import { component$ } from '@builder.io/qwik';
import { IconProps, IconPropsSvg } from 'carbon-icons-qwik';

/**
 * Checkmark icon (to get around compilation error when using carbon-icons-qwik icon)
 */
export const Checkmark = component$((props: IconProps) => (
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
      <path d="M13 24L4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z" />
    </svg>
    {props.title && <title>{props.title}</title>}
  </svg>
));
