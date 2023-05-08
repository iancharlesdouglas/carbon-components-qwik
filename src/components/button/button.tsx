import { HTMLAttributes } from "@builder.io/qwik";

/**
 * Button props
 * @property class - Class name
 * @property dangerDescription - Message read by screen readers for the danger button variant
 * @property disabled - Disabled (aria-disabled is set per value)
 * @property hasIconOnly - Whether the button is an icon-only button
 * @property href - Specify href if you want the button to be rendered as an anchor element
 */
export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  class?: string;
  dangerDescription?: string;
  disabled?: boolean;
  hasIconOnly?: boolean;
  href?: string;
};