import { Component } from '@builder.io/qwik';
import { IconProps } from 'carbon-icons-qwik';

/**
 * Defines a mandatory icon property for rendering
 */
export type IconRenderProps = {
  icon: Component<IconProps>;
};
