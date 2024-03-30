import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { $, component$ } from '@builder.io/qwik';
import { action } from '@storybook/addon-actions';
import { Button, ButtonProps } from '../../components/button/button';
import './button.scss';
import { UserAvatar } from 'carbon-icons-qwik';

const ButtonWrapper = component$<ButtonProps>(props => {
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
  render: args => <ButtonWrapper {...args} />,
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
      options: [
        'primary',
        'secondary',
        'tertiary',
        'danger',
        'danger--primary',
        'danger--secondary',
        'danger--tertiary',
        'ghost',
      ],
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
