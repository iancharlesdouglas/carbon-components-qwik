import { PropFunction, HTMLAttributes, Slot, component$, Component } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { IconProps } from 'carbon-icons-qwik';
import { IconRenderProps } from '../../shared-props/icon-render-props';
import classNames from 'classnames';
import { removeProps } from '../../internal/objects/remove-props';

/**
 * Anchor HTML element props
 */
export type AnchorProps = HTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  disabled?: boolean;
  'aria-disabled'?: boolean;
  onClick$?: PropFunction<() => void>;
};

/**
 * Link props
 * @property {string} class - Class name
 * @property {boolean} disabled - Disabled (aria-disabled is set per value)
 * @property {boolean} inline - Whether generated HTML element is displayed inline (if so, any icon is not rendered)
 * @property {boolean} visited - Whether visited
 * @property {Component<IconProps>} renderIcon - Icon component type (e.g. Edit) if an icon is to be rendered after the anchor content slot
 * @property {string} size - Size ('sm', 'md' or 'lg' - default is 'md')
 * @property {string} target - If "_blank" then rel is "noopener"
 * @property {PropFunction} onClick$ - onClick handler
 */
export type LinkProps = AnchorProps & {
  class?: string;
  disabled?: boolean;
  inline?: boolean;
  visited?: boolean;
  renderIcon?: Component<IconProps>;
  size?: 'sm' | 'md' | 'lg';
  target?: string;
  onClick$?: PropFunction<() => void>;
};

/**
 * Link component (anchor element in HTML)
 */
export const Link = component$((props: LinkProps) => {
  const prefix = usePrefix();

  const { class: customClass, disabled, target, inline, visited, size, renderIcon } = props;

  const classes = classNames(
    `${prefix}--link`,
    customClass,
    { [`${prefix}--link--disabled`]: disabled },
    { [`${prefix}--link--inline`]: inline },
    { [`${prefix}--link--visited`]: visited },
    { [`${prefix}--link--${size}`]: size }
  );
  const rel = target === '_blank' ? 'noopener' : undefined;
  const anchorProps: AnchorProps = removeProps(
    { ...props, 'aria-disabled': !!disabled },
    'size',
    'renderIcon',
    'inline'
  );

  if (renderIcon && !inline) {
    const icon = renderIcon as Component<IconProps>;
    const iconLinkProps: IconRenderProps = { icon };
    return (
      <a class={classes} rel={rel} {...anchorProps}>
        <Slot />
        <iconLinkProps.icon size={20} />
      </a>
    );
  } else {
    return (
      <a class={classes} rel={rel} {...anchorProps}>
        <Slot />
      </a>
    );
  }
});
