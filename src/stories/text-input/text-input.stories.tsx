import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Form } from '../../components/form/form';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { TextInput, TextInputProps } from '../../components/text-input/text-input';
import { component$ } from '@builder.io/qwik';
import './text-input.scss';
import { Grid } from '../../components/grid/grid';
import { Column } from '../../components/grid/column';

const TextInputWrapper = component$<TextInputProps>((props) => {
  return (
    <CarbonRoot>
      <Form>
        <Grid>
          <Column lg={4} md={3} sm={2}>
            <TextInput {...props}></TextInput>
          </Column>
        </Grid>
      </Form>
    </CarbonRoot>
  );
});

const meta: Meta<TextInputProps> = {
  title: 'TextInput',
  component: TextInput,
  args: {
    labelText: 'Label',
    type: 'text',
  },
  render: (args) => <TextInputWrapper {...args} />,
};

export default meta;

type Story = StoryObj<TextInputProps>;

export const Default: Story = {
  args: {
    value: '',
    hideLabel: false,
    helperText: 'Helper text',
    inline: false,
    placeholder: 'Enter text',
    readOnly: false,
    renderSize: 'md',
    enableCounter: false,
    maxCount: 20,
  },
  argTypes: {
    renderSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
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

export const ReadOnly: Story = {
  name: 'Read-only',
  args: {
    ...Default.args,
    readOnly: true,
  },
  argTypes: { ...Default.argTypes },
};

export const Inline: Story = {
  args: {
    ...Default.args,
    inline: true,
    helperText: undefined,
  },
  argTypes: { ...Default.argTypes },
};
