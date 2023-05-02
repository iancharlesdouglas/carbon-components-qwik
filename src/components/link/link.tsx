import { Slot, component$ } from "@builder.io/qwik";
import { usePrefix } from "../../internal/usePrefix";

type LinkProps = {
  class?: string;
  href: string;
  disabled?: boolean;
  inline?: boolean;
  visited?: boolean;
  renderIcon?: unknown;
  size?: 'sm' | 'md' | 'lg';
  target?: string;
};

export const Link = component$((props: LinkProps) => {
  const prefix = usePrefix();

  const classes = [`${prefix}--link`];
  if (props.class) classes.push(props.class);
  if (props.disabled) classes.push(`${prefix}--link--disabled`);
  if (props.inline) classes.push(`${prefix}--link--inline`);
  if (props.visited) classes.push(`${prefix}--link--visited`);
  if (props.size) classes.push(`${prefix}--link--${props.size}`)
  const classNames = classes.join(' ');
  const rel = props.target === '_blank' ? 'noopener' : undefined;

  return <a {...props} class={classNames} rel={rel}>
    <Slot></Slot>
  </a>
});