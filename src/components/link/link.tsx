import { Component, PropFunction, HTMLAttributes, Slot, component$ } from "@builder.io/qwik";
import { usePrefix } from "../../internal/usePrefix";

export type AnchorProps = HTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  disabled?: boolean;
  // target?: string;
  // role?: string;
  'aria-disabled'?: boolean;
  onClick$?: PropFunction<() => void>;
};

export type LinkProps = AnchorProps & {
  class?: string;
  disabled?: boolean;
  inline?: boolean;
  visited?: boolean;
  renderIcon?: Component<string>;
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
  const {href, disabled, target, inline, visited, size, onClick$} = props;
  if (disabled) classes.push(`${prefix}--link--disabled`);
  if (inline) classes.push(`${prefix}--link--inline`);
  if (visited) classes.push(`${prefix}--link--visited`);
  if (size) classes.push(`${prefix}--link--${size}`)
  const classNames = classes.join(' ');
  const rel = target === '_blank' ? 'noopener' : undefined;
  const anchorProps: AnchorProps = {href, disabled, target, onClick$, 'aria-disabled': !!disabled};

  if (!props.renderIcon && !inline) {
    return <a class={classNames} rel={rel} {...anchorProps}>
      <Slot />
      {/* <div><props.renderIcon/></div> */}
    </a>    
  } else {
    return <a class={classNames} rel={rel} {...anchorProps}>
    <Slot />
  </a>;
  }
});