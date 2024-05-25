import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Form } from '../../components/form/form';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { $, component$ } from '@builder.io/qwik';
import { Grid } from '../../components/grid/grid';
import { Column } from '../../components/grid/column';
import { action } from '@storybook/addon-actions';
import './multi-select.scss';
import { Item, ItemProps, Labelled } from '../../components/dropdown/dropdown';
import { MultiSelect, MultiSelectProps } from '../../components/multi-select/multi-select';

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

type MultiSelectStoryProps = MultiSelectProps & { wrapperStyle?: string };

/**
 * Multi-select containing complex (object) list items, some of which are disabled
 */
const ComplexDropdown = component$<MultiSelectStoryProps>(props => {
  const items: Item[] | undefined = fruits.map(fruit => ({
    label: fruit,
    disabled: fruit === 'Jackfruit' || fruit === 'Huckleberry',
  }));
  const selectedItems = items.filter(item => item === 'Apple' || item === 'Fig');
  const { wrapperStyle = 'margin: 11rem 0' } = props;
  const propsWithItems = { ...props, items, selectedItems };
  return (
    <CarbonRoot>
      <Form>
        <Grid>
          <Column lg={4} md={3} sm={2} style={wrapperStyle}>
            <MultiSelect {...propsWithItems}></MultiSelect>
          </Column>
        </Grid>
      </Form>
    </CarbonRoot>
  );
});

const ItemRenderComp = component$(({ item, index }: ItemProps) => (
  <span class={index! % 2 === 1 ? 'alt' : undefined} style="font-style: italic">
    {(item as Labelled).label}
  </span>
));

// const SelectedItemRenderComp = component$(({ item }: { item: Item }) => (
//   <span style="font-style: italic">{(item as Labelled).label}</span>
// ));

const meta: Meta<MultiSelectProps> = {
  title: 'Controls/MultiSelect',
  component: MultiSelect,
  args: {
    direction: 'bottom',
    disabled: false,
    hideLabel: false,
    label: 'Select fruit(s)',
    readOnly: false,
    size: 'md',
    title: 'Fruit',
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
    label: { description: 'Set the label placeholder text' },
    readOnly: { description: 'Set whether read-only' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Set the control element size',
    },
    title: { description: 'Set the title' },
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

type Story = StoryObj<MultiSelectStoryProps>;

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
    warnText: "You haven't selected fruit",
    ...Default.args,
  },
  argTypes: { ...Default.argTypes },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    invalidText: 'Huckleberry is unavailable',
    selectedItems: [{ label: 'Huckleberry' }],
    ...Default.args,
  },
  argTypes: { ...Default.argTypes },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    placeholder: undefined,
    selectedItems: [{ label: 'Banana' }],
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
    selectedItems: [{ label: 'Banana' }],
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
    wrapperStyle: 'margin: 0 0 11rem 0',
  },
  argTypes: { ...Default.argTypes },
};

// export const CustomSelectedItemRenderer: Story = {
//   name: 'Custom Renderer - Selected Item',
//   args: {
//     ...Default.args,
//     renderSelectedItem: SelectedItemRenderComp,
//     selectedItems: [{ label: 'Banana' }],
//     itemToElement: ItemRenderComp,
//     wrapperStyle: 'margin: 0 0 11rem 0',
//   },
//   argTypes: { ...Default.argTypes },
// };
