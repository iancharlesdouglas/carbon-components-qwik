import { Component, HTMLAttributes, PropFunction, Slot, component$, useId } from "@builder.io/qwik";
import { IconProps } from "carbon-icons-qwik";
import { usePrefix } from "../../internal/usePrefix";

/**
 * Props common to both button and anchor elements
 * @property tabIndex - Tab index
 * @property class - Class name
 */
export type ButtonOrAnchorElementProps = {
  tabIndex?: number;
  class?: string;
};

/**
 * Anchor HTML element props
 */
export type AnchorElementProps = {
  href?: string;
}

/**
 * Button HTML element props (passed to an element)
 */
export type ButtonElementProps = HTMLAttributes<HTMLButtonElement> & ButtonOrAnchorElementProps & {
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
  'aria-describedby'?: string;
  'aria-pressed'?: string;
  onBlur$?: PropFunction<() => void>;
  onClick$: PropFunction<() => void>;
  onFocus$: PropFunction<() => void>;
  onMouseEnter$: PropFunction<(ev: MouseEvent) => void>;
  onMouseLeave$: PropFunction<(ev: MouseEvent) => void>;
};

/**
 * Button props
 * @property dangerDescription - Message read by screen readers for the danger button variant
 * @property disabled - Disabled (aria-disabled is set per value)
 * @property hasIconOnly - Whether the button is an icon-only button
 * @property href - Specify href if you want the button to be rendered as an anchor element
 * @property iconDescription - Label of icon (if renderIcon is true and an icon is provided in the "icon" slot)
 * @property isExpressive - Whether the button is expressive or not
 * @property isSelected - Whether the button is selected
 * @property kind - Kind of button (primary - default, secondary, tertiary, danger, danger-primary, danger-secondary, danger-tertiary or ghost)
 * @property renderIcon - Whether to render an icon in the "icon" slot
 * @property role - Role
 * @property size - Size (sm, md, lg, xl, 2xl)
 * @property tabIndex - Tab index
 * @property tooltipAlignment - Tooltip alignment (start, center or end)
 * @property tooltipPosition - Tooltip position (top, right, bottom or left)
 * @property type - Button type (button - default, reset or submit)
 */
export type ButtonProps = ButtonElementProps & {
  dangerDescription?: string;
  hasIconOnly?: boolean;
  href?: string;
  iconDescription?: string;
  isExpressive?: boolean;
  isSelected?: boolean;
  kind?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'danger--primary' | 'danger--secondary' | 'danger--tertiary' |
    'ghost',
  renderIcon?: Component<IconProps>;
  role?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl', 
  tabIndex?: number;
  tooltipAlignment?: 'start' | 'center' | 'end',
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left',
};

/**
 * Button element
 */
export const Button = component$((props: ButtonProps) => {
  const prefix = usePrefix();

  const {size = 'md', isExpressive, kind = 'primary', disabled, hasIconOnly, isSelected, type, tabIndex, dangerDescription, href} = props;

  const classes = [`${prefix}--btn`];
  if (props.class) classes.push(props.class);
  if (size === 'sm' && !isExpressive) classes.push(`${prefix}--btn--sm`);
  if (size === 'md' && !isExpressive) classes.push(`${prefix}--btn--md`);
  if (size === 'lg' && !isExpressive) classes.push(`${prefix}--btn--lg`);
  if (size === 'xl') classes.push(`${prefix}--btn--xl`);
  if (size === '2xl') classes.push(`${prefix}--btn--2xl`);
  classes.push(`${prefix}--btn--${kind}`);
  if (disabled) classes.push(`${prefix}--btn--disabled`);
  if (isExpressive) classes.push(`${prefix}--btn--expressive`);
  if (hasIconOnly) classes.push(`${prefix}--btn--icon-only`);
  if (hasIconOnly && isSelected && kind === 'ghost') classes.push(`${prefix}--btn--selected`);

  const dangerButtonKinds = ['danger', 'danger--tertiary', 'danger--ghost'];

  const assistiveId = useId();
  
  const commonProps = props as ButtonOrAnchorElementProps;

  const buttonElementProps = props as ButtonElementProps;
  buttonElementProps['aria-describedby'] = dangerButtonKinds.includes(kind) ? assistiveId : undefined;
  buttonElementProps['aria-pressed'] = hasIconOnly && kind === 'ghost' ? (isSelected ? 'true' : 'false') : undefined;

  const assistiveText = dangerButtonKinds.includes(kind) 
    ? <span id={assistiveId} class={`${prefix}--visually-hidden`}>{dangerDescription}</span>
    : undefined;

  if (href && !disabled) {
    return <a href={href} {...commonProps}></a>;
  } else if (hasIconOnly) {
    return <button {...buttonElementProps}>{assistiveText}<Slot name="icon"/></button>
  } else {
    return <button {...buttonElementProps}>{assistiveText}<Slot /></button>;
  }
});