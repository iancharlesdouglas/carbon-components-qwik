import { Component, PropFunction, Slot, component$ } from "@builder.io/qwik";
import { usePrefix } from "../../internal/usePrefix";

type LinkProps = {
  class?: string;
  href: string;
  disabled?: boolean;
  inline?: boolean;
  visited?: boolean;
  renderIcon?: Component<string>;
  size?: 'sm' | 'md' | 'lg';
  target?: string;
  onClick$?: PropFunction<() => void>;
};

export const Link = component$((props: LinkProps, ...rest) => {
  const prefix = usePrefix();

  const classes = [`${prefix}--link`];
  if (props.class) classes.push(props.class);
  if (props.disabled) classes.push(`${prefix}--link--disabled`);
  if (props.inline) classes.push(`${prefix}--link--inline`);
  if (props.visited) classes.push(`${prefix}--link--visited`);
  if (props.size) classes.push(`${prefix}--link--${props.size}`)
  const classNames = classes.join(' ');
  const rel = props.target === '_blank' ? 'noopener' : undefined;

  if (!props.renderIcon && !props.inline) {
    return <a {...props} class={classNames} rel={rel} {...rest}>
      <Slot />
      {/* <div><props.renderIcon/></div> */}
    </a>    
  } else {
    return <a {...props} class={classNames} rel={rel} onClick$={props.onClick$}{...rest}>
    <Slot />
  </a>;
  }
});