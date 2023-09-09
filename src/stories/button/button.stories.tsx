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
import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { $, component$ } from '@builder.io/qwik';
import { action } from '@storybook/addon-actions';
import { Button, ButtonProps } from '../../components/button/button';
import './button.scss';
import { UserAvatar } from 'carbon-icons-qwik';

const ButtonWrapper = component$<ButtonProps>((props) => {
  const propsWithIcon = { ...props, renderIcon: UserAvatar };
  return (
    <CarbonRoot>
      <Button {...propsWithIcon}>Hello</Button>
    </CarbonRoot>
  );
});

const meta: Meta<ButtonProps> = {
  title: 'Controls/Button',
  component: Button,
  args: {},
  tags: ['autodocs'],
  render: (args) => <ButtonWrapper {...args} />,
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  args: {
    disabled: false,
    hasIconOnly: false,
    isExpressive: false,
    isSelected: false,
    kind: 'primary',
    size: 'md',
    type: 'button',
    onClick$: $(() => {
      action('clicked')();
    }),
    onBlur$: $(() => {
      action('blurred/lost focus')();
    }),
    onFocus$: $(() => {
      action('got focus')();
    }),
    onMouseEnter$: $((e: unknown) => {
      action('mouse enter')(e);
    }),
    onMouseLeave$: $((e: unknown) => {
      action('mouse leave')(e);
    }),
  },
  argTypes: {
    disabled: {
      description: 'Set whether disabled',
    },
    hasIconOnly: {
      description: 'Set whether icon-only',
    },
    isExpressive: {
      description: 'Set whether button is emphasized',
    },
    isSelected: {
      description: 'Set whether currently selected',
    },
    kind: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'danger--primary', 'danger--secondary', 'danger--tertiary', 'ghost'],
      description: 'Set the kind of button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Set the button size',
    },
    type: {
      control: { type: 'select' },
      options: ['submit', 'button', 'reset'],
      description: 'Set the button HTML element type',
    },
    onClick$: { description: 'onClick handler' },
    onBlur$: { description: 'onBlur handler' },
    onFocus$: { description: 'onFocus handler' },
    onMouseEnter$: { description: 'onMouseEnter handler' },
    onMouseLeave$: { description: 'onMouseLeave handler' },
  },
};
