import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Form } from '../../components/form/form';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { $, component$ } from '@builder.io/qwik';
import { Grid } from '../../components/grid/grid';
import { Column } from '../../components/grid/column';
import { action } from '@storybook/addon-actions';
import './dropdown.scss';
import { Dropdown, DropdownProps, Item } from '../../components/dropdown/dropdown';

const DropdownWrapper = component$<DropdownProps>(props => {
  const items: Item[] | undefined = [
    'Apple',
    'Banana',
    'Blackberry',
    'Blueberry',
    'Cherry',
    'Dragonfruit',
    'Durian',
    'Elderberry',
    'Fig',
    'Guava',
    'Huckleberry',
    'Ichigo',
    'Jackfruit',
  ];
  const propsWithItems = { ...props, items };
  return (
    <CarbonRoot>
      <Form>
        <Grid>
          <Column lg={4} md={3} sm={2} style="margin: 13rem 0">
            <Dropdown {...propsWithItems}></Dropdown>
          </Column>
        </Grid>
      </Form>
    </CarbonRoot>
  );
});

const meta: Meta<DropdownProps> = {
  title: 'Controls/Dropdown',
  component: Dropdown,
  args: {
    direction: 'bottom',
    disabled: false,
    hideLabel: false,
    placeholder: 'Select a fruit',
    readOnly: false,
    size: 'md',
    label: 'Fruit',
    type: 'default',
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
      description: 'Set the list popup location',
    },
    disabled: { description: 'Set whether disabled' },
    hideLabel: { description: 'Hide the label' },
    placeholder: { description: 'Set the placeholder text' },
    readOnly: { description: 'Set whether read-only' },
    selectedItem: {
      control: { type: 'select' },
      options: [
        'Apple',
        'Banana',
        'Blackberry',
        'Blueberry',
        'Cherry',
        'Dragonfruit',
        'Durian',
        'Elderberry',
        'Fig',
        'Guava',
        'Huckleberry',
        'Ichigo',
        'Jackfruit',
      ],
      description: 'Set initially selected item',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Set the control element size',
    },
    label: { description: 'Set the label' },
    type: {
      control: { type: 'select' },
      options: ['default', 'inline'],
      description: 'Set whether displayed inline or stacked vertically',
    },
    onSelect$: { description: 'onSelect handler' },
  },
  tags: ['autodocs'],
  render: args => <DropdownWrapper {...args} />,
};

export default meta;

type Story = StoryObj<DropdownProps>;

export const Default: Story = {
  args: {
    helperText: 'Optional',
    onSelect$: $((e: unknown) => {
      action('selected')(e);
    }),
  },
  argTypes: {},
  parameters: {},
};

export const Warning: Story = {
  args: {
    warn: true,
    warnText: 'Warning message',
    ...Default.args,
  },
  argTypes: { ...Default.argTypes },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    invalidText: 'Error message',
    ...Default.args,
  },
  argTypes: { ...Default.argTypes },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    placeholder: undefined,
    selectedItem: 'Banana',
    disabled: true,
  },
  argTypes: { ...Default.argTypes },
};

export const ReadOnly: Story = {
  name: 'Read-only',
  args: {
    ...Default.args,
    readOnly: true,
    placeholder: undefined,
    helperText: '',
    selectedItem: 'Banana',
  },
  argTypes: { ...Default.argTypes },
};

export const Inline: Story = {
  args: {
    ...Default.args,
    type: 'inline',
  },
  argTypes: { ...Default.argTypes },
};
