import { component$ } from '@builder.io/qwik';
import { IconProps, IconPropsSvg } from 'carbon-icons-qwik';

/**
 * WarningAltFilled icon (to get around compilation error when using carbon-icons-qwik icon)
 */
export const WarningAltFilled = component$((props: IconProps) => (
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
      <path
        fill="none"
        d="M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z"
        data-icon-path="inner-path"
      />
      <path d="M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z" />
      <path d="M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z" />
    </svg>
    {props.title && <title>{props.title}</title>}
  </svg>
));
