import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Form } from '../../components/form/form';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { TextInput } from '../../components/text-input/text-input';
import { Grid } from '../../components/grid/grid';
import { Column } from '../../components/grid/column';
import { Theme, ThemeProps } from '../../components/theme/theme';
import { component$ } from '@builder.io/qwik';
import './theme.scss';
import { Checkbox } from '../../components/checkbox/checkbox';

const ThemeWrapper = component$<ThemeProps>(props => {
  return (
    <CarbonRoot>
      <Theme {...props}>
        <Form>
          <Grid>
            <Column lg={4} md={3} sm={2} style="margin-bottom: 0.5rem">
              <TextInput value="Some text" labelText="Text"></TextInput>
              <Checkbox labelText="Confirmed" checked />
            </Column>
          </Grid>
        </Form>
      </Theme>
    </CarbonRoot>
  );
});

const meta: Meta<ThemeProps> = {
  title: 'Themes/Theme',
  component: Theme,
  args: {
    theme: 'white',
  },
  tags: ['autodocs'],
  render: args => <ThemeWrapper {...args} />,
};

export default meta;

type Story = StoryObj<ThemeProps>;

export const Default: Story = {
  args: {
    theme: 'white',
    class: '',
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['white', 'g10', 'g90', 'g100'],
      description: 'Set the theme',
    },
    class: {
      description: 'HTML class attribute',
    },
  },
  parameters: {},
};
