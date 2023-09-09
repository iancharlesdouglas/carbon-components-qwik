import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Form } from '../../components/form/form';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { Grid } from '../../components/grid/grid';
import { Column } from '../../components/grid/column';
import { $, component$ } from '@builder.io/qwik';
import { Checkbox, CheckboxProps } from '../../components/checkbox/checkbox';
import './checkbox.scss';
import { action } from '@storybook/addon-actions';

const CheckboxWrapper = component$<CheckboxProps>((props) => {
  return (
    <CarbonRoot>
      <Form>
        <Grid>
          <Column lg={4} md={3} sm={2} style="margin-bottom: 0.5rem">
            <Checkbox {...props} />
          </Column>
        </Grid>
      </Form>
    </CarbonRoot>
  );
});

const meta: Meta<CheckboxProps> = {
  title: 'Controls/Checkbox',
  component: Checkbox,
  args: {},
  tags: ['autodocs'],
  render: (args) => <CheckboxWrapper {...args} />,
};

export default meta;

type Story = StoryObj<CheckboxProps>;

export const Default: Story = {
  args: {
    checked: true,
    hideLabel: false,
    indeterminate: false,
    labelText: 'Confirmed',
    title: 'Purchase confirmed',
    onChange$: $((e: unknown) => {
      action('checked changed')(e);
    }),
  },
  argTypes: {
    checked: { description: 'Whether checked initially' },
    class: { description: 'HTML class attribute' },
    hideLabel: { description: 'Hide the label' },
    indeterminate: { description: 'Whether in an indeterminate (neither checked nor unchecked) state' },
    labelText: { description: 'Label text' },
    title: { description: 'Accessibility title (for the HTML label element)' },
  },
  parameters: {},
};
