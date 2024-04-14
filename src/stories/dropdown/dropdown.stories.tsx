import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Form } from '../../components/form/form';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { $, component$ } from '@builder.io/qwik';
import { Grid } from '../../components/grid/grid';
import { Column } from '../../components/grid/column';
import { action } from '@storybook/addon-actions';
import './dropdown.scss';
import { Dropdown, DropdownProps, Item } from '../../components/dropdown/dropdown';

const fruits = [
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

/**
 * Dropdown containing complex (object) list items, some of which are disabled
 */
const ComplexDropdown = component$<DropdownProps>(props => {
  const items: Item[] | undefined = fruits.map(fruit => ({
    label: fruit,
    disabled: fruit === 'Jackfruit' || fruit === 'Huckleberry',
  }));
  const propsWithItems = { ...props, items };
  return (
    <CarbonRoot>
      <Form>
        <Grid>
          <Column lg={4} md={3} sm={2} style="margin: 11rem 0">
            <Dropdown {...propsWithItems}></Dropdown>
          </Column>
        </Grid>
      </Form>
    </CarbonRoot>
  );
});

const ItemRenderComp = component$(({ item }: { item: Item }) => <span style="font-style: italic">{item.label}</span>);

const SelectedItemRenderComp = component$(({ item }: { item: Item }) => (
  <span style="font-style: italic">{item.label}</span>
));

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
      options: fruits,
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
  render: args => <ComplexDropdown {...args} />,
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
    warnText: "You haven't selected a fruit",
    ...Default.args,
  },
  argTypes: { ...Default.argTypes },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    invalidText: 'Huckleberry is unavailable',
    selectedItem: { label: 'Huckleberry' },
    ...Default.args,
  },
  argTypes: { ...Default.argTypes },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    placeholder: undefined,
    selectedItem: { label: 'Banana' },
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
    selectedItem: { label: 'Banana' },
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

export const CustomItemRenderer: Story = {
  name: 'Custom Renderer - Item',
  args: {
    ...Default.args,
    itemToElement: ItemRenderComp,
  },
  argTypes: { ...Default.argTypes },
};

export const CustomSelectedItemRenderer: Story = {
  name: 'Custom Renderer - Selected Item',
  args: {
    ...Default.args,
    renderSelectedItem: SelectedItemRenderComp,
    selectedItem: { label: 'Banana' },
    itemToElement: ItemRenderComp,
  },
  argTypes: { ...Default.argTypes },
};
