import { PropFunction, HTMLAttributes, Slot, component$, Component } from "@builder.io/qwik";
import { usePrefix } from "../../internal/usePrefix";
import { removeProps } from "../../internal/remove-props";
import { IconProps } from "carbon-icons-qwik";
import { IconRenderProps } from "../../internal/icon-render-props";

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
 * @property class - Class name
 * @property disabled - Disabled (aria-disabled is set per value)
 * @property inline - Whether generated HTML element is displayed inline (if so, any icon is not rendered)
 * @property visited - Whether visited
 * @property renderIcon - Icon component type (e.g. Edit) if an icon is to be rendered after the anchor content slot
 * @property size - Size ('sm', 'md' or 'lg' - default is 'md')
 * @property target - If "_blank" then rel is "noopener"
 * @property onClick$ - onClick handler
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
}

/**
 * Link (anchor element in HTML)
 */
export const Link = component$((props: LinkProps) => {
  const prefix = usePrefix();

  const classes = [`${prefix}--link`];
  if (props.class) classes.push(props.class);
  const {disabled, target, inline, visited, size, renderIcon} = props;
  if (disabled) classes.push(`${prefix}--link--disabled`);
  if (inline) classes.push(`${prefix}--link--inline`);
  if (visited) classes.push(`${prefix}--link--visited`);
  if (size) classes.push(`${prefix}--link--${size}`)
  const classNames = classes.join(' ');
  const rel = target === '_blank' ? 'noopener' : undefined;
  const anchorProps: AnchorProps = removeProps({...props, 'aria-disabled': !!disabled}, 'size', 'renderIcon', 'inline');

  if (renderIcon && !inline) {
    const icon = renderIcon as Component<IconProps>;
    const iconLinkProps: IconRenderProps = {icon};
    return <a class={classNames} rel={rel} {...anchorProps}>
      <Slot/>
      <iconLinkProps.icon size={20} />
    </a>;
  } else {
    return <a class={classNames} rel={rel} {...anchorProps}>
    <Slot />
  </a>;
  }
});
