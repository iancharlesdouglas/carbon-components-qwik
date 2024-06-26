import { component$ } from '@builder.io/qwik';
import { IconProps, IconPropsSvg } from 'carbon-icons-qwik';

/**
 * WarningFilled icon (to get around compilation error when using carbon-icons-qwik icon)
 */
export const WarningFilled = component$((props: IconProps) => (
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
      <path d="M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14C30,8.3,23.7,2,16,2z M14.9,8h2.2v11h-2.2V8z M16,25	c-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22c0.8,0,1.5,0.7,1.5,1.5S16.8,25,16,25z" />
      <path
        fill="none"
        d="M17.5,23.5c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22	C16.8,22,17.5,22.7,17.5,23.5z M17.1,8h-2.2v11h2.2V8z"
        data-icon-path="inner-path"
        opacity="0"
      />
    </svg>
    {props.title && <title>{props.title}</title>}
  </svg>
));
