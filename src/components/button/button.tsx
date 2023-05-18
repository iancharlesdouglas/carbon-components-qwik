import { Component, HTMLAttributes, PropFunction, Slot, component$, useId } from '@builder.io/qwik';
import { IconProps } from 'carbon-icons-qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { IconRenderProps } from '../../shared-props/icon-render-props';
import _ from 'lodash';
import classNames from 'classnames';

/**
 * Props common to both button and anchor elements
 * @property {number} tabIndex - Tab index
 * @property {string} class - Class name
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
};

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Button kinds
 */
export type ButtonKind = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'danger--primary' | 'danger--secondary' | 'danger--tertiary' | 'ghost';

/**
 * Button HTML element props (passed to an element)
 */
export type ButtonElementProps = HTMLAttributes<HTMLButtonElement> &
  ButtonOrAnchorElementProps & {
    disabled?: boolean;
    type?: 'button' | 'reset' | 'submit';
    'aria-describedby'?: string;
    'aria-pressed'?: string;
    onBlur$?: PropFunction<() => void>;
    onClick$?: PropFunction<() => void>;
    onFocus$?: PropFunction<() => void>;
    onMouseEnter$?: PropFunction<(ev: MouseEvent) => void>;
    onMouseLeave$?: PropFunction<(ev: MouseEvent) => void>;
  };

/**
 * Button props
 * @property {string} dangerDescription - Message read by screen readers for the danger button variant
 * @property {boolean} disabled - Disabled (aria-disabled is set per value)
 * @property {boolean} hasIconOnly - Whether the button is an icon-only button
 * @property {string} href - Specify href if you want the button to be rendered as an anchor element
 * @property {string} iconDescription - Label of icon (if renderIcon is true and an icon is provided in the "icon" slot)
 * @property {boolean} isExpressive - Whether the button is expressive (emphasized) or not
 * @property {boolean} isSelected - Whether the button is selected
 * @property {ButtonKind} kind - Kind of button (primary - default, secondary, tertiary, danger, danger-primary, danger-secondary, danger-tertiary or ghost)
 * @property {Component<IconProps>} renderIcon - Icon component type (e.g. Edit) if an icon is to be rendered after the content slot
 * @property {string} role - Role
 * @property {ButtonSize} size - Size (sm, md, lg, xl, 2xl)
 * @property {number} tabIndex - Tab index
 * @property {string} tooltipAlignment - Tooltip alignment (start, center or end)
 * @property {string} tooltipPosition - Tooltip position (top, right, bottom or left)
 * @property {string} type - Button type (button - default, reset or submit)
 */
export type ButtonProps = ButtonElementProps & {
  dangerDescription?: string;
  hasIconOnly?: boolean;
  href?: string;
  iconDescription?: string;
  isExpressive?: boolean;
  isSelected?: boolean;
  kind?: ButtonKind;
  renderIcon?: Component<IconProps>;
  role?: string;
  size?: ButtonSize;
  tabIndex?: number;
  tooltipAlignment?: 'start' | 'center' | 'end';
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
};

/**
 * Button component
 */
export const Button = component$((props: ButtonProps) => {
  const prefix = usePrefix();

  const { class: className, size = 'md', isExpressive, kind = 'primary', disabled, hasIconOnly, renderIcon, isSelected, dangerDescription, href } = props;

  const classes = classNames(
    `${prefix}--btn`,
    className,
    { [`${prefix}--btn--sm`]: size === 'sm' && !isExpressive },
    { [`${prefix}--btn--md`]: size === 'md' && !isExpressive },
    { [`${prefix}--btn--lg`]: size === 'lg' && !isExpressive },
    { [`${prefix}--btn--xl`]: size === 'xl' },
    { [`${prefix}--btn--2xl`]: size === '2xl' },
    `${prefix}--btn--${kind}`,
    { [`${prefix}--btn--disabled`]: !!disabled },
    { [`${prefix}--btn--expressive`]: !!isExpressive },
    { [`${prefix}--btn--icon-only`]: !!hasIconOnly },
    { [`${prefix}--btn--selected`]: hasIconOnly && isSelected && kind === 'ghost' }
  );

  const dangerButtonKinds = ['danger', 'danger--tertiary', 'danger--ghost'];

  const assistiveId = useId();

  const commonProps = props as ButtonOrAnchorElementProps;

  const buttonElementProps = _.omit(
    {
      ...props,
      'aria-describedby': dangerButtonKinds.includes(kind) ? assistiveId : undefined,
      'aria-pressed': hasIconOnly && kind === 'ghost',
      class: classes,
    },
    'size',
    'dangerDescription',
    'hasIconOnly',
    'href',
    'iconDescription',
    'isExpressive',
    'isSelected',
    'kind',
    'renderIcon',
    'tooltipAlignment',
    'tooltipPosition'
  );

  const assistiveText = dangerButtonKinds.includes(kind) ? (
    <span id={assistiveId} class={`${prefix}--visually-hidden`}>
      {dangerDescription}
    </span>
  ) : undefined;

  if (href && !disabled) {
    return (
      <a href={href} {...commonProps}>
        <Slot />
      </a>
    );
  } else if (hasIconOnly) {
    const icon: Component<IconProps> = renderIcon as Component<IconProps>;
    const iconProps: IconRenderProps = { icon };
    return (
      <button {...buttonElementProps}>
        {assistiveText}
        <iconProps.icon size={16} />
      </button>
    );
  } else if (renderIcon) {
    const icon = renderIcon as Component<IconProps>;
    const iconProps: IconRenderProps = { icon };
    return (
      <button {...buttonElementProps}>
        {assistiveText}
        <Slot />
        <div class={`${prefix}--btn__icon`}>
          <iconProps.icon size={16} />
        </div>
      </button>
    );
  } else {
    return (
      <button {...buttonElementProps}>
        {assistiveText}
        <Slot />
        <div class={`${prefix}--btn__icon`}></div>
      </button>
    );
  }
});
