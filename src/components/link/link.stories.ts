import type { Meta, StoryObj } from "storybook-framework-qwik";
import { $ } from "@builder.io/qwik";
import { action } from "@storybook/addon-actions";
import { Link, LinkProps } from "./link";

const meta = {
  title: "Link",
  component: Link,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    // automatic actions are not yet supported.
    // See https://github.com/literalpie/storybook-framework-qwik/issues/16
    // For now, use the legacy addon-actions API wrapped in a $ to make your own QRL action.
    onClick$: $<() => void>(() => {
      action("Click Action")();
    }),
    // Inherited from HTMLAttributes<HTMLAnchorElement>:
    onCopy$: $<() => void>(() => {}),
    onCopyCapture$: $<() => void>(() => {}),
    onCut$: $<() => void>(() => {}),
    onCutCapture$: $<() => void>(() => {}),
    onPaste$: $<() => void>(() => {}),
    onPasteCapture$: $<() => void>(() => {}),
    onCompositionEnd$: $<() => void>(() => {}),
    onCompositionEndCapture$: $<() => void>(() => {}),
    onCompositionStart$: $<() => void>(() => {}),
    onCompositionStartCapture$: $<() => void>(() => {}),
  },
} satisfies Meta<LinkProps>;

export default meta;

type Story = StoryObj<LinkProps>;

export const Basic: Story = {
  args: {

  }
};

export const Visited: Story = {
  args: {
    visited: true
  }
}